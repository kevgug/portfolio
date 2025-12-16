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
  import { gsap } from "gsap";
  import { projects } from "$lib/projects";
  import { layoutReady } from "$lib/stores/layoutReady";

  // Assets
  import jpmcLogo from "$lib/images/logos/jpmc-white.svg";
  import freestyleLogo from "$lib/images/logos/freestyle.svg";
  import uchicagoLogo from "$lib/images/logos/uchicago.svg";
  import ycLogo from "$lib/images/logos/y-combinator.svg";

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
  const oldTitleDesktopText = `${oldTitleLine1} ${oldTitleLine2}`;
  const newTitleLine1 = "Kevin Gugelmann.";
  const newTitleLine2 = "AI-native designer.";
  const newTitleDesktopText = `${newTitleLine1} ${newTitleLine2}`;

  let oldTitleElement: HTMLElement;
  let newTitleDesktopElement: HTMLElement;
  let newTitleMobileElement: HTMLElement;

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
    
    // Mark layout as ready after calculations are complete
    layoutReady.set(true);

    // Title initial states
    const oldChars = oldTitleElement
      ? (oldTitleElement.querySelectorAll(".char") as unknown as HTMLElement[])
      : null;
    const newCharsAll = [
      ...Array.from(
        (newTitleDesktopElement?.querySelectorAll(
          ".char"
        ) as unknown as HTMLElement[]) ?? []
      ),
      ...Array.from(
        (newTitleMobileElement?.querySelectorAll(
          ".char"
        ) as unknown as HTMLElement[]) ?? []
      ),
    ];

    if (oldChars) {
      gsap.set(oldChars, { y: "0%" });
    }
    if (newCharsAll.length) {
      gsap.set(newCharsAll, { y: "100%" });
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

      if (oldChars) {
        timeline.to(oldChars, {
          y: "-110%",
          duration: 0.55,
          ease: "power3.in",
          stagger: 0.009,
        });
      }

      const isSmallNow =
        getCurrentBreakpoint(
          typeof window !== "undefined" ? window.innerWidth : screenWidth
        ) == BreakpointSizes.sm;
      const targetNewChars = isSmallNow
        ? (newTitleMobileElement?.querySelectorAll(
            ".char"
          ) as unknown as HTMLElement[])
        : (newTitleDesktopElement?.querySelectorAll(
            ".char"
          ) as unknown as HTMLElement[]);
      const otherNewChars = isSmallNow
        ? (newTitleDesktopElement?.querySelectorAll(
            ".char"
          ) as unknown as HTMLElement[])
        : (newTitleMobileElement?.querySelectorAll(
            ".char"
          ) as unknown as HTMLElement[]);

      if (targetNewChars && targetNewChars.length) {
        timeline.to(
          targetNewChars,
          {
            y: "0%",
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.012,
          },
          oldChars ? "-=0.35" : 0
        );
      }

      // Ensure hidden variant (desktop/mobile) is also at rest for future resizes
      if (otherNewChars && (otherNewChars as any).length) {
        timeline.set(otherNewChars, { y: "0%" }, ">-=0.1");
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
        setTimeout(runTitleSwap, 500);
      }
    }, 850);

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
    pt-4 pb-8 md:pt-6 md:pb-20
    {useZeigarnikEffect ? 'relative min-h-[100svh] md:min-h-screen' : ''}"
>
  <div
    bind:this={heroContent}
    class="flex flex-col justify-center
         {useZeigarnikEffect
      ? 'flex-1 pb-40 md:pb-48 lg:pb-60 min-h-[40rem] md:min-h-[38rem] lg:min-h-[44rem]'
      : 'pb-0 min-h-[24rem] md:min-h-[28rem] lg:min-h-[32rem]'}"
  >
    <div class="w-full">
      <div>
        <h1
          id="title"
          class="text-glacial-blue
                mb-8 xl:mb-9 grid"
        >
          <!-- Final (desktop) title layer -->
          <span
            class="title-layer hidden md:inline"
            bind:this={newTitleDesktopElement}
            aria-hidden="true"
          >
            {#each splitChars(newTitleDesktopText) as ch, i}
              <span class="char-mask"
                ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
              >
            {/each}
          </span>

          <!-- Final (mobile) title layer -->
          <span
            class="title-layer md:hidden flex flex-col gap-3 min-[315px]:gap-0"
            bind:this={newTitleMobileElement}
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
                {#each splitChars("AI-native") as ch}
                  <span class="char-mask"
                    ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                  >
                {/each}
                <br />
                {#each splitChars("designer.") as ch}
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
            aria-label={newTitleDesktopText}
          >
            <!-- Desktop: single line -->
            <span class="hidden md:inline">
              {#each splitChars(oldTitleDesktopText) as ch}
                <span class="char-mask"
                  ><span class="char">{ch === " " ? "\u00A0" : ch}</span></span
                >
              {/each}
            </span>
            <!-- Mobile: two lines -->
            <span class="md:hidden flex flex-col gap-3 min-[315px]:gap-0">
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
            Built an AI tool at
            <a href="https://jpmorganchase.com">JPMorganChase</a> saving designers 300+ hours per year.
          </li>
          <li>
            Designed and shipped three full-stack websites at
            <a href="https://www.freestyle.sh">Freestyle (YC S24)</a>.
          </li>
          <li>
            Won 1st place at both the <a
            href="https://www.uchicago.edu">UChicago</a
            > designathon and hackathon.
          </li>
        </ul>
        <div class="flex items-center gap-2 mt-8 md:mt-9">
          <PrimaryButton
            linkButtonContent={{
              label: "View portfolio",
              destination: scrollToFirstProject,
              mediaType: "none",
              eventName: "herosection_portfolio_primary",
              openInNewTab: false,
            }}
            variant="glacial"
          />
          <PrimaryButton
            linkButtonContent={{
              label: "Email me",
              destination: "mailto:kevin@kevingugelmann.com",
              mediaType: "none",
              eventName: "herosection_email_secondary",
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
    style="height: {useZeigarnikEffect
      ? bottomSectionHeight
      : boundedSeparatorMarginY}px"
  />
</div>

<style lang="postcss">
  h1 {
    position: relative;
    font-size: 1.75rem;
  }
  @media (min-width: 360px) {
    h1 {
      font-size: 2rem;
    }
  }
  @media (min-width: 768px) {
    h1 {
      font-size: calc(max(2rem, min(4rem, 4.5vw)));
    }
  }
  @media (min-width: 1536px) {
    h1 {
      font-size: 4rem;
    }
  }
  #title .title-layer {
    grid-area: 1 / 1;
    @apply leading-tight;
  }
  #title .char-mask {
    @apply inline-block overflow-hidden leading-tight;
    vertical-align: top;
  }
  #title .char {
    @apply inline-block leading-tight;
    transform: translateY(100%);
    will-change: transform;
    vertical-align: top;
  }
  #title .title-layer.old .char {
    transform: translateY(0%);
  }
</style>
