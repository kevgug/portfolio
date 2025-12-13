<script lang="ts">
  import { projects } from "$lib/projects";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  import { fly, fade } from "svelte/transition";
  import { gsap } from "gsap";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  // Custom logarithmic ease-out curve - super fast start, very slow logarithmic tail
  const logarithmicEaseOut = (t: number): number => {
    // Cubic bezier: (0, 0.7, 0, 0.84) - ease-out with fast start, long slow tail
    const c1x = 0,
      c1y = 0.7,
      c2x = 0,
      c2y = 0.84;

    // Cubic bezier calculation for logarithmic ease-out
    const u = 1 - t;
    return 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t;
  };

  // Custom frontloaded ease-in curve for smooth exit animations
  const frontloadedEaseIn = (t: number): number => {
    // Cubic bezier: (0.55, 0, 1, 0.45) - smooth start, accelerates toward end
    const c1x = 0.55,
      c1y = 0,
      c2x = 1,
      c2y = 0.45;

    // Cubic bezier calculation for frontloaded ease-in
    const u = 1 - t;
    return 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t;
  };

  // Regular ease-in-out curve for fade
  const easeInOut = (t: number): number => {
    // Standard ease-in-out curve
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // Custom exit transition: translation first, then fade with delay
  const customExit = (node: Element, { duration = 250 }) => {
    return {
      duration,
      css: (t: number) => {
        const eased = frontloadedEaseIn(1 - t);
        const translateY = eased * -10;

        // Give translation 100ms to ramp up, then fade for 150ms (t < 0.6)
        const fadeThreshold = 0.6;
        let opacity = 1;

        if (t < fadeThreshold) {
          // Map remaining time to fade progress with ease-in-out
          const fadeProgress = (fadeThreshold - t) / fadeThreshold;
          opacity = 1 - easeInOut(fadeProgress);
        }

        return `
          transform: translateY(${translateY}px);
          opacity: ${opacity};
        `;
      },
    };
  };
  import { onMount } from "svelte";
  import FloatingProjectImage from "$lib/components/FloatingProjectImage.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import type { Project } from "$lib/projects";

  export let open = false;

  // Essays data for /essays page menu
  type EssayListItem = { slug: string; title: string };
  let essays: EssayListItem[] = [];
  let isEssaysPage = false;

  // Tab switch coordination to avoid overlap between lists
  let currentMenuIsEssays = false;
  let showMenuList = true;
  let pendingMenuIsEssays: boolean | null = null;

  // Initialize current menu on mount
  onMount(() => {
    currentMenuIsEssays = $page.url.pathname === "/essays";
  });

  // Desired state based on route
  $: desiredMenuIsEssays = $page.url.pathname === "/essays";

  // When route changes while menu open, first run outro of current list, then swap
  $: if (open && showMenuList && desiredMenuIsEssays !== currentMenuIsEssays) {
    pendingMenuIsEssays = desiredMenuIsEssays;
    showMenuList = false; // triggers out transitions of current list
  }

  function handleMenuOutroEnd() {
    if (pendingMenuIsEssays !== null) {
      currentMenuIsEssays = pendingMenuIsEssays;
      pendingMenuIsEssays = null;
    }
    showMenuList = true; // mount the new list and run its intro
  }

  // If menu closes mid-switch, sync state immediately
  $: if (!open) {
    currentMenuIsEssays = desiredMenuIsEssays;
    showMenuList = true;
    pendingMenuIsEssays = null;
  }

  // Floating image state
  let mouseX = 0;
  let mouseY = 0;
  let hoveredProject: Project | null = null;
  let isDesktop = true;

  // Prevent background scrolling when menu is open
  $: if (typeof document !== "undefined") {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  function handleProjectClick(id: string) {
    const totalOffset = getResponsiveOffset({ spacing: "lg" });

    // Use reliable scroll that handles GSAP animations properly
    reliableScrollToElement(`#${id}`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
      // No onComplete callback - let user control menu state independently of scroll
    });

    // Close menu immediately for better UX (but don't force it closed after scroll)
    open = false;
    hoveredProject = null;
  }

  // Handle escape key to close menu
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      open = false;
      hoveredProject = null;
    }
  }

  // Mouse tracking for floating image
  function handleMouseMove(event: MouseEvent) {
    if (isDesktop) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  }

  // Project hover handlers
  function handleProjectHover(project: Project) {
    if (isDesktop) {
      hoveredProject = project;
    }
  }

  function handleProjectLeave() {
    hoveredProject = null;
  }

  function handleIntroductionClick() {
    // Scroll directly to top of page (position 0)
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

    open = false;
    hoveredProject = null;
  }

  function handleContactClick() {
    const totalOffset = getResponsiveOffset({ spacing: "lg" });

    reliableScrollToElement(`#contact`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
    });

    open = false;
    hoveredProject = null;
  }

  // Check if device is desktop - now enabled for all viewport sizes
  function checkIsDesktop() {
    if (typeof window !== "undefined") {
      isDesktop = true; // Enable hover effects on all viewport sizes
    }
  }

  onMount(() => {
    checkIsDesktop();
    // Fetch essays list for essays menu
    try {
      fetch("/essays/index.json")
        .then((r) => (r.ok ? r.json() : []))
        .then((json: any) => {
          if (Array.isArray(json)) {
            essays = json.map((p) => ({ slug: p.slug, title: p.title }));
          }
        })
        .catch(() => {});
    } catch (_) {}
  });
</script>

<!-- Global event listeners -->
<svelte:window
  on:keydown={handleKeyDown}
  on:mousemove={handleMouseMove}
  on:resize={checkIsDesktop}
  on:load={checkIsDesktop}
/>

