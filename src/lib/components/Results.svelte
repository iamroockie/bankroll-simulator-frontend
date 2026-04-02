<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as m from '$lib/paraglide/messages.js';
  import type { QueryResult, SimState } from '$lib/types';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

  interface ResultsProps {
    simState: SimState;
  }

  let { simState }: ResultsProps = $props();

  const queryTypeLabels: Record<string, () => string> = {
    bust: () => m['params.probability.bust'](),
    reach_profit: () => m['params.probability.reach_profit'](),
    reach_bankroll: () => m['params.probability.reach_bankroll'](),
    at_limit_or_above: () => m['params.probability.at_limit_or_above'](),
  };

  function formatDollars(value: number): string {
    return (
      '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    );
  }

  function formatPercent(value: number): string {
    return (value * 100).toFixed(2) + '%';
  }

  function dollarColor(value: number): string {
    return value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
  }

  function probColor(value: number): string {
    const pct = value * 100;
    if (pct >= 70) return 'text-emerald-600 dark:text-emerald-400';
    if (pct >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }

  function bustProbColor(value: number): string {
    const pct = value * 100;
    if (pct <= 10) return 'text-emerald-600 dark:text-emerald-400';
    if (pct <= 30) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  }

  function queryLabel(q: QueryResult): string {
    const base = queryTypeLabels[q.type]?.() ?? q.type;
    if (q.target != null) return `${base} ${formatDollars(q.target)}`;
    if (q.limit != null) return `${base} ${q.limit}`;
    return base;
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{m['results.title']()}</Card.Title>
  </Card.Header>

  <Card.Content>
    {#if simState.status === 'idle'}
      <p class="text-sm text-muted-foreground">{m['results.empty']()}</p>
    {:else if simState.status === 'loading'}
      <div class="flex items-center justify-center py-8">
        <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
      </div>
    {:else if simState.status === 'error'}
      <div class="flex items-center gap-2 text-sm text-destructive">
        <TriangleAlert class="size-4 shrink-0" />
        <p>{simState.message}</p>
      </div>
    {:else}
      {@const data = simState.data}
      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-1">
            <span class="text-xs text-muted-foreground">{m['results.ci_70']()}</span>
            <span class="text-sm font-medium">
              <span class={dollarColor(data.ci_70.low)}>{formatDollars(data.ci_70.low)}</span>
              &ndash;
              <span class={dollarColor(data.ci_70.high)}>{formatDollars(data.ci_70.high)}</span>
            </span>
          </div>
          <div class="grid gap-1">
            <span class="text-xs text-muted-foreground">{m['results.ci_95']()}</span>
            <span class="text-sm font-medium">
              <span class={dollarColor(data.ci_95.low)}>{formatDollars(data.ci_95.low)}</span>
              &ndash;
              <span class={dollarColor(data.ci_95.high)}>{formatDollars(data.ci_95.high)}</span>
            </span>
          </div>
          <div class="grid gap-1">
            <span class="text-xs text-muted-foreground">{m['results.best']()}</span>
            <span class="text-sm font-medium {dollarColor(data.best)}"
              >{formatDollars(data.best)}</span
            >
          </div>
          <div class="grid gap-1">
            <span class="text-xs text-muted-foreground">{m['results.worst']()}</span>
            <span class="text-sm font-medium {dollarColor(data.worst)}"
              >{formatDollars(data.worst)}</span
            >
          </div>
        </div>

        {#if data.probability_queries.length > 0}
          <Separator />
          <div class="grid gap-2">
            <span class="text-xs font-medium text-muted-foreground"
              >{m['results.probability']()}</span
            >
            {#each data.probability_queries as q, i (i)}
              <div class="flex items-center justify-between text-sm">
                <span>{queryLabel(q)}</span>
                <span
                  class="font-medium {q.type === 'bust' ? bustProbColor(q.probability) : probColor(q.probability)}"
                  >{formatPercent(q.probability)}</span
                >
              </div>
            {/each}
          </div>
        {/if}

        <Separator />
        <p class="text-xs text-muted-foreground">
          {m['results.elapsed']()}
          {data.elapsed_seconds.toFixed(2)}s
        </p>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
