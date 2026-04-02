<script lang="ts">
  import { toast } from 'svelte-sonner';
  import BankrollParams from '$lib/components/params/BankrollParams.svelte';
  import CashoutParams from '$lib/components/params/CashoutParams.svelte';
  import LimitParams from '$lib/components/params/LimitParams.svelte';
  import ProbabilityParams from '$lib/components/params/ProbabilityParams.svelte';
  import SimulationParams from '$lib/components/params/SimulationParams.svelte';
  import Results from '$lib/components/Results.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as m from '$lib/paraglide/messages.js';
  import type { CashoutRule, Limit, ProbabilityQuery, SimState, SimulateRequest } from '$lib/types';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import Play from '@lucide/svelte/icons/play';

  let params = $state({
    bankroll: {
      starting: 3_000,
      bustThreshold: 1_000,
    },
    simulation: {
      totalHands: 1_500_000,
      numSimulations: 10_000,
    },
    activeLimits: [] as Limit[],
    cashoutRule: {
      enabled: false,
      interval: 50_000,
      kind: 'profit_percentage' as 'fixed' | 'profit_percentage' | 'bankroll_percentage',
      amount: 500,
      percentage: 50,
    },
    probabilityQueries: [] as ProbabilityQuery[],
  });

  let simState: SimState = $state({ status: 'idle' });

  function validate(): string[] {
    const errors: string[] = [];

    if (params.activeLimits.length === 0) errors.push(m['validate.no_limits']());
    if (params.bankroll.starting <= 0) errors.push(m['validate.bankroll_positive']());
    if (params.bankroll.starting <= params.bankroll.bustThreshold)
      errors.push(m['validate.bankroll_gt_bust']());

    if (params.cashoutRule.enabled) {
      if (params.cashoutRule.interval <= 0) errors.push(m['validate.cashout_interval']());
      if (params.cashoutRule.kind === 'fixed' && params.cashoutRule.amount <= 0)
        errors.push(m['validate.cashout_amount']());
      if (
        params.cashoutRule.kind !== 'fixed' &&
        (params.cashoutRule.percentage < 1 || params.cashoutRule.percentage > 100)
      )
        errors.push(m['validate.cashout_percentage']());
    }

    for (const q of params.probabilityQueries) {
      if ((q.type === 'reach_profit' || q.type === 'reach_bankroll') && q.target <= 0)
        errors.push(m['validate.probability_target']());
      if (q.type === 'at_limit_or_above' && !q.limit)
        errors.push(m['validate.probability_limit']());
    }

    return errors;
  }

  function buildRequest(): SimulateRequest {
    let cashout_rule: CashoutRule | undefined;
    if (params.cashoutRule.enabled) {
      const { kind, amount, percentage, interval } = params.cashoutRule;
      cashout_rule = {
        interval_hands: interval,
        kind:
          kind === 'fixed'
            ? { type: 'fixed', amount }
            : { type: kind, percentage: percentage / 100 },
      };
    }

    return {
      starting_bankroll: params.bankroll.starting,
      bust_bankroll: params.bankroll.bustThreshold,
      num_simulations: params.simulation.numSimulations,
      total_hands: params.simulation.totalHands,
      limits: params.activeLimits,
      cashout_rule,
      probability_queries:
        params.probabilityQueries.length > 0 ? params.probabilityQueries : undefined,
    };
  }

  async function simulate() {
    const errors = validate();
    if (errors.length > 0) {
      for (const error of errors) toast.error(error);
      return;
    }

    simState = { status: 'loading' };

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildRequest()),
      });

      if (!res.ok) {
        const text = await res.text();
        simState = { status: 'error', message: text || res.statusText };
        return;
      }

      const data = await res.json();
      simState = { status: 'success', data };
    } catch (e) {
      simState = {
        status: 'error',
        message: e instanceof Error ? e.message : m['simulate.error'](),
      };
    }
  }
</script>

<main
  class="mx-auto grid w-full max-w-300 grid-cols-[380px_1fr] items-start gap-6 p-6 max-lg:grid-cols-1 max-lg:p-4"
>
  <aside>
    <form class="flex flex-col gap-4">
      <BankrollParams
        bind:startingBankroll={params.bankroll.starting}
        bind:bustThreshold={params.bankroll.bustThreshold}
      />

      <SimulationParams
        bind:totalHands={params.simulation.totalHands}
        bind:numSimulations={params.simulation.numSimulations}
      />

      <LimitParams bind:activeLimits={params.activeLimits} />

      <CashoutParams bind:cashout={params.cashoutRule} />

      <ProbabilityParams bind:queries={params.probabilityQueries} />

      <Button
        type="button"
        onclick={simulate}
        disabled={simState.status === 'loading'}
        class="w-full cursor-pointer hover:bg-primary/90"
      >
        {#if simState.status === 'loading'}
          <LoaderCircle class="animate-spin" />
          {m['simulate.running']()}
        {:else}
          <Play />
          {m['simulate.run']()}
        {/if}
      </Button>
    </form>
  </aside>

  <Results {simState} />
</main>
