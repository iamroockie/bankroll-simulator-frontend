<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as InputGroup from '$lib/components/ui/input-group';
  import { Label } from '$lib/components/ui/label';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { m } from '$lib/paraglide/messages';
  import CircleDollarSign from '@lucide/svelte/icons/circle-dollar-sign';
  import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark';

  interface BankrollParams {
    startingBankroll: number;
    bustThreshold: number;
  }

  let { startingBankroll = $bindable(), bustThreshold = $bindable() }: BankrollParams = $props();
</script>

<Card.Root size="sm">
  <Card.Header>
    <Card.Title class="font-semibold">{m['params.bankroll.title']()}</Card.Title>
  </Card.Header>
  <Card.Content class="grid grid-cols-2 gap-x-3">
    <div class="grid gap-0.5">
      <Label
        for="starting"
        class="text-xs"
      >
        {m['params.bankroll.starting']()}
      </Label>
      <InputGroup.Root>
        <InputGroup.Addon class="pl-1">
          <CircleDollarSign />
        </InputGroup.Addon>
        <InputGroup.Input
          id="starting"
          type="number"
          placeholder="0.00"
          bind:value={startingBankroll}
        />
      </InputGroup.Root>
    </div>

    <div class="grid gap-0.5">
      <Label
        for="bust"
        class="flex items-center gap-1 text-xs"
      >
        {m['params.bankroll.bust_threshold']()}
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <CircleQuestionMark class="size-3 text-primary" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{m['params.bankroll.bust_threshold_tooltip']()}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Label>
      <InputGroup.Root>
        <InputGroup.Addon class="pl-1">
          <CircleDollarSign />
        </InputGroup.Addon>
        <InputGroup.Input
          id="bust"
          type="number"
          placeholder="0.00"
          bind:value={bustThreshold}
        />
      </InputGroup.Root>
    </div>
  </Card.Content>
</Card.Root>
