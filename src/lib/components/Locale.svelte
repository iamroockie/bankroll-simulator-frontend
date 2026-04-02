<script lang="ts">
  import { buttonVariants } from '$lib/components/ui/button/index';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import { m } from '$lib/paraglide/messages';
  import { getLocale, setLocale, type Locale } from '$lib/paraglide/runtime';
  import Globe from '@lucide/svelte/icons/globe';

  let locale: Record<Locale, string> = {
    ru: 'Русский',
    en: 'English',
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="{buttonVariants({ variant: 'outline', size: 'icon-sm' })} cursor-pointer"
  >
    <Globe />
    <span class="sr-only">{m['locale.change']()}</span>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>{m['locale.change']()}</DropdownMenu.Label>

    <DropdownMenu.Separator />

    {#each Object.entries(locale) as [l, name]}
      <DropdownMenu.CheckboxItem
        checked={getLocale() === l}
        onclick={() => setLocale(l as Locale)}
        class="cursor-pointer"
      >
        {name}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
