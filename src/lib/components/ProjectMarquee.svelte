<script lang="ts">
  import { onMount } from "svelte";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";

  // Import project images - avif versions
  import gridLinkAvifSrc from "$lib/images/projects/gridlink-landingpage.avif";
  import arcForIosMediumAvifSrc from "$lib/images/projects/arcforios-medium.avif";
  import zeestaLabsLockupAvifSrc from "$lib/images/projects/zeesta-labs-lockup.avif";
  import sportVideoAnalysisAvifSrc from "$lib/images/projects/sport-video-analysis.avif";
  import pizzaScreensAvifSrc from "$lib/images/projects/pizza-screens.avif";
  import taskTimerAvifSrc from "$lib/images/projects/task-timer-app.avif";
  import prismaticNewsAvifSrc from "$lib/images/projects/prismatic-news.avif";

  // Import project images - webp versions
  import gridLinkWebpSrc from "$lib/images/projects/gridlink-landingpage.webp";
  import arcForIosMediumWebpSrc from "$lib/images/projects/arcforios-medium.webp";
  import zeestaLabsLockupWebpSrc from "$lib/images/projects/zeesta-labs-lockup.webp";
  import sportVideoAnalysisWebpSrc from "$lib/images/projects/sport-video-analysis.webp";
  import pizzaScreensWebpSrc from "$lib/images/projects/pizza-screens.webp";
  import taskTimerWebpSrc from "$lib/images/projects/task-timer-app.webp";
  import prismaticNewsWebpSrc from "$lib/images/projects/prismatic-news.webp";

  // Import project images - original versions
  import gridLinkSrc from "$lib/images/projects/gridlink-landingpage.jpg";
  import arcForIosMediumSrc from "$lib/images/projects/arcforios-medium.jpg";
  import zeestaLabsLockupSrc from "$lib/images/projects/zeesta-labs-lockup.jpg";
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.jpg";
  import pizzaScreensSrc from "$lib/images/projects/pizza-screens.jpg";
  import taskTimerSrc from "$lib/images/projects/task-timer-app.png";
  import prismaticNewsSrc from "$lib/images/projects/prismatic-news.jpg";

  const projects: ImageOptions[] = [
    {
      src: gridLinkSrc,
      webpSrc: gridLinkWebpSrc,
      avifSrc: gridLinkAvifSrc,
      alt: "GridLink project preview",
    },
    {
      src: arcForIosMediumSrc,
      webpSrc: arcForIosMediumWebpSrc,
      avifSrc: arcForIosMediumAvifSrc,
      alt: "Arc for iOS project preview",
    },
    {
      src: zeestaLabsLockupSrc,
      webpSrc: zeestaLabsLockupWebpSrc,
      avifSrc: zeestaLabsLockupAvifSrc,
      alt: "Zeesta Labs project preview",
    },
    {
      src: sportVideoAnalysisSrc,
      webpSrc: sportVideoAnalysisWebpSrc,
      avifSrc: sportVideoAnalysisAvifSrc,
      alt: "Sport Video Analysis project preview",
    },
    {
      src: pizzaScreensSrc,
      webpSrc: pizzaScreensWebpSrc,
      avifSrc: pizzaScreensAvifSrc,
      alt: "Pizza Screens project preview",
    },
    {
      src: taskTimerSrc,
      webpSrc: taskTimerWebpSrc,
      avifSrc: taskTimerAvifSrc,
      alt: "Task Timer project preview",
    },
    {
      src: prismaticNewsSrc,
      webpSrc: prismaticNewsWebpSrc,
      avifSrc: prismaticNewsAvifSrc,
      alt: "Prismatic News project preview",
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
        if (!container) return;
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

<div class="relative w-full h-[250px] lg:h-[300px] overflow-hidden">
  <!-- Marquee container -->
  <div
    bind:this={container}
    class="absolute top-0 left-0 h-full flex items-center {gapClass} animate-marquee"
  >
    {#each [...projects, ...projects] as project}
      <div class="h-[250px] lg:h-[300px] flex-shrink-0">
        <Image
          imgOptions={project}
          class="h-[250px] lg:h-[300px] w-auto object-cover rounded-md lg:rounded-xl"
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
