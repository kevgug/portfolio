<script lang="ts">
  import { onMount } from "svelte";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";

  // Import project images
  import multiCraftSrc from "$lib/images/projects/multiplayer-infinite-craft.jpg";
  import freestyleBlogSrc from "$lib/images/projects/freestyle-blog.jpg";
  import gridLinkSrc from "$lib/images/projects/gridlink-landingpage.jpg";
  import arcForIosMediumSrc from "$lib/images/projects/arcforios-medium.jpg";
  import zeestaLabsLockupSrc from "$lib/images/projects/zeesta-labs-lockup.jpg";
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.jpg";

  const projects: ImageOptions[] = [
    {
      src: gridLinkSrc,
      alt: "GridLink project preview",
    },
    {
      src: arcForIosMediumSrc,
      alt: "Arc for iOS project preview",
    },
    {
      src: zeestaLabsLockupSrc,
      alt: "Zeesta Labs project preview",
    },
    {
      src: sportVideoAnalysisSrc,
      alt: "Sport Video Analysis project preview",
    },
  ];

  let container: HTMLElement;
  let screenWidth = 0;

  // Responsive gap calculation
  $: breakpoint = getCurrentBreakpoint(screenWidth);
  $: gapSize =
    breakpoint === BreakpointSizes.sm
      ? 16
      : breakpoint === BreakpointSizes.md
      ? 20
      : 24; // gap-4, gap-5, gap-6
  $: gapClass =
    breakpoint === BreakpointSizes.sm
      ? "gap-4"
      : breakpoint === BreakpointSizes.md
      ? "gap-5"
      : "gap-6";

  const calculateMarqueeDistance = () => {
    if (container) {
      // Wait for images to load and then calculate the actual width
      setTimeout(() => {
        const children = Array.from(container.children) as HTMLElement[];
        const halfCount = children.length / 2; // Since we duplicate the array

        let totalWidth = 0;
        for (let i = 0; i < halfCount; i++) {
          totalWidth += children[i].offsetWidth;
          if (i < halfCount - 1) {
            totalWidth += gapSize; // responsive gap
          }
        }

        // Update the CSS custom property for the animation
        container.style.setProperty("--marquee-distance", `-${totalWidth}px`);
        // Don't override the animation play state - let the hover state control it
      }, 100);
    }
  };

  // Recalculate when gap size changes
  $: if (gapSize && container) {
    calculateMarqueeDistance();
  }

  onMount(() => {
    calculateMarqueeDistance();
  });
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="relative w-full h-[250px] overflow-hidden">
  <!-- Gradient masks -->
  <div
    class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"
  />
  <div
    class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"
  />

  <!-- Marquee container -->
  <div
    bind:this={container}
    class="absolute top-0 left-0 h-full flex items-center {gapClass} animate-marquee"
  >
    {#each [...projects, ...projects] as project}
      <div class="h-[250px] flex-shrink-0">
        <Image
          imgOptions={project}
          class="h-[250px] w-auto object-cover rounded-md lg:rounded-xl"
        />
      </div>
    {/each}
  </div>
</div>

<style>
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(var(--marquee-distance, -50%));
    }
  }

  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
</style>
