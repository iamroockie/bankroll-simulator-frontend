<script lang="ts">
  import { onMount } from 'svelte';
  import { buttonVariants } from '$lib/components/ui/button/index';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import { m } from '$lib/paraglide/messages.js';
  import type { Theme } from '$lib/types';
  import { invalidateAll } from '$app/navigation';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import SunIcon from '@lucide/svelte/icons/sun';

  let { theme = 'system' } = $props<{ theme?: Theme }>();

  let currentTheme = $derived(theme);
  let themes: Theme[] = ['light', 'dark', 'system'];

  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      if (currentTheme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  });

  async function setTheme(themeName: Theme) {
    currentTheme = themeName;

    let themeToApply = themeName;

    if (themeName === 'system') {
      themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.classList.toggle('dark', themeToApply === 'dark');

    await fetch('/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme: themeName }),
    });

    await invalidateAll();
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="{buttonVariants({ variant: 'outline', size: 'icon-sm' })} cursor-pointer"
  >
    <SunIcon class="scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
    <MoonIcon class="absolute scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
    <span class="sr-only">{m['theme.change']()}</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>{m['theme.change']()}</DropdownMenu.Label>

    <DropdownMenu.Separator />

    {#each themes as t}
      <DropdownMenu.CheckboxItem
        checked={currentTheme === t}
        onclick={() => setTheme(t)}
        class="cursor-pointer"
      >
        {m[`theme.${t}`]()}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
