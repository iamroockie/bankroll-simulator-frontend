<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Slider } from '$lib/components/ui/slider';
  import { m } from '$lib/paraglide/messages';

  interface SimulationParams {
    totalHands: number;
    numSimulations: number;
  }

  let { totalHands = $bindable(), numSimulations = $bindable() }: SimulationParams = $props();
</script>

<Card.Root size="sm">
  <Card.Header>
    <Card.Title class="font-semibold">{m['params.simulation.title']()}</Card.Title>
  </Card.Header>
  <Card.Content class="flex flex-col gap-3">
    <div class="grid gap-0.5">
      <Label class="flex justify-between text-xs">
        <span>{m['params.simulation.hands']()}</span>
        <span class="text-primary">{totalHands}</span>
      </Label>
      <Slider
        type="single"
        bind:value={totalHands}
        min={100_000}
        max={10_000_000}
        step={50_000}
      />
      <div class="flex justify-between text-[10px] text-ring">
        <span>100K</span>
        <span>5M</span>
      </div>
    </div>
    <div class="grid gap-0.5">
      <Label class="flex justify-between text-xs">
        <span>{m['params.simulation.simulations']()}</span>
        <span class="text-primary">{numSimulations}</span>
      </Label>
      <Slider
        type="single"
        bind:value={numSimulations}
        min={1_000}
        max={30_000}
        step={100}
      />
      <div class="flex justify-between text-[10px] text-ring">
        <span>1K</span>
        <span>30K</span>
      </div>
    </div>
  </Card.Content>
</Card.Root>
