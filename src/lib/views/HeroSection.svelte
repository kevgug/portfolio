<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import Icon from "$lib/components/Icon.svelte";
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import { onMount } from "svelte";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";

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

  onMount(() => {
    calculateSeparatorDistance();
  });
</script>

<svelte:window
  bind:innerWidth={screenWidth}
  on:resize={(_) => calculateSeparatorDistance()}
/>

<div
  class="flex flex-col justify-between
        py-screen-y
        h-[calc(100vh-env(safe-area-inset-bottom))]
        min-h-[38em] md:min-h-[44em] lg:min-h-[45em] xl:min-h-[47em]
        max-h-[52em] md:max-h-[54em] lg:max-h-[55em] xl:max-h-[57em]"
>
  <div class="flex flex-row justify-between pt-1 md:pb-5 lg:pb-8">
    <div class="flex flex-row items-center space-x-2 md:space-x-3">
      <Icon
        name="network-pin"
        color={mutedTextGreyColor}
        size={globeIconSize}
      />
      <p class="text-muted-text-grey">Chicago, IL</p>
    </div>
    <div class="flex flex-row space-x-4 md:space-x-5">
      <LinkButton
        linkButtonContent={{
          label: "Email",
          href: "mailto:contact@kevingugelmann.com",
        }}
      />
      <LinkButton
        linkButtonContent={{
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/kevingugelmann/",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
  <div bind:this={heroContent} class="flex flex-row items-center">
    <Image
      imgOptions={{
        src: atfPhoneSrc,
        avifSrc: atfPhoneAvif,
        webpSrc: atfPhoneWebp,
        alt: "A tilted iPhone showing Kevin's latest mobile app",
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
        <h2
          class="text-glacial-blue uppercase 
                mb-2 md:mb-3"
        >
          Kevin Gugelmann
        </h2>
        <h1
          class="text-glacial-blue uppercase
                mb-8 xl:mb-12"
        >
          Digital Designer &<br />Front-End Developer
        </h1>
        <ul>
          <li>
            Self-driven student at the University of Chicago, studying Computer
            Science & Business Economics.
          </li>
          <li>Designing digital experiences for over 6 years.</li>
          <li>
            Conceptualizing and building meaningful software products using
            native and cross-platform technologies.
          </li>
        </ul>
      </div>
      <div
        class="mt-[4.5rem] lg:mt-[5.5rem]
              hidden md:flex"
      >
        <PrimaryButton
          linkButtonContent={{
            label: "View projects",
            href: "#projects",
          }}
          iconName="arrow-down"
        />
      </div>
    </div>
  </div>
  <div bind:this={separator}>
    <!-- Show separator only on MD+ screens -->
    <div class="hidden md:flex">
      <Separator />
    </div>
    <!-- On small devices (i.e. phones) show scroll down arrow -->
    <div class="md:hidden">
      <a href="#projects">
        <Icon name="arrow-down" color={whiteColor} size="1rem" />
      </a>
    </div>
  </div>
</div>
<div id="projects" style="height: {boundedSeparatorMarginY}px" />
