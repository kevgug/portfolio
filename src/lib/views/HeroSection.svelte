<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import Icon from "$lib/components/Icon.svelte";
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import { onMount } from "svelte";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";
  import scrollToElement from "scroll-to-element";
  import ProjectMarquee from "$lib/components/ProjectMarquee.svelte";

  // Assets
  import headshotSrc from "$lib/images/kevin-gugelmann.jpg";
  // import headshotAvif from "$lib/images/kevin-headshot.avif";
  // import headshotWebp from "$lib/images/kevin-headshot.webp";
  import Image from "$lib/components/Image.svelte";
  import jpmcLogo from "$lib/images/logos/jpmc-white.svg";
  import freestyleLogo from "$lib/images/logos/freestyle.svg";
  import gridLinkLogo from "$lib/images/logos/gridlink.svg";
  import uchicagoLogo from "$lib/images/logos/uchicago.svg";

  // Colors
  const mutedTextGreyColor = tailwindTheme.colors["muted-text-grey"];
  const whiteColor = tailwindTheme.colors.white;

  // Calculations
  let screenWidth = 0;
  $: globeIconSize = responsiveIconSize(SmFontSize.sm, screenWidth);

  $: breakpoint = getCurrentBreakpoint(screenWidth);

  let heroContent: HTMLElement;
  let separator: HTMLElement;
  let separatorMarginY = 0;
  let boundedSeparatorMarginY = 0;
  $: {
    if (breakpoint == BreakpointSizes.sm) {
      boundedSeparatorMarginY = Math.min(56, Math.max(16, separatorMarginY));
    } else {
      boundedSeparatorMarginY = Math.min(80, Math.max(56, separatorMarginY));
    }
  }

  const calculateSeparatorDistance = () => {
    // Recalculate vertical distance between separator and hero content
    separatorMarginY =
      (separator?.getBoundingClientRect().top ?? 0) -
      (heroContent?.getBoundingClientRect().bottom ?? 0);
  };

  // Scrolling
  let projectElement: HTMLElement;
  const scrollToProjects = () =>
    scrollToElement(projectElement, {
      duration: breakpoint == BreakpointSizes.sm ? 570 : 630,
      ease: "outQuint",
      offset: breakpoint == BreakpointSizes.sm ? -64 : -80,
    } as any);

  // Lifecycle
  onMount(() => {
    // Calculations
    calculateSeparatorDistance();
  });
</script>

<svelte:window
  bind:innerWidth={screenWidth}
  on:resize={(_) => calculateSeparatorDistance()}
/>

<div
  class="hero-section flex flex-col justify-between
    pt-8 pb-8 md:pt-12 md:pb-12"
>
  <div
    bind:this={heroContent}
    class="flex flex-col
         pt-2 pb-14 md:pt-0 md:pb-0"
  >
    <div class="w-full">
      <div>
        <Image
          imgOptions={{
            src: headshotSrc,
            // avifSrc: headshotAvif,
            // webpSrc: headshotWebp,
            alt: "Kevin Gugelmann's headshot",
            loading: "eager",
          }}
          class="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full object-cover mt-4 mb-8 sm:mt-8 xl:mt-12"
        />
        <h1
          id="title"
          class="text-glacial-blue
                mb-8 xl:mb-9"
        >
          Designer Building UX That Actually Ships.
        </h1>
        <ul>
          <li>
            Incoming UX Designer at <a href="https://jpmorganchase.com"
              >JPMorganChase</a
            >.
          </li>
          <li>
            Previously, Software Engineer at <a href="https://www.freestyle.sh"
              >Freestyle</a
            >
            (YC S24) and <a href="https://gridlink.co">GridLink</a>
            (Techstars '23).
          </li>
          <li>
            Cognitive Science and Economics at the <a
              href="https://www.uchicago.edu">University of Chicago</a
            > (designathon and hackathon winner).
          </li>
        </ul>
      </div>

      <!-- Company logos -->
      <div
        class="flex items-center justify-center gap-8 md:gap-12 mt-12 lg:mt-16"
      >
        <a
          href="https://jpmorganchase.com"
          target="_blank"
          rel="noopener noreferrer"
          class="h-6"
        >
          <img
            src={jpmcLogo}
            alt="JPMorgan Chase"
            class="h-full w-auto object-contain brightness-0 invert opacity-60"
          />
        </a>
        <a
          href="https://www.freestyle.sh"
          target="_blank"
          rel="noopener noreferrer"
          class="h-6"
        >
          <img
            src={freestyleLogo}
            alt="Freestyle"
            class="h-full w-auto object-contain brightness-0 invert opacity-60"
          />
        </a>
        <a
          href="https://www.uchicago.edu"
          target="_blank"
          rel="noopener noreferrer"
          class="h-6"
        >
          <img
            src={uchicagoLogo}
            alt="University of Chicago"
            class="h-full w-auto object-contain brightness-0 invert opacity-60"
          />
        </a>
      </div>

      <!-- Project marquee -->
      <div class="mt-12 -mx-[2rem] md:-mx-[2.5rem] xl:-mx-[5rem]">
        <ProjectMarquee />
      </div>
    </div>
  </div>
  <div bind:this={separator} class="flex justify-center">
    <!-- Show separator only on MD+ screens -->
    <div class="hidden md:flex">
      <Separator />
    </div>
    <!-- On small devices (i.e. phones) show scroll down arrow -->
    <!-- <div class="md:hidden mb-1">
      <a
        href={"javascript:;"}
        on:click={scrollToProjects}
        data-sa-link-event="hero_scrollto_projects"
      >
        <Icon name="arrow-down" color={whiteColor} />
      </a>
    </div> -->
  </div>
</div>
<div
  id="projects"
  bind:this={projectElement}
  style="height: {boundedSeparatorMarginY}px"
/>

<style>
  /* Removed min-height CSS to allow Tailwind classes to control height */
</style>
