<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as InputGroup from '$lib/components/ui/input-group';
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select';
  import { Switch } from '$lib/components/ui/switch';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { m } from '$lib/paraglide/messages';
  import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
  import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark';

  type CashoutKind = 'fixed' | 'profit_percentage' | 'bankroll_percentage';

  export type Cashout = {
    enabled: boolean;
    interval: number;
    kind: CashoutKind;
    amount: number;
    percentage: number;
  };

  interface CashoutProps {
    cashout: Cashout;
  }

  let { cashout = $bindable() }: CashoutProps = $props();

  const cashoutTypes: Record<CashoutKind, string> = {
    fixed: m['params.cashout.fixed'](),
    profit_percentage: m['params.cashout.profit_percentage'](),
    bankroll_percentage: m['params.cashout.bankroll_percentage'](),
  };

  const triggerContent = $derived(cashoutTypes[cashout.kind] ?? m['params.cashout.select']());
</script>

<Card.Root size="sm">
  <Card.Header>
    <Card.Title class="flex items-center justify-between font-semibold">
      <span>{m['params.cashout.title']()}</span>
      <Switch
        class="cursor-pointer"
        bind:checked={cashout.enabled}
      />
    </Card.Title>
  </Card.Header>
  {#if cashout.enabled}
    <Card.Content class="grid gap-3">
      <div class="grid gap-0.5">
        <Label
          for="interval"
          class="flex items-center gap-1 text-xs"
        >
          {m['params.cashout.interval']()}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <CircleQuestionMark class="size-3 text-primary" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{m['params.cashout.interval_tooltip']()}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Label>
        <InputGroup.Root>
          <InputGroup.Input
            id="interval"
            type="number"
            step="100"
            bind:value={cashout.interval}
          />
        </InputGroup.Root>
      </div>

      <div class="grid gap-3">
        <div>
          <span class="text-xs font-medium">{m['params.cashout.type']()}</span>
          <Select.Root
            type="single"
            bind:value={cashout.kind}
          >
            <Select.Trigger
              size="sm"
              class="cursor-pointer text-xs">{triggerContent}</Select.Trigger
            >
            <Select.Content>
              <Select.Group>
                <Select.Label>{m['params.cashout.type']()}</Select.Label>
                {#each Object.entries(cashoutTypes) as [value, label] (value)}
                  <Select.Item
                    class="cursor-pointer"
                    {value}
                    {label}
                  >
                    {label}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        {#if cashout.kind === 'fixed'}
          <div class="grid gap-0.5">
            <Label
              for="amount"
              class="text-xs"
            >
              {m['params.cashout.amount']()}
            </Label>
            <InputGroup.Root>
              <InputGroup.Addon class="pl-1">
                <CircleDollarSign />
              </InputGroup.Addon>
              <InputGroup.Input
                id="amount"
                type="number"
                bind:value={cashout.amount}
              />
            </InputGroup.Root>
          </div>
        {:else}
          <div class="grid gap-0.5">
            <Label
              for={'percent_' + cashout.kind}
              class="text-xs"
            >
              {m['params.cashout.percentage']()} (0-100)
            </Label>
            <InputGroup.Root>
              <InputGroup.Input
                id={'percent_' + cashout.kind}
                type="number"
                step="1"
                min="0"
                max="100"
                bind:value={cashout.percentage}
              />
            </InputGroup.Root>
          </div>
        {/if}
      </div>
    </Card.Content>
  {/if}
</Card.Root>