{#if open}
  <div
    class="fixed inset-0 bg-background/80 backdrop-blur-xl z-40"
    on:click={() => (open = false)}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") open = false;
    }}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200, delay: 150 }}
  />

  <div
    class="fixed left-0 right-0 top-16 md:top-20 bottom-0 z-40 overflow-y-auto cursor-default"
    on:click={() => (open = false)}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") open = false;
    }}
    role="presentation"
  >
    <div class="px-5 md:px-[2.5rem] xl:px-[5rem] py-8 md:py-12">
      {#if showMenuList}
        <div
          out:fade={{ duration: 250 }}
          in:fade={{ duration: 0 }}
          on:outroend={handleMenuOutroEnd}
        >
          {#if currentMenuIsEssays}
            <ul
              class="flex flex-col items-center space-y-6 list-none font-serif"
              role="menu"
            >
              {#each essays as e, i}
                <li
                  in:fly={{
                    y: 20,
                    duration: 300,
                    delay: 150 + i * 35,
                    easing: logarithmicEaseOut,
                  }}
                  out:customExit={{ duration: 250 }}
                >
                  <button
                    on:click|stopPropagation={() => {
                      goto(`/essays/${e.slug}`);
                      open = false;
                    }}
                    on:mouseenter={handleProjectLeave}
                    on:mouseleave={handleProjectLeave}
                    class="text-xl md:text-2xl xl:text-3xl font-medium text-muted-text-grey hover:text-glacial-blue transition-colors duration-200 focus:outline-none focus:text-glacial-blue px-6 py-2"
                  >
                    {e.title}
                  </button>
                </li>
              {/each}
            </ul>
          {:else}
            <ul
              class="flex flex-col items-center space-y-6 list-none font-serif"
              role="menu"
            >
              <li
                in:fly={{
                  y: 20,
                  duration: 300,
                  delay: 150,
                  easing: logarithmicEaseOut,
                }}
                out:customExit={{ duration: 250 }}
              >
                <button
                  on:click|stopPropagation={handleIntroductionClick}
                  on:mouseenter={handleProjectLeave}
                  on:mouseleave={handleProjectLeave}
                  class="text-base md:text-lg xl:text-xl font-light text-muted-text-grey hover:text-glacial-blue transition-colors duration-200 focus:outline-none focus:text-glacial-blue px-6 py-2 mt-2 md:mt-3 flex items-center space-x-2 group"
                >
                  <Icon
                    name="wave"
                    size="1em"
                    class="group-hover:text-glacial-blue"
                  />
                  <span
                    class="group-hover:text-glacial-blue not-italic transition-colors duration-200"
                    >Introduction</span
                  >
                </button>
              </li>
              <li
                in:fly={{
                  y: 20,
                  duration: 300,
                  delay: 160,
                  easing: logarithmicEaseOut,
                }}
                out:customExit={{ duration: 250 }}
              >
                <button
                  on:click|stopPropagation={handleContactClick}
                  on:mouseenter={handleProjectLeave}
                  on:mouseleave={handleProjectLeave}
                  class="text-base md:text-lg xl:text-xl font-light text-muted-text-grey hover:text-glacial-blue transition-colors duration-200 focus:outline-none focus:text-glacial-blue px-6 py-2 mt-2 md:mt-3 flex items-center space-x-2 group"
                >
                  <Icon
                    name="multiple-neutral-2"
                    size="1em"
                    class="group-hover:text-glacial-blue"
                  />
                  <span
                    class="group-hover:text-glacial-blue not-italic transition-colors duration-200"
                    >Contact info</span
                  >
                </button>
              </li>
              <li
                in:fly={{
                  y: 20,
                  duration: 300,
                  delay: 170,
                  easing: logarithmicEaseOut,
                }}
                out:customExit={{ duration: 250 }}
              >
                <div
                  class="w-24 md:w-36 xl:w-48 h-px rounded-sm mx-auto my-5 md:my-7 bg-white/20"
                />
              </li>
              {#each projects as project, i}
                <li
                  in:fly={{
                    y: 20,
                    duration: 300,
                    delay: 170 + i * 35,
                    easing: logarithmicEaseOut,
                  }}
                  out:customExit={{ duration: 250 }}
                >
                  <button
                    on:click|stopPropagation={() =>
                      handleProjectClick(project.id)}
                    on:mouseenter={() => handleProjectHover(project)}
                    on:mouseleave={handleProjectLeave}
                    class="text-xl md:text-2xl xl:text-3xl font-medium text-muted-text-grey hover:text-glacial-blue transition-colors duration-200 focus:outline-none focus:text-glacial-blue px-6 py-2"
                  >
                    {project.name}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Floating project image -->
<FloatingProjectImage
  imageOptions={hoveredProject?.imgOptions || null}
  projectId={hoveredProject?.id || null}
  isVisible={!!hoveredProject && isDesktop && open}
  {mouseX}
  {mouseY}
/>

<style>
  /* Override global list styling for menu items */
  ul {
    list-style: none !important;
    padding-left: 0 !important;
    margin: 0 !important;
  }

  li {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
    position: static !important; /* Override global relative positioning */

    /* Safari-specific fixes for animation rendering */
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    will-change: transform;

    /* Improve text rendering during animations */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Remove global bullet point pseudo-elements */
  li::before {
    display: none !important;
    content: none !important;
  }

  /* Ensure no margin bottom from global styles */
  li:not(:last-child) {
    margin-bottom: 0 !important;
  }

  /* Additional Safari-specific fixes for buttons and icons */
  li button {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    will-change: transform;
  }

  /* Ensure icons don't shift during animations */
  li button :global(svg) {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    will-change: auto;
  }
</style>
