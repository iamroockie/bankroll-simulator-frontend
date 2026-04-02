<script lang="ts">
  import { locales, localizeHref } from '$lib/paraglide/runtime';
  import { page } from '$app/state';
  import './layout.css';
  import { onMount } from 'svelte';
  import Locale from '$lib/components/Locale.svelte';
  import Theme from '$lib/components/Theme.svelte';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined';
  import type { LayoutProps } from './$types';

  let { data, children }: LayoutProps = $props();
  let loading = $state(true);

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 1000);
  });
</script>

{#if loading}
  <div class="fixed inset-0 top-0 left-0 z-50 grid place-items-center bg-background">
    <div class="loading-wave">
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
      <div class="loading-bar"></div>
    </div>
  </div>
{/if}

<div class="flex min-h-screen flex-col bg-stone-50 dark:bg-slate-950">
  <header
    class="sticky top-0 z-10 border-b border-border bg-background shadow dark:shadow-slate-700"
  >
    <div class="mx-auto flex h-12 max-w-300 items-center justify-between px-6">
      <div class="flex items-center gap-x-2">
        <ChartNoAxesCombined
          size={20}
          class="text-primary"
        />
        <span class="text-lg font-semibold">Bankroll Simulator</span>
      </div>
      <div class="flex items-center gap-x-2">
        <Theme theme={data.theme} />
        <Locale />
      </div>
    </div>
  </header>

  {@render children()}
</div>

<Toaster
  richColors
  position="top-center"
/>

<div style="display:none">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
