<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import * as Card from '$lib/components/ui/card';
  import * as InputGroup from '$lib/components/ui/input-group';
  import { Label } from '$lib/components/ui/label';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import { LIMIT_PRESETS } from '$lib/limits';
  import { m } from '$lib/paraglide/messages';
  import { type Limit } from '$lib/types';
  import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';

  let selectedNames = $state<string[]>([]);

  let { activeLimits = $bindable(filterLimits()) }: { activeLimits: Limit[] } = $props();

  $effect(() => {
    activeLimits = filterLimits();
  });

  function filterLimits() {
    return LIMIT_PRESETS.filter((l) => selectedNames.includes(l.name));
  }
</script>

<Card.Root size="sm">
  <Card.Header>
    <Card.Title class="font-semibold">{m['params.limits.title']()}</Card.Title>
  </Card.Header>
  <Card.Content class="grid gap-3">
    <ToggleGroup.Root
      class="flex-wrap justify-center"
      bind:value={selectedNames}
      type="multiple"
      variant="outline"
      spacing={2}
      size="sm"
    >
      {#each LIMIT_PRESETS as limit}
        <ToggleGroup.Item
          value={limit.name}
          aria-label={limit.name}
          class="cursor-pointer data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {limit.name}
        </ToggleGroup.Item>
      {/each}
    </ToggleGroup.Root>

    {#if activeLimits.length > 0}
      <div class="flex flex-col">
        {#each activeLimits as limit, i (limit.name)}
          {@const isTop = i === activeLimits.length - 1}

          <!-- Limit card -->
          <div class="grid gap-2 rounded-md border border-ring px-3.5 py-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold">{limit.name}</span>
              <Badge
                variant="muted"
                class="text-[10px]"
              >
                BB: ${limit.bb_size.toFixed(2)}
              </Badge>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="flex flex-col gap-1">
                <Label
                  for={`ev_${limit.name}`}
                  class="text-xs"
                >
                  EV BB/100
                </Label>
                <InputGroup.Root>
                  <InputGroup.Input
                    id={`ev_${limit.name}`}
                    type="number"
                    step="0.1"
                    placeholder="0.00"
                    bind:value={limit.ev_per_100}
                  />
                </InputGroup.Root>
              </div>
              <div class="flex flex-col gap-1">
                <Label
                  for={`std_dev_${limit.name}`}
                  class="text-xs"
                >
                  StdDev BB/100
                </Label>
                <InputGroup.Root>
                  <InputGroup.Input
                    id={`std_dev_${limit.name}`}
                    type="number"
                    step="0.5"
                    placeholder="0.00"
                    bind:value={limit.std_dev_per_100}
                  />
                </InputGroup.Root>
              </div>
            </div>
          </div>

          <!-- Threshold between limits -->
          {#if !isTop}
            {@const nextLimit = activeLimits[i + 1]}
            <div class="flex items-stretch gap-0 px-4">
              <div class="mx-auto w-0.5 shrink-0 bg-border"></div>
              <div class="flex flex-1 flex-col gap-1.5 py-2 pl-3.5">
                <div class="flex items-center justify-between gap-2">
                  <InputGroup.Root class="w-30">
                    <InputGroup.Addon class="pl-1">
                      <CircleDollarSign />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      id={`move_up_at_${nextLimit.name}`}
                      type="number"
                      bind:value={limit.move_up_at}
                    />
                  </InputGroup.Root>
                  <span class="text-text-3 flex-1 text-xs">
                    ↑
                    {m['params.limits.up']()}
                    {nextLimit.name}
                  </span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <InputGroup.Root class="w-30">
                    <InputGroup.Addon class="pl-1">
                      <CircleDollarSign />
                    </InputGroup.Addon>
                    <InputGroup.Input
                      id={`move_down_at_${limit.name}`}
                      type="number"
                      bind:value={nextLimit.move_down_at}
                    />
                  </InputGroup.Root>
                  <span class="text-text-3 flex-1 text-xs">
                    ↓
                    {m['params.limits.down']()}
                    {limit.name}
                  </span>
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {:else}
      <p class="p-2 text-center text-xs text-muted-foreground">
        {m['params.limits.select_limits']()}
      </p>
    {/if}
  </Card.Content>
</Card.Root>
