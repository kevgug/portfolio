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
  import { gsap } from "gsap";

  // Assets
  import headshotSrc from "$lib/images/kevin-gugelmann.jpg";
  // import headshotAvif from "$lib/images/kevin-headshot.avif";
  // import headshotWebp from "$lib/images/kevin-headshot.webp";
  import Image from "$lib/components/Image.svelte";
  import jpmcLogo from "$lib/images/logos/jpmc-white.svg";
  import freestyleLogo from "$lib/images/logos/freestyle.svg";
  import uchicagoLogo from "$lib/images/logos/uchicago.svg";
  import ycLogo from "$lib/images/logos/y-combinator.svg";

  // Colors
  const mutedTextGreyColor = tailwindTheme.colors["muted-text-grey"];
  const whiteColor = tailwindTheme.colors.white;

  // Calculations
  let screenWidth = 0;
  let screenHeight = 0;
  $: globeIconSize = responsiveIconSize(SmFontSize.sm, screenWidth);

  $: breakpoint = getCurrentBreakpoint(screenWidth);
  $: if (screenHeight) checkSpaceForZeigarnik();

  let heroContent: HTMLElement;
  let separator: HTMLElement;
  let separatorMarginY = 0;
  let boundedSeparatorMarginY = 0;
  let heroSection: HTMLElement;
  let bottomSection: HTMLElement;
  let companyLogosElement: HTMLElement;
  let marqueeWrapperElement: HTMLElement;

  // Determine if we should use Zeigarnik effect based on screen height
  export let useZeigarnikEffect = false;
  let bottomSectionHeight = 0;

  const checkSpaceForZeigarnik = () => {
    // Use Zeigarnik effect on all screen sizes unless screen height is > 1200px
    useZeigarnikEffect = screenHeight <= 1080;

    // Calculate bottom section height for spacing compensation
    if (bottomSection) {
      bottomSectionHeight = bottomSection.offsetHeight;
    }
  };

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

    checkSpaceForZeigarnik();
  };

  // Scrolling
  let projectElement: HTMLElement;
  const scrollToProjects = () =>
    scrollToElement(projectElement, {
      duration: breakpoint == BreakpointSizes.sm ? 570 : 630,
      ease: "outQuint",
      offset: breakpoint == BreakpointSizes.sm ? -64 : -80,
    } as any);

  // Animation function
  const animateElements = () => {
    const timeline = gsap.timeline();

    // Initial state for both elements - make them invisible with transform effects
    gsap.set([companyLogosElement, marqueeWrapperElement], {
      opacity: 0,
      y: 30, // Start 30px below final position
      scale: 0.8, // Start smaller than final size
      filter: "blur(8px)", // Start blurred
    });

    // Animate company logos first (fade in, move up, scale up, remove blur)
    timeline.to(companyLogosElement, {
      opacity: 1,
      y: 0, // Move to final position
      scale: 1, // Scale to full size
      filter: "blur(0px)", // Remove blur
      duration: 0.5,
      ease: "power2.out",
    });

    // Animate marquee wrapper with 150ms stagger delay (same effects)
    timeline.to(
      marqueeWrapperElement,
      {
        opacity: 1,
        y: 0, // Move marquee wrapper up to final position
        scale: 1, // Scale marquee wrapper to full size
        filter: "blur(0px)", // Remove blur from marquee wrapper
        duration: 1,
        ease: "power4.out", // Steeper ease out with very gentle finish
        transformOrigin: "center center", // Ensure scale animates from center
        force3D: true, // Enable hardware acceleration
      },
      "-=0.35"
    );

    return timeline;
  };

  // Lifecycle
  onMount(() => {
    // Calculations
    calculateSeparatorDistance();
    checkSpaceForZeigarnik();

    // Start animations after 100ms delay from page load
    setTimeout(() => {
      if (companyLogosElement && marqueeWrapperElement) {
        animateElements();
      }
    }, 100);
  });
</script>

<svelte:window
  bind:innerWidth={screenWidth}
  bind:innerHeight={screenHeight}
  on:resize={(_) => {
    calculateSeparatorDistance();
    checkSpaceForZeigarnik();
  }}
/>

<div
  bind:this={heroSection}
  class="hero-section flex flex-col
    pt-8 pb-8 md:pt-12 md:pb-12
    {useZeigarnikEffect ? 'relative min-h-[100svh] md:min-h-screen' : ''}"
