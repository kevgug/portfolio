<script lang="ts">
  import { onMount } from "svelte";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";

  // Import all formats for progressive loading (AVIF -> WebP -> Original)
  // Pizza Screens
  import pizzaScreensSrc from "$lib/images/projects/pizza-screens.jpg";
  import pizzaScreensAvif from "$lib/images/projects/pizza-screens.avif";
  import pizzaScreensWebp from "$lib/images/projects/pizza-screens.webp";

  // Sport Video Analysis
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.jpg";
  import sportVideoAnalysisAvif from "$lib/images/projects/sport-video-analysis.avif";
  import sportVideoAnalysisWebp from "$lib/images/projects/sport-video-analysis.webp";

  // Arc for iOS
  import arcForIosMediumSrc from "$lib/images/projects/arcforios-medium.jpg";
  import arcForIosMediumAvif from "$lib/images/projects/arcforios-medium.avif";
  import arcForIosMediumWebp from "$lib/images/projects/arcforios-medium.webp";

  // Task Timer
  import taskTimerSrc from "$lib/images/projects/task-timer-app.png";
  import taskTimerAvif from "$lib/images/projects/task-timer-app.avif";
  import taskTimerWebp from "$lib/images/projects/task-timer-app.webp";

  // GridLink
  import gridLinkSrc from "$lib/images/projects/gridlink-landingpage.jpg";
  import gridLinkAvif from "$lib/images/projects/gridlink-landingpage.avif";
  import gridLinkWebp from "$lib/images/projects/gridlink-landingpage.webp";

  // Optimized project set with progressive loading support
  const projects: ImageOptions[] = [
    {
      src: sportVideoAnalysisSrc,
      avifSrc: sportVideoAnalysisAvif,
      webpSrc: sportVideoAnalysisWebp,
      alt: "Sport Video Analysis project preview",
    },
    {
      src: arcForIosMediumSrc,
      avifSrc: arcForIosMediumAvif,
      webpSrc: arcForIosMediumWebp,
      alt: "Arc for iOS project preview",
    },
    {
      src: pizzaScreensSrc,
      avifSrc: pizzaScreensAvif,
      webpSrc: pizzaScreensWebp,
      alt: "Pizza Screens project preview",
    },
    {
      src: gridLinkSrc,
      avifSrc: gridLinkAvif,
      webpSrc: gridLinkWebp,
      alt: "GridLink project preview",
    },
    {
      src: taskTimerSrc,
      avifSrc: taskTimerAvif,
      webpSrc: taskTimerWebp,
      alt: "Task Timer project preview",
    },
  ];

  let container: HTMLElement;
  let screenWidth = 0;
  let resizeTimeout: ReturnType<typeof setTimeout>;

  // Responsive gap calculation
  $: breakpoint = getCurrentBreakpoint(screenWidth);
  $: gapSize =
    breakpoint === BreakpointSizes.sm
      ? 16
      : breakpoint === BreakpointSizes.md
      ? 20
      : 24;
  $: gapClass =
    breakpoint === BreakpointSizes.sm
      ? "gap-4"
      : breakpoint === BreakpointSizes.md
      ? "gap-5"
      : "gap-6";

  const calculateMarqueeDistance = () => {
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    const halfCount = children.length / 2;

    let totalWidth = 0;
    for (let i = 0; i < halfCount; i++) {
      totalWidth += children[i].offsetWidth;
      if (i < halfCount - 1) {
        totalWidth += gapSize;
      }
    }

    container.style.setProperty("--marquee-distance", `-${totalWidth}px`);
  };

  // Debounced recalculation for performance
  const debouncedCalculate = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculateMarqueeDistance, 100);
  };

  // Recalculate when gap size changes (debounced)
  $: if (gapSize && container) {
    debouncedCalculate();
  }

  onMount(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setTimeout(calculateMarqueeDistance, 50);
    });
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
    animation: marquee 30s linear infinite;
  }
</style>
