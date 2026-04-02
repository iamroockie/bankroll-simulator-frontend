<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as InputGroup from '$lib/components/ui/input-group';
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { LIMIT_PRESETS } from '$lib/limits';
  import { m } from '$lib/paraglide/messages';
  import type { ProbabilityQuery } from '$lib/types';
  import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
  import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark';
  import Plus from '@lucide/svelte/icons/plus';
  import Trash2 from '@lucide/svelte/icons/trash-2';

  interface ProbabilityProps {
    queries: ProbabilityQuery[];
  }

  let { queries = $bindable() }: ProbabilityProps = $props();

  type QueryType = ProbabilityQuery['type'];

  const queryTypes: Record<QueryType, string> = $derived({
    bust: m['params.probability.bust'](),
    reach_profit: m['params.probability.reach_profit'](),
    reach_bankroll: m['params.probability.reach_bankroll'](),
    at_limit_or_above: m['params.probability.at_limit_or_above'](),
  });

  const queryTooltips: Record<QueryType, string> = $derived({
    bust: m['params.probability.bust_tooltip'](),
    reach_profit: m['params.probability.reach_profit_tooltip'](),
    reach_bankroll: m['params.probability.reach_bankroll_tooltip'](),
    at_limit_or_above: m['params.probability.at_limit_tooltip'](),
  });

  function addQuery() {
    queries = [...queries, { type: 'bust' }];
  }

  function removeQuery(index: number) {
    queries = queries.filter((_, i) => i !== index);
  }

  function changeType(index: number, newType: QueryType) {
    const updated = [...queries];
    if (newType === 'bust') {
      updated[index] = { type: 'bust' };
    } else if (newType === 'reach_profit') {
      updated[index] = { type: 'reach_profit', target: 10_000 };
    } else if (newType === 'reach_bankroll') {
      updated[index] = { type: 'reach_bankroll', target: 10_000 };
    } else {
      updated[index] = { type: 'at_limit_or_above', limit: LIMIT_PRESETS[0].name };
    }
    queries = updated;
  }
</script>

<Card.Root size="sm">
  <Card.Header>
    <Card.Title class="flex items-center justify-between font-semibold">
      <span>{m['params.probability.title']()}</span>
      <Button
        variant="outline"
        size="xs"
        class="cursor-pointer"
        onclick={addQuery}
      >
        <Plus data-icon="inline-start" />
        {m['params.probability.add']()}
      </Button>
    </Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-2">
    {#if queries.length === 0}
      <p class="p-2 text-center text-xs text-muted-foreground">
        {m['params.probability.empty']()}
      </p>
    {:else}
      {#each queries as query, i (i)}
        <div class="flex items-end gap-2 rounded-md border border-ring px-3 py-2.5">
          <div class="grid flex-1 gap-2">
            <div class="grid gap-1">
              <span class="flex items-center gap-1 text-xs font-medium">
                <span>{m['params.probability.type']()}</span>
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <CircleQuestionMark class="size-3 text-primary" />
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>{queryTooltips[query.type]}</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </span>
              <Select.Root
                type="single"
                value={query.type}
                onValueChange={(v) => v && changeType(i, v as QueryType)}
              >
                <Select.Trigger
                  size="sm"
                  class="cursor-pointer text-xs"
                >
                  {queryTypes[query.type]}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each Object.entries(queryTypes) as [value, label] (value)}
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

            {#if query.type === 'reach_profit' || query.type === 'reach_bankroll'}
              <div class="grid gap-0.5">
                <Label
                  for={`prob_target_${i}`}
                  class="text-xs"
                >
                  {m['params.probability.target']()}
                </Label>
                <InputGroup.Root>
                  <InputGroup.Addon class="pl-1">
                    <CircleDollarSign />
                  </InputGroup.Addon>
                  <InputGroup.Input
                    id={`prob_target_${i}`}
                    type="number"
                    bind:value={query.target}
                  />
                </InputGroup.Root>
              </div>
            {/if}

            {#if query.type === 'at_limit_or_above'}
              <div>
                <span class="text-xs font-medium">
                  <span>{m['params.probability.limit']()}</span>
                </span>
                <Select.Root
                  type="single"
                  bind:value={query.limit}
                >
                  <Select.Trigger
                    size="sm"
                    class="cursor-pointer text-xs"
                  >
                    {query.limit}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {#each LIMIT_PRESETS as preset (preset.name)}
                        <Select.Item
                          class="cursor-pointer"
                          value={preset.name}
                          label={preset.name}
                        >
                          {preset.name}
                        </Select.Item>
                      {/each}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            {/if}
          </div>

          <Button
            variant="ghost"
            size="icon-xs"
            class="shrink-0 cursor-pointer text-muted-foreground hover:text-destructive"
            onclick={() => removeQuery(i)}
          >
            <Trash2 />
          </Button>
        </div>
      {/each}
    {/if}
  </Card.Content>
</Card.Root>