>
  <div
    bind:this={heroContent}
    class="flex flex-col
         pt-2 pb-14 md:pt-0 md:pb-0
         {useZeigarnikEffect
      ? 'min-h-[36rem] md:min-h-[38rem] lg:min-h-[44rem]'
      : ''}"
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
          class="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover border border-white/30 mt-4 mb-8 sm:mt-8 xl:mt-12"
        />
        <h1
          id="title"
          class="text-glacial-blue
                mb-8 xl:mb-9"
        >
          Thoughtful Design. Radical Speed.
        </h1>
        <ul>
          <li>
            I ship full-stack code for AI startups like <a
              href="https://www.freestyle.sh">Freestyle (YC S24)</a
            >
            and sped up design tools 500x at
            <a href="https://jpmorganchase.com">JPMorgan</a>.
          </li>
          <li>
            Winner of hackathon and designathon top prizes at <a
              href="https://www.uchicago.edu">UChicago</a
            >, majoring in Economics and Cognitive Science.
          </li>
          <li>
            Relentless drive, from building a 5K+ user news app at 15 to winning <a
              href="https://hyrox.com/">Hyrox</a
            > by over a minute.
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Bottom section with logos and marquee -->
  <div
    bind:this={bottomSection}
    class="flex flex-col
           {useZeigarnikEffect
      ? 'absolute bottom-0 left-0 right-0 translate-y-32 md:translate-y-20'
      : 'mt-32 md:mt-36 lg:mt-40'}"
  >
    <!-- Company logos -->
    <div
      bind:this={companyLogosElement}
      class="w-full flex items-center justify-center gap-2.5 sm:gap-6 md:gap-8 mb-8 md:mb-12"
      style="opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(8px);"
    >
      <a
        href="https://jpmorganchase.com"
        target="_blank"
        rel="noopener noreferrer"
        class="h-6"
      >
        <img
          src={jpmcLogo}
          alt="JPMorganChase logo"
          class="h-full w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
        />
      </a>
      <div class="w-px h-4 bg-white/[0.14]" />
      <div
        class="flex items-center gap-1 sm:gap-1.5 pl-[0.05rem] pr-[0.15rem] h-6"
      >
        <a
          href="https://www.freestyle.sh"
          target="_blank"
          rel="noopener noreferrer"
          class="h-full"
        >
          <img
            src={freestyleLogo}
            alt="Freestyle logo"
            class="h-full w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
          />
        </a>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="opacity-40"
        >
          <path
            d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <a
          href="https://www.ycombinator.com"
          target="_blank"
          rel="noopener noreferrer"
          class="h-full"
        >
          <img
            src={ycLogo}
            alt="Y Combinator logo"
            class="h-full w-auto ml-0.5 object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
          />
        </a>
      </div>
      <div class="w-px h-4 bg-white/[0.14]" />
      <a
        href="https://www.uchicago.edu"
        target="_blank"
        rel="noopener noreferrer"
        class="h-6 ml-[0.1rem]"
      >
        <img
          src={uchicagoLogo}
          alt="University of Chicago logo"
          class="h-full w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
        />
      </a>
    </div>

    <!-- Project marquee -->
    <div class="-mx-5 md:-mx-[2.5rem] xl:-mx-[5rem] relative">
      <!-- Gradient masks -->
      <div
        class="absolute top-0 bottom-0 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none
               left-0 w-24"
      />
      <div
        class="absolute top-0 bottom-0 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none
               right-0 w-24"
      />

      <!-- Animated marquee wrapper -->
      <div
        bind:this={marqueeWrapperElement}
        style="opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(8px);"
      >
        <ProjectMarquee />
      </div>
    </div>
  </div>

  <div
    bind:this={separator}
    class="flex justify-center 
                                    {useZeigarnikEffect
      ? 'hidden'
      : 'mt-8 md:mt-12'}"
  >
    <!-- Show separator only on MD+ screens when not using Zeigarnik -->
    <div class="hidden md:flex">
      <Separator />
    </div>
  </div>
</div>

<!-- Adjust content below based on layout mode -->
<div
  class="pt-8 md:pt-10 lg:pt-12 {useZeigarnikEffect
    ? '-mt-20 md:-mt-28 lg:-mt-36'
    : ''}"
>
  <div
    id="projects"
    bind:this={projectElement}
    style="height: {useZeigarnikEffect
      ? bottomSectionHeight
      : boundedSeparatorMarginY}px"
  />
</div>

<style>
  /* Removed min-height CSS to allow Tailwind classes to control height */
</style>
