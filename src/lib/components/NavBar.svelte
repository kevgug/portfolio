<script lang="ts">
  import { page } from "$app/stores";
  import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";
  import MenuOverlay from "$lib/components/MenuOverlay.svelte";
  import { onMount } from "svelte";

  let menuOpen = false;

  // Tabs
  let homeEl: HTMLAnchorElement | null = null;
  let essaysEl: HTMLAnchorElement | null = null;
  let tabsEl: HTMLDivElement | null = null;
  let indicatorLeft = 0;
  let indicatorWidth = 0;

  function isEssaysIndex(pathname: string): boolean {
    return pathname === "/essays";
  }

  function updateIndicator() {
    if (!homeEl || !essaysEl || !tabsEl) return;
    const pathname = $page.url.pathname;
    const target = isEssaysIndex(pathname) ? essaysEl : homeEl;
    const rect = target.getBoundingClientRect();
    const containerRect = tabsEl.getBoundingClientRect();
    indicatorLeft = rect.left - containerRect.left;
    indicatorWidth = rect.width;
  }

  $: $page, updateIndicator();

  onMount(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    try {
      // Ensure correct sizing after web fonts load
      // @ts-ignore
      if (document?.fonts?.ready) {
        // @ts-ignore
        document.fonts.ready.then(() => updateIndicator());
      }
    } catch {}
    return () => window.removeEventListener("resize", onResize);
  });
</script>

<MenuOverlay bind:open={menuOpen} />

<nav
  class="w-full fixed top-0 z-50 backdrop-blur-md bg-background/70 border-b border-white/10"
>
  <div
    class="flex flex-row justify-between items-center mx-auto w-full max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] h-16 md:h-20"
  >
    <!-- Left side -->
    <div class="flex flex-row items-center space-x-2 md:space-x-3">
      <HamburgerMenu bind:open={menuOpen} />
    </div>

    <!-- Right side -->
    <div class="flex items-center">
      <div
        class="relative inline-flex items-center gap-6 md:gap-8"
        bind:this={tabsEl}
      >
        <a
          bind:this={homeEl}
          href="/"
          class="text-sm md:text-base text-muted-text-grey hover:text-white transition-colors"
          aria-current={$page.url.pathname === "/" ? "page" : undefined}>Home</a
        >
        <a
          bind:this={essaysEl}
          href="/essays"
          class="text-sm md:text-base text-muted-text-grey hover:text-white transition-colors"
          aria-current={isEssaysIndex($page.url.pathname) ? "page" : undefined}
          >Essays</a
        >
        <div class="absolute -bottom-2 left-0 w-full h-px bg-white/10" />
        <div
          class="absolute -bottom-2 h-[2px] bg-white transition-all duration-300 ease-out"
          style={`transform: translateX(${indicatorLeft}px); width: ${indicatorWidth}px;`}
        />
      </div>
    </div>
  </div>
</nav>
