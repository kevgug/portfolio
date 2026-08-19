<script lang="ts">
  import { onMount } from "svelte";
  import tinycolor from "tinycolor2";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import { tailwindTheme } from "$lib/tailwindTheme";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";
  import { createMarquee } from "$lib/util/marquee";

  // Image hairline: white at 4% flattened onto the page bg, so it stays opaque
  const imgBorderColor = tinycolor
    .mix(tailwindTheme.colors.background, "#ffffff", 4)
    .toHexString();

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

  // Freestyle
  import freestyleSrc from "$lib/images/projects/freestyle-landingpage.jpg";
  import freestyleAvif from "$lib/images/projects/freestyle-landingpage.avif";
  import freestyleWebp from "$lib/images/projects/freestyle-landingpage.webp";

  // MDL
  import mdlSrc from "$lib/images/projects/mdl.jpg";
  import mdlAvif from "$lib/images/projects/mdl.avif";
  import mdlWebp from "$lib/images/projects/mdl.webp";

  // Optimized project set with progressive loading support
  const projects: ImageOptions[] = [
    {
      src: mdlSrc,
      avifSrc: mdlAvif,
      webpSrc: mdlWebp,
      alt: "UChicago Multilingualism & Decision-Making Lab project preview",
    },
    {
      src: sportVideoAnalysisSrc,
      avifSrc: sportVideoAnalysisAvif,
      webpSrc: sportVideoAnalysisWebp,
      alt: "Sport Video Analysis project preview",
      loading: "eager",
    },
    {
      src: arcForIosMediumSrc,
      avifSrc: arcForIosMediumAvif,
      webpSrc: arcForIosMediumWebp,
      alt: "Arc for iOS project preview",
      loading: "eager",
    },
    {
      src: pizzaScreensSrc,
      avifSrc: pizzaScreensAvif,
      webpSrc: pizzaScreensWebp,
      alt: "Pizza Screens project preview",
      loading: "eager",
    },
    {
      src: gridLinkSrc,
      avifSrc: gridLinkAvif,
      webpSrc: gridLinkWebp,
      alt: "GridLink project preview",
      loading: "eager",
    },
    {
      src: freestyleSrc,
      avifSrc: freestyleAvif,
      webpSrc: freestyleWebp,
      alt: "Freestyle project preview",
    },
    {
      src: taskTimerSrc,
      avifSrc: taskTimerAvif,
      webpSrc: taskTimerWebp,
      alt: "Task Timer project preview",
      loading: "eager",
    },
  ];

  // Timing
  const LOOP_SECONDS = 40; // seconds for one full set to pass

  let viewport: HTMLElement;
  let container: HTMLElement;
  let screenWidth = 0;

  // Responsive gap calculation
  $: breakpoint = getCurrentBreakpoint(screenWidth);
  $: gapClass =
    breakpoint === BreakpointSizes.sm
      ? "gap-4"
      : breakpoint === BreakpointSizes.md
      ? "gap-5"
      : "gap-6";

  // Geometry, playback and input all live in the shared engine, so this and the
  // hero's logo ticker hand over to the reader the same way.
  const marquee = createMarquee({
    itemsPerCopy: projects.length,
    loopSeconds: LOOP_SECONDS,
  });
  const { copyCount, dragging } = marquee;

  onMount(() => marquee.start(viewport, container));
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div
  bind:this={viewport}
  class="relative w-full h-[250px] lg:h-[300px] overflow-hidden marquee-viewport"
  class:dragging={$dragging}
  on:pointerdown={marquee.onPointerDown}
  on:pointermove={marquee.onPointerMove}
  on:pointerup={marquee.onPointerEnd}
  on:pointercancel={marquee.onPointerEnd}
  on:dragstart|preventDefault
>
  <!-- Marquee container -->
  <div
    bind:this={container}
    class="absolute top-0 left-0 h-full flex items-center {gapClass} marquee-track"
  >
    {#each Array($copyCount) as _, copy}
      {#each projects as project}
        <div class="h-[250px] lg:h-[300px] flex-shrink-0" aria-hidden={copy > 0}>
          <Image
            imgOptions={project}
            class="h-[250px] lg:h-[300px] w-auto object-cover rounded-md lg:rounded-xl"
            style="box-shadow: 0 0 0 1px {imgBorderColor};"
          />
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .marquee-viewport {
    touch-action: pan-y;
    cursor: grab;
  }

  .marquee-viewport.dragging {
    cursor: grabbing;
  }

  .marquee-track {
    will-change: transform;
    user-select: none;
    -webkit-user-select: none;
  }

  .marquee-track :global(img) {
    -webkit-user-drag: none;
    pointer-events: none;
  }
</style>
