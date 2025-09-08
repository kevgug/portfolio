<script lang="ts">
  import { page, navigating } from "$app/stores";
  import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";
  import MenuOverlay from "$lib/components/MenuOverlay.svelte";
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let menuOpen = false;

  // Tabs
  let homeEl: HTMLAnchorElement | null = null;
  let essaysEl: HTMLAnchorElement | null = null;
  let tabsEl: HTMLDivElement | null = null;
  let indicatorLeft = 0;
  let indicatorWidth = 0;
  let shouldAnimate = false;
  let hasMeasured = false;
  let showIndicator = false;

  // Hide global nav while on or navigating to an essay detail route
  $: hideNav =
    $page.url.pathname.startsWith("/essays/") ||
    (!!$navigating && $navigating.to?.url?.pathname?.startsWith("/essays/"));

  function isEssaysRoute(pathname: string): boolean {
    return pathname.startsWith("/essays");
  }

  function updateIndicator() {
    if (!homeEl || !essaysEl || !tabsEl) return;
    const pathname = $page.url.pathname;
    const target = isEssaysRoute(pathname) ? essaysEl : homeEl;
    const rect = target.getBoundingClientRect();
    const containerRect = tabsEl.getBoundingClientRect();
    indicatorLeft = rect.left - containerRect.left;
    indicatorWidth = rect.width;
    hasMeasured = true;
    if (!showIndicator) showIndicator = true;
  }

  $: $page, updateIndicator();

  function handleTabClick(event: Event, targetPath: string) {
    const pathname = $page.url.pathname;
    const isHomeRoute = pathname === "/";
    const isEssaysRoute = pathname.startsWith("/essays");
    const isTargetHome = targetPath === "/";
    const isTargetEssays = targetPath === "/essays";

    // Check if clicking on the currently active tab
    const isAlreadyActive =
      (isTargetHome && isHomeRoute) || (isTargetEssays && isEssaysRoute);

    if (isAlreadyActive) {
      // Prevent default navigation and scroll to top
      event.preventDefault();

      // Scroll directly to top of page (position 0) using same logic as MenuOverlay
      const scrollProxy = {
        scrollTop: window.pageYOffset || document.documentElement.scrollTop,
      };

      gsap.to(scrollProxy, {
        duration: 1000 / 1000, // Convert to seconds for GSAP
        scrollTop: 0,
        ease: "expo.out", // Convert "out-expo" to GSAP format
        onUpdate: () => {
          window.scrollTo(0, scrollProxy.scrollTop);
        },
      });
    }
    // If not already active, let the default navigation happen
  }

  onMount(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);

    const enableAnimation = () => {
      // enable after next paint so style binding (no-transition) is applied first
      requestAnimationFrame(() => {
        shouldAnimate = true;
      });
    };

    try {
      // Ensure correct sizing after web fonts load to avoid initial slide
      // @ts-ignore
      if (document?.fonts?.ready) {
        // @ts-ignore
        document.fonts.ready.then(() => {
          updateIndicator();
          enableAnimation();
        });
      } else {
        // Fallback: enable after a short delay
        setTimeout(() => {
          updateIndicator();
          enableAnimation();
        }, 150);
      }
    } catch {
      // Safety fallback
      setTimeout(() => {
        updateIndicator();
        enableAnimation();
      }, 150);
    }

    return () => window.removeEventListener("resize", onResize);
  });
</script>

{#if !hideNav}
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
          class="relative inline-flex items-center gap-3 md:gap-4"
          bind:this={tabsEl}
        >
          <a
            bind:this={homeEl}
            href="/"
            on:click={(e) => handleTabClick(e, "/")}
            class="text-sm md:text-base text-muted-text-grey hover:text-white transition-colors"
            aria-current={$page.url.pathname === "/" ? "page" : undefined}
            >Home</a
          >
          <a
            bind:this={essaysEl}
            href="/essays"
            on:click={(e) => handleTabClick(e, "/essays")}
            class="text-sm md:text-base text-muted-text-grey hover:text-white transition-colors"
            aria-current={isEssaysRoute($page.url.pathname)
              ? "page"
              : undefined}>Essays</a
          >
          <div
            class="absolute -bottom-[0.4rem] left-0 w-full h-px bg-white/10 rounded-full"
          />
          <div
            class="absolute -bottom-[0.4rem] h-[2px] bg-white transition-all duration-300 ease-out rounded-full"
            style={`opacity: ${
              showIndicator ? 1 : 0
            }; transform: translateX(${indicatorLeft}px); width: ${indicatorWidth}px; ${
              shouldAnimate ? "" : "transition: none;"
            }`}
          />
        </div>
      </div>
    </div>
  </nav>
{/if}
