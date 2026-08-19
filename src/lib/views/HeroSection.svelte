<script lang="ts">
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import { onMount } from "svelte";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  import ProjectMarquee from "$lib/components/ProjectMarquee.svelte";
  import { createMarquee } from "$lib/util/marquee";
  import { gsap } from "gsap";
  import { projects } from "$lib/projects";
  import { layoutReady } from "$lib/stores/layoutReady";

  // Assets
  import revolutLogo from "$lib/images/logos/revolut.svg";
  import mdlLogo from "$lib/images/logos/mdl.svg";
  import jpmcLogo from "$lib/images/logos/jpmc-white.svg";
  import freestyleLogo from "$lib/images/logos/freestyle.svg";
  import gridlinkLogo from "$lib/images/logos/gridlink.svg";
  import uchicagoLogo from "$lib/images/logos/uchicago.svg";

  const logoImgClass =
    "h-full w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300";

  const companyLogos = [
    {
      href: "https://www.revolut.com",
      src: revolutLogo,
      alt: "Revolut logo",
      class: "h-[1.15rem]",
    },
    {
      href: "https://mdl.uchicago.edu",
      src: mdlLogo,
      alt: "Multilingualism & Decision-Making Lab logo",
      class: "h-6",
    },
    {
      href: "https://jpmorganchase.com",
      src: jpmcLogo,
      alt: "JPMorganChase logo",
      class: "h-6",
    },
    {
      href: "https://www.freestyle.sh",
      src: freestyleLogo,
      alt: "Freestyle logo",
      class: "h-6 pl-[0.05rem] pr-[0.15rem]",
    },
    {
      href: "https://gridlink.co",
      src: gridlinkLogo,
      alt: "GridLink logo",
      class: "h-6",
    },
    {
      href: "https://www.uchicago.edu",
      src: uchicagoLogo,
      alt: "University of Chicago logo",
      class: "h-6 ml-[0.1rem]",
    },
  ];

  // Calculations
  let screenWidth = 0;
  let screenHeight = 0;

  $: breakpoint = getCurrentBreakpoint(screenWidth);
  $: if (screenHeight) checkSpaceForZeigarnik();

  let heroContent: HTMLElement;
  let separator: HTMLElement;
  let separatorMarginY = 0;
  let boundedSeparatorMarginY = 0;
  let bottomSection: HTMLElement;
  let companyLogosElement: HTMLElement;
  let marqueeWrapperElement: HTMLElement;
  let logoTickerViewport: HTMLElement;
  let logoTicker: HTMLElement;

  /* Same engine as the project marquee below it, so a reader who has learned
     that one strip can be pushed along finds the other behaves the same.

     Each logo is followed by its divider, hence two children per logo. Speed is
     held constant rather than derived from a loop duration: the set's width
     changes with the breakpoint, and a fixed duration would make it drift
     faster on wider screens. Clicks are swallowed after a drag because, unlike
     the project cards, these are links. */
  const LOGO_TICKER_SPEED = 20; // px per second
  const logoMarquee = createMarquee({
    itemsPerCopy: companyLogos.length * 2,
    pixelsPerSecond: LOGO_TICKER_SPEED,
    suppressClickAfterDrag: true,
  });
  const { copyCount: logoCopyCount, dragging: logoDragging } = logoMarquee;

  // Determine if we should use Zeigarnik effect based on screen height
  // Default to true to prevent layout shift (most screens are <= 1080px)
  export let useZeigarnikEffect = true;
  let bottomSectionHeight = 0;

  // Animation state tracking
  let elementAnimationStarted = false;
  let titleSwapStarted = false;

  // Scroll to first project handler
  async function scrollToFirstProject(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    const firstProject = projects[0];
    if (firstProject) {
      const totalOffset = getResponsiveOffset({ spacing: "lg" });
      await reliableScrollToElement(`#${firstProject.id}`, {
        duration: 1000,
        ease: "out-expo",
        offset: totalOffset,
      });
    }
  }

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
  // ----- Title animation (masked, staggered characters) -----
  const oldTitleLine1 = "Hi, I'm Kevin.";
  const oldTitleLine2 = "Welcome to my site.";
  const newTitleLine1 = "Kevin Gugelmann.";
  const newTitleLine2 = "Building good tech.";
  const newTitleText = `${newTitleLine1} ${newTitleLine2}`;

  let oldTitleElement: HTMLElement;
  let newTitleElement: HTMLElement;

  const splitChars = (text: string): string[] => Array.from(text);

  // Animation function
  const animateElements = () => {
    if (elementAnimationStarted) return;
    elementAnimationStarted = true;

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

    const stopLogoMarquee = logoMarquee.start(logoTickerViewport, logoTicker);

    // Mark layout as ready after calculations are complete
    layoutReady.set(true);

    // Title initial states
    const oldChars = oldTitleElement
      ? (oldTitleElement.querySelectorAll(".char") as unknown as HTMLElement[])
      : null;
    const newCharsAll = Array.from(
      (newTitleElement?.querySelectorAll(
        ".char"
      ) as unknown as HTMLElement[]) ?? []
    );

    if (oldChars) {
      gsap.set(oldChars, { y: "0%" });
    }
    if (newCharsAll.length) {
      gsap.set(newCharsAll, { y: "105%" });
    }

    // Start animations after 100ms delay from page load
    setTimeout(() => {
      if (companyLogosElement && marqueeWrapperElement) {
        animateElements();
      }
    }, 100);

    // Title swap function
    const runTitleSwap = () => {
      if (titleSwapStarted) return;
      titleSwapStarted = true;

      const timeline = gsap.timeline();

      const desktopTimings = {
        oldCharsDuration: 0.44,
        oldCharsStagger: 0.0088,
        newCharsDuration: 0.88,
        newCharsStagger: 0.0088,
        newCharsNegDelay: 0.15,
      }
      const mobileMultiplier = 0.92;
      const timings = {
        oldCharsDuration: [desktopTimings.oldCharsDuration, mobileMultiplier * desktopTimings.oldCharsDuration],
        oldCharsStagger: [desktopTimings.oldCharsStagger, mobileMultiplier * desktopTimings.oldCharsStagger],
        newCharsDuration: [desktopTimings.newCharsDuration, mobileMultiplier * desktopTimings.newCharsDuration],
        newCharsStagger: [desktopTimings.newCharsStagger, mobileMultiplier * desktopTimings.newCharsStagger],
        newCharsNegDelay: [desktopTimings.newCharsNegDelay,  mobileMultiplier * desktopTimings.newCharsNegDelay],
      }

      const isSmallNow =
        getCurrentBreakpoint(
          typeof window !== "undefined" ? window.innerWidth : screenWidth
        ) == BreakpointSizes.sm;

      if (oldChars) {
        console.log('isSmallNow1',Number(isSmallNow),isSmallNow)
        timeline.to(oldChars, {
          y: "-110%",
          duration: timings.oldCharsDuration[Number(isSmallNow)],
          ease: "power3.in",
          stagger: timings.oldCharsStagger[Number(isSmallNow)],
        });
      }

      const newChars = newTitleElement?.querySelectorAll(
        ".char"
      ) as unknown as HTMLElement[];

      if (newChars && newChars.length) {
        console.log('isSmallNow2',Number(isSmallNow),isSmallNow)
        const newCharsPosition = oldChars ? `-=${timings.newCharsNegDelay[Number(isSmallNow)]}` : 0;
        timeline.to(
          newChars,
          {
            y: "0%",
            duration: timings.newCharsDuration[Number(isSmallNow)],
            ease: "expo.out",
            stagger: timings.newCharsStagger[Number(isSmallNow)],
          },
          newCharsPosition
        );
      }
    };

    // Wait 850ms, then check current breakpoint and either run immediately or wait 500ms more
    setTimeout(() => {
      const isSmallNow =
        getCurrentBreakpoint(
          typeof window !== "undefined" ? window.innerWidth : screenWidth
        ) == BreakpointSizes.sm;
      if (isSmallNow) {
        runTitleSwap();
      } else {
        setTimeout(runTitleSwap, 400);
      }
    }, 900);

    // Add scroll listener to immediately trigger animations if user scrolls
    const handleScroll = () => {
      // Trigger both animations immediately if they haven't started
      if (
        companyLogosElement &&
        marqueeWrapperElement &&
        !elementAnimationStarted
      ) {
        animateElements();
      }
      if (!titleSwapStarted) {
        runTitleSwap();
      }

      // Remove the scroll listener after triggering once
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      stopLogoMarquee();
    };
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
  class="hero-section flex flex-col
    {useZeigarnikEffect ? 'pt-4 md:pt-6 pb-8 md:pb-20 relative min-h-[100svh] md:min-h-screen' : ''}"
>
  <div
    bind:this={heroContent}
    class="flex flex-col
         {useZeigarnikEffect
      ? 'justify-center flex-1 pb-40 md:pb-48 lg:pb-60 min-h-[40rem] md:min-h-[42rem] lg:min-h-[48rem]'
      : 'justify-start pb-0 mt-32 md:mt-36 lg:mt-40'}"
  >
    <div class="w-full">
      <div>
        <h1
          id="title"
          class="text-glacial-blue
                mb-9 md:mb-8 xl:mb-9 grid"
        >
          <!-- Final title layer -->
          <span
            class="title-layer flex flex-col gap-3 min-[315px]:gap-0"
            bind:this={newTitleElement}
            aria-hidden="true"
          >
            <span>
              <span class="hidden min-[315px]:inline">
                {#each splitChars(newTitleLine1) as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
              </span>
              <span class="min-[315px]:hidden">
                {#each splitChars("Kevin") as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
                <br />
                {#each splitChars("Gugelmann.") as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
              </span>
            </span>
            <span>
              <span class="hidden min-[315px]:inline">
                {#each splitChars(newTitleLine2) as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
              </span>
              <span class="min-[315px]:hidden">
                {#each splitChars("Building") as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
                <br />
                {#each splitChars("good tech.") as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
              </span>
            </span>
          </span>

          <!-- Initial title layer (visible first) -->
          <span
            class="title-layer old"
            bind:this={oldTitleElement}
            aria-label={newTitleText}
          >
            <span class="flex flex-col gap-3 min-[315px]:gap-0">
              <span>
                <span class="hidden min-[315px]:inline">
                  {#each splitChars(oldTitleLine1) as ch}
                    <span class="char-mask"
                      ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                    >
                  {/each}
                </span>
                <span class="min-[315px]:hidden">
                  {#each splitChars("Hi I'm") as ch}
                    <span class="char-mask"
                      ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                    >
                  {/each}
                  <br />
                  {#each splitChars("Kevin.") as ch}
                    <span class="char-mask"
                      ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                    >
                  {/each}
                </span>
              </span>
              <span>
                <span class="hidden min-[315px]:inline">
                  {#each splitChars(oldTitleLine2) as ch}
                    <span class="char-mask"
                      ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                    >
                  {/each}
                </span>
                <span class="min-[315px]:hidden">
                  {#each splitChars("Welcome to") as ch}
                    <span class="char-mask"
                      ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                    >
                  {/each}
                  <br />
                  {#each splitChars("my site.") as ch}
                    <span class="char-mask"
                      ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                    >
                  {/each}
                </span>
              </span>
            </span>
          </span>
        </h1>
        <ul>
          <li>
            Product Owner at <a href="https://www.revolut.com">Revolut</a>,
            working on travel products.
          </li>
          <!-- Ordered shortest to longest so the block reads as a wedge -->
          <li>
            Won 1st place at both the <a href="https://www.uchicago.edu"
              >UChicago</a
            > designathon and hackathon.
          </li>
          <li>
            Built an AI Figma plugin builder for <a
              href="https://jpmorganchase.com">JPMorganChase</a
            > a year before Figma did.
          </li>
        </ul>
        <div class="flex items-center gap-2 mt-9 sm:mt-9 xl:mt-10">
          <PrimaryButton
            linkButtonContent={{
              label: "View work",
              destination: scrollToFirstProject,
              mediaType: "none",
              eventName: "herosection_portfolio_primary",
              openInNewTab: false,
            }}
            iconName="arrow-down"
            variant="glacial"
          />
          <PrimaryButton
            linkButtonContent={{
              label: "Read essays",
              destination: "/essays",
              mediaType: "read",
              eventName: "herosection_essays_secondary",
              openInNewTab: false,
            }}
          />
        </div>
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
      class="w-full mb-8 md:mb-12"
      style="opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(8px);"
    >
      <!-- XL+ : the full set fits at its natural 1076px, so keep it centered and still -->
      <div class="hidden xl:flex items-center justify-center gap-8">
        {#each companyLogos as logo, i}
          <a
            href={logo.href}
            target="_blank"
            rel="noopener noreferrer"
            class={logo.class}
          >
            <img src={logo.src} alt={logo.alt} class={logoImgClass} />
          </a>
          {#if i < companyLogos.length - 1}
            <div class="w-px h-4 bg-white/[0.14]" />
          {/if}
        {/each}
      </div>

      <!-- Below XL : too wide to fit without squeezing, so it slowly tickers instead -->
      <div
        bind:this={logoTickerViewport}
        class="xl:hidden relative overflow-hidden -mx-5 md:-mx-[2.5rem] py-1 logo-viewport"
        class:dragging={$logoDragging}
        on:pointerdown={logoMarquee.onPointerDown}
        on:pointermove={logoMarquee.onPointerMove}
        on:pointerup={logoMarquee.onPointerEnd}
        on:pointercancel={logoMarquee.onPointerEnd}
        on:dragstart|preventDefault
      >
        <div
          bind:this={logoTicker}
          class="flex items-center w-max gap-8 logo-track"
        >
          <!-- Repeated so a copy is always in place as the one before it scrolls
               out, however far the reader pushes the strip -->
          {#each Array($logoCopyCount) as _, copy}
            {#each companyLogos as logo}
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                class="{logo.class} shrink-0"
                aria-hidden={copy > 0 ? "true" : undefined}
                tabindex={copy > 0 ? -1 : undefined}
              >
                <img src={logo.src} alt={logo.alt} class={logoImgClass} />
              </a>
              <div class="w-px h-4 shrink-0 bg-white/[0.14]" />
            {/each}
          {/each}
        </div>
        <!-- Gradient masks -->
        <div
          class="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"
        />
        <div
          class="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none"
        />
      </div>
    </div>

    <!-- Project marquee -->
    <div class="-mx-5 md:-mx-[2.5rem] xl:-mx-[5rem] relative">
      <!-- Gradient masks -->
      <!-- Reach past the strip's own box: a hovered image grows a few px beyond
           it, and the fade has to cover that too. -->
      <div
        class="absolute -top-2 -bottom-2 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none
               left-0 w-24"
      />
      <div
        class="absolute -top-2 -bottom-2 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none
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
    style="height: {useZeigarnikEffect
      ? bottomSectionHeight
      : boundedSeparatorMarginY}px"
  />
</div>

<style lang="postcss">
  /* Vertical swipes still belong to the page; only the horizontal axis is ours */
  .logo-viewport {
    touch-action: pan-y;
    cursor: grab;
  }

  .logo-viewport.dragging {
    cursor: grabbing;
  }

  .logo-track {
    will-change: transform;
    user-select: none;
    -webkit-user-select: none;
  }

  /* The logos are links, so unlike the project marquee they stay hit-testable;
     only the browser's own image drag is suppressed. */
  .logo-track :global(img) {
    -webkit-user-drag: none;
  }

  h1 {
    position: relative;
    font-size: 1.75rem;
  }
  @media (min-width: 360px) {
    h1 {
      font-size: calc(max(2rem, min(4rem, 7vw)));
    }
  }
  @media (min-width: 1536px) {
    h1 {
      font-size: 4rem;
    }
  }
  #title {
    @apply relative;
  }
  #title .title-layer {
    grid-area: 1 / 1;
    line-height: 1.05;
  }
  #title .char-mask {
    @apply inline-block;
    line-height: 1.05;
    vertical-align: top;
    clip-path: inset(-0.05em 0 -0.05em 0);
  }
  #title .char {
    @apply inline-block;
    line-height: 1.05;
    transform: translateY(100%);
    will-change: transform;
    vertical-align: top;
  }
  #title .title-layer.old .char {
    transform: translateY(0%);
  }
  /* New title layer sits above old title layer */
  #title .title-layer:not(.old) {
    z-index: 2;
  }
  #title .title-layer.old {
    z-index: 1;
  }
</style>
