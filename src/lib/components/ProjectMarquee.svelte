<script lang="ts">
  import { onMount } from "svelte";
  import tinycolor from "tinycolor2";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import { tailwindTheme } from "$lib/tailwindTheme";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";
  import { createMarquee } from "$lib/util/marquee";
  import { observeWidth } from "$lib/util/observeWidth";
  import { projects } from "$lib/projects";
  import {
    getResponsiveOffset,
    reliableScrollToElement,
  } from "$lib/util/reliableScroll";

  // Image hairline: white at 6% flattened onto the page bg, so it stays opaque
  const imgBorderColor = tinycolor
    .mix(tailwindTheme.colors.background, "#ffffff", 6)
    .toHexString();
  // Fades to its own colour at zero alpha rather than to the page bg, matching
  // the project card: holding the hue and animating only alpha keeps Safari
  // from interpolating through transparent black.
  const imgBorderHidden = tinycolor(imgBorderColor).setAlpha(0).toRgbString();

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

  /* Each image carries the id of the card it belongs to, so clicking it can
     take the reader down to that project. The set and its ordering stay curated
     here rather than derived from `projects`: only some projects earn a slot,
     and the eager/lazy split is about what the hero shows first. */
  interface MarqueeItem extends ImageOptions {
    projectId: string;
  }

  const marqueeItems: MarqueeItem[] = [
    {
      projectId: "mdl",
      src: mdlSrc,
      avifSrc: mdlAvif,
      webpSrc: mdlWebp,
      alt: "UChicago Multilingualism & Decision-Making Lab project preview",
    },
    {
      projectId: "sportvideoanalysis",
      src: sportVideoAnalysisSrc,
      avifSrc: sportVideoAnalysisAvif,
      webpSrc: sportVideoAnalysisWebp,
      alt: "Sport Video Analysis project preview",
      loading: "eager",
    },
    {
      projectId: "arcbrowser",
      src: arcForIosMediumSrc,
      avifSrc: arcForIosMediumAvif,
      webpSrc: arcForIosMediumWebp,
      alt: "Arc for iOS project preview",
      loading: "eager",
    },
    {
      projectId: "uchicagodesignathon",
      src: pizzaScreensSrc,
      avifSrc: pizzaScreensAvif,
      webpSrc: pizzaScreensWebp,
      alt: "Pizza Screens project preview",
      loading: "eager",
    },
    {
      projectId: "gridlink",
      src: gridLinkSrc,
      avifSrc: gridLinkAvif,
      webpSrc: gridLinkWebp,
      alt: "GridLink project preview",
      loading: "eager",
    },
    {
      projectId: "freestyle",
      src: freestyleSrc,
      avifSrc: freestyleAvif,
      webpSrc: freestyleWebp,
      alt: "Freestyle project preview",
    },
    {
      projectId: "taskapp",
      src: taskTimerSrc,
      avifSrc: taskTimerAvif,
      webpSrc: taskTimerWebp,
      alt: "Task Timer project preview",
      loading: "eager",
    },
  ];

  const projectName = (id: string): string =>
    projects.find((project) => project.id === id)?.name ?? "";

  // Same trip as the hero's "See my work" button, so arriving from either place
  // leaves the card sitting in the same spot.
  const scrollToProject = async (event: MouseEvent, id: string) => {
    event.preventDefault();
    await reliableScrollToElement(`#${id}`, {
      duration: 1000,
      ease: "out-expo",
      offset: getResponsiveOffset({ spacing: "lg" }),
    });
  };

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

  /* Hovering an image grows it by the same 12px of width a project card's image
     gains, which means a per-image scale: they don't share an aspect ratio.
     Capped so the taller image still fits the strip's vertical headroom. */
  const HOVER_GROWTH_PX = 12;
  const MAX_HOVER_SCALE = 1.05; // 8px of headroom, at both strip heights
  let itemWidths: number[] = [];
  // `observeWidth`, not `bind:clientWidth`: an item measured before its image
  // loads reports 0 and falls back to no growth at all, so a page load used to
  // leave an arbitrary handful of thumbnails inert on hover.
  const setItemWidth = (i: number, width: number) => {
    itemWidths[i] = width;
  };
  $: hoverScales = marqueeItems.map((_, i) => {
    const width = itemWidths[i];
    if (!width) return 1;
    return Math.min((width + HOVER_GROWTH_PX) / width, MAX_HOVER_SCALE);
  });

  // Geometry, playback and input all live in the shared engine, so this and the
  // hero's logo ticker hand over to the reader the same way. Clicks are
  // swallowed after a drag: pushing the strip along shouldn't leave the page.
  const marquee = createMarquee({
    itemsPerCopy: marqueeItems.length,
    loopSeconds: LOOP_SECONDS,
    suppressClickAfterDrag: true,
  });
  const { copyCount, dragging } = marquee;

  onMount(() => marquee.start(viewport, container));
</script>

<svelte:window bind:innerWidth={screenWidth} />

<!-- Taller than it sits in the flow (the negative margins give the padding
     back), so a hovered image has room to grow instead of being clipped. -->
<div
  bind:this={viewport}
  class="relative w-full h-[266px] lg:h-[316px] py-2 -my-2 overflow-hidden marquee-viewport"
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
      {#each marqueeItems as item, i}
        <a
          href="#{item.projectId}"
          class="marquee-item h-[250px] lg:h-[300px] flex-shrink-0"
          style="--hover-scale: {hoverScales[i]};"
          aria-label="Jump to {projectName(item.projectId)}"
          aria-hidden={copy > 0 ? "true" : undefined}
          tabindex={copy > 0 ? -1 : undefined}
          draggable="false"
          use:observeWidth={(w) => setItemWidth(i, w)}
          on:click={(event) => scrollToProject(event, item.projectId)}
        >
          <Image
            imgOptions={item}
            class="marquee-img h-[250px] lg:h-[300px] w-auto object-cover rounded-md lg:rounded-xl"
            style="--img-outline: {imgBorderColor}; --img-outline-hidden: {imgBorderHidden};"
          />
        </a>
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
  }

  /* The strip is a drag surface first, so the grab cursor stays; the custom
     cursor picks these up as links on its own. Growth reaches and eases exactly
     as a project card's image does under its link. */
  .marquee-item {
    display: block;
    position: relative; /* so the hovered image lifts above its neighbours */
    cursor: inherit;
    -webkit-user-drag: none;
    transform: scale(1);
    transition: transform 900ms cubic-bezier(0.16, 1, 0.17, 0.99);
  }

  .marquee-item :global(.marquee-img) {
    box-shadow: 0 0 0 1px var(--img-outline);
    transition: box-shadow 80ms ease-out;
  }

  /* Hover only where there's a pointer — on touch it would stick after a tap.
     A drag isn't a hover either, so the strip stays flat while it's being
     pushed along. */
  @media (hover: hover) {
    .marquee-viewport:not(.dragging) .marquee-item:hover {
      transform: scale(var(--hover-scale));
      z-index: 1;
    }

    .marquee-viewport:not(.dragging)
      .marquee-item:hover
      :global(.marquee-img) {
      box-shadow: 0 0 0 1px var(--img-outline-hidden);
    }
  }
</style>
