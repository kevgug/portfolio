<script lang="ts">
  import "../../../app.css";
  import { page } from "$app/stores";
  import Icon from "$lib/components/Icon.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import Footer from "$lib/views/Footer.svelte";
  import {
    subheaders,
    selectedIndex,
    withScrollLock,
  } from "$lib/stores/essayNav";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";

  // Only show this layout's content when actually on an essay slug route
  $: isEssaySlug = /^\/essays\/[^/]+\/?$/.test($page.url.pathname);

  function handleDropdownSelect(index: number) {
    selectedIndex.set(index);
    const unsubscribe = subheaders.subscribe(async (list) => {
      const item = list[index];
      if (!item) return;
      await withScrollLock(async () => {
        const totalOffset = getResponsiveOffset({ spacing: "lg" });
        await reliableScrollToElement(`#${item.id}`, {
          duration: 600,
          ease: "out-expo",
          offset: totalOffset,
        });
      });
    });
    unsubscribe();
  }
</script>

{#if isEssaySlug}
  {#key $page.url.pathname}
    <nav class="w-full fixed top-0 z-50 bg-transparent pointer-events-none">
      <!-- Gradient: fades from background at top to transparent at bottom -->
      <div
        class="absolute inset-x-0 top-0 h-28 md:h-32 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none"
      />
      <div
        class="relative z-10 flex flex-row justify-between items-center mx-auto w-full max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] h-16 md:h-20"
      >
        <!-- Left: Back to essays -->
        <div
          class="flex flex-row items-center space-x-2 md:space-x-3 pointer-events-auto"
        >
          <a href="/essays" aria-label="Back to essays" class="p-2 -ml-2" data-sveltekit-reload>
            <Icon name="arrow-left" size="1em" class="text-white" />
          </a>
        </div>

        <!-- Right: section dropdown (subtle) -->
        <div class="flex items-center pointer-events-auto">
          <Dropdown
            items={$subheaders}
            selectedIndex={$selectedIndex}
            variant="subtle"
            on:select={(e) => handleDropdownSelect(e.detail.index)}
          />
        </div>
      </div>
    </nav>

    <div
      class="flex flex-col mx-auto w-screen max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] pt-20 md:pt-24 space-y-8"
    >
      <slot />
      <Footer />
    </div>
  {/key}
{:else}
  <slot />
{/if}
