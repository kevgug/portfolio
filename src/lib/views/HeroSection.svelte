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

  // Assets
  import atfPhoneSrc from "$lib/images/atf-phone.png";
  import atfPhoneAvif from "$lib/images/atf-phone.avif";
  import atfPhoneWebp from "$lib/images/atf-phone.webp";
  import Image from "$lib/components/Image.svelte";

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
    });

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
    pt-8 pb-8 md:pt-12 md:pb-12
    min-h-[36em] h-[calc(100vh-4rem)] max-h-[40em] md:max-h-[42em] lg:max-h-[44em]"
  style=""
>
  <div
    bind:this={heroContent}
    class="flex flex-row items-center
         pt-6 pb-14 md:pt-0 md:pb-0"
  >
    <Image
      imgOptions={{
        src: atfPhoneSrc,
        avifSrc: atfPhoneAvif,
        webpSrc: atfPhoneWebp,
        alt: "A tilted iPhone showing Kevin's latest mobile app design",
        loading: "eager",
      }}
      class="hidden md:flex 
          object-contain
          w-auto
          max-w-[15rem] lg:max-w-[16rem] xl:max-w-[16.5rem]
          min-h-[35rem]
          md:pr-10 xl:pr-12
          mr-2 lg:mr-4 xl:mr-8
          mb-7 lg:mb-9 xl:mb-7"
    />
    <div>
      <div>
        <h1
          id="title"
          class="text-glacial-blue
                mb-8 xl:mb-12"
        >
          UX Designer Building Shippable, Psychology-Backed Products.
        </h1>
        <ul>
          <li>
            User Experience Designer at <a href="https://jpmorgan.com"
              >JPMorgan</a
            > for Summer 2025.
          </li>
          <li>
            Previously, Software Engineer at <a href="https://www.freestyle.sh"
              >Freestyle</a
            >
            (YC S24) and <a href="https://gridlink.co">GridLink</a>
            (Techstars '23).
          </li>
          <li>
            3rd year Cognitive Science and Economics at the <a
              href="https://www.uchicago.edu">University of Chicago</a
            >. Winner of the designathon and hackathon.
          </li>
        </ul>
      </div>
      <div
        class="mt-[4.5rem] lg:mt-[5.5rem]
              hidden md:flex"
      >
        <PrimaryButton
          linkButtonContent={{
            label: "Explore Portfolio",
            destination: scrollToProjects,
            mediaType: "none",
            eventName: "hero_scrollto_projects",
          }}
          iconName="arrow-down"
        />
      </div>
    </div>
  </div>
  <div bind:this={separator} class="flex justify-center">
    <!-- Show separator only on MD+ screens -->
    <div class="hidden md:flex">
      <Separator />
    </div>
    <!-- On small devices (i.e. phones) show scroll down arrow -->
    <div class="md:hidden mb-1">
      <a
        href={"javascript:;"}
        on:click={scrollToProjects}
        data-sa-link-event="hero_scrollto_projects"
      >
        <Icon name="arrow-down" color={whiteColor} />
      </a>
    </div>
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
