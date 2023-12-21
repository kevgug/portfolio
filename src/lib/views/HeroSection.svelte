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
  class="flex flex-col justify-between
        py-screen-y
        md:supports-[height:100cqh]:h-[100cqh] md:supports-[height:100svh]:h-[100svh] md:h-screen
        supports-[height:100cqh]:min-h-[100cqh] supports-[height:100svh]:min-h-[100svh] min-h-screen
        md:min-h-[48em] lg:min-h-[50em] xl:min-h-[54em]
        md:max-h-[52em] lg:max-h-[54em] xl:max-h-[54em]"
>
  <div class="flex flex-row justify-between pt-1 md:pb-5 lg:pb-8">
    <div class="flex flex-row items-center space-x-2 md:space-x-3">
      <Icon
        name="network-pin"
        color={mutedTextGreyColor}
        size={globeIconSize}
      />
      <p class="text-muted-text-grey inline md:hidden">LDN / CHI</p>
      <p class="text-muted-text-grey hidden md:inline">
        London, UK  /  Chicago, IL
      </p>
    </div>
    <div class="flex flex-row space-x-4 md:space-x-5">
      <LinkButton
        linkButtonContent={{
          label: "Email",
          destination: "mailto:contact@kevingugelmann.com",
          mediaType: "none",
          eventName: "hero_ext_email_primary",
          openInNewTab: true,
        }}
      />
      <LinkButton
        linkButtonContent={{
          label: "LinkedIn",
          destination: "https://www.linkedin.com/in/kevingugelmann/",
          mediaType: "none",
          eventName: "hero_ext_linkedin",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
  <div
    bind:this={heroContent}
    class="flex flex-row items-center
         pt-14 pb-14 md:pt-0 md:pb-0"
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
        <h2
          id="full-name"
          class="text-glacial-blue uppercase 
                mb-2 md:mb-3"
        >
          Kevin Gugelmann
        </h2>
        <h1
          id="title"
          class="text-glacial-blue
                mb-8 xl:mb-12"
        >
          Blending Imagination and Engineering into Human-Centric Software
        </h1>
        <ul>
          <li>
            End-to-end SaaS production, from user research and design to
            multi-platform development and marketing
          </li>
          <li>
            Design that performs, such as redesigning the TFDi's landing page <span
              >(2x site traffic in one month)</span
            >
            and winning the UChicago designathon
            <span>(Most Well-Designed App, 2022)</span>
          </li>
          <li>
            Diverse experience across languages <span>(English, German)</span>,
            industries
            <span>(Fintech, Health, Sport, News, Productivity)</span>, design
            tools
            <span>(Figma, Sketch, Adobe XD)</span>, and programming tools
            <span
              >(React, Svelte, TypeScript, Flutter, React Native, TailwindCSS,
              Python, C, Java)</span
            >
          </li>
        </ul>
      </div>
      <div
        class="mt-[4.5rem] lg:mt-[5.5rem]
              hidden md:flex"
      >
        <PrimaryButton
          linkButtonContent={{
            label: "View Portfolio",
            destination: scrollToProjects,
            mediaType: "none",
            eventName: "hero_scrollto_projects",
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
