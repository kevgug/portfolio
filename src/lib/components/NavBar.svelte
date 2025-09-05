<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import Icon from "$lib/components/Icon.svelte";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";
  import MenuOverlay from "$lib/components/MenuOverlay.svelte";
  import { subscribeModalOpen } from "$lib/stores/subscribe";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";

  // Colors
  const mutedTextGreyColor = tailwindTheme.colors["muted-text-grey"];
  let screenWidth = 0;
  $: globeIconSize = responsiveIconSize(SmFontSize.sm, screenWidth);
  let menuOpen = false;

  export let showBlogLink: boolean = false;
  export let isBlogPage: boolean = false;
  export let isBlogPostPage: boolean = false;
</script>

<svelte:window bind:innerWidth={screenWidth} />

<MenuOverlay bind:open={menuOpen} />

<nav
  class="w-full fixed top-0 z-50 backdrop-blur-md bg-background/70 border-b border-white/10"
>
  <div
    class="flex flex-row justify-between items-center mx-auto w-full max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] h-16 md:h-20"
  >
    <!-- Left side -->
    <div class="flex flex-row items-center space-x-2 md:space-x-3">
      {#if isBlogPage || isBlogPostPage}
        {#if isBlogPage}
          <IconButton
            destination="/"
            iconName="house"
            eventName="navbar_home"
            openInNewTab={false}
          />
        {:else if isBlogPostPage}
          <IconButton
            destination="/essays"
            iconName="arrow-left"
            eventName="navbar_back_to_blog"
            openInNewTab={false}
          />
        {/if}
      {:else}
        <HamburgerMenu bind:open={menuOpen} />
      {/if}
    </div>

    <!-- Right side -->
    <div class="flex flex-row items-center space-x-4 md:space-x-5">
      {#if isBlogPage || isBlogPostPage}
        <!-- Blog pages: subscribe button with bell icon -->
        <LinkButton
          linkButtonContent={{
            label: "Subscribe",
            destination: () => subscribeModalOpen.set(true),
            mediaType: "icon",
            eventName: "navbar_subscribe",
            openInNewTab: false,
          }}
          usePulsingCircle={false}
          iconName="bell"
        />
      {:else}
        <!-- Portfolio page -->
        {#if showBlogLink}
          <LinkButton
            linkButtonContent={{
              label: "Essays",
              destination: "/essays",
              mediaType: "icon",
              eventName: "navbar_blog",
              openInNewTab: false,
            }}
            usePulsingCircle={true}
          />
        {/if}
      {/if}
    </div>
  </div>
</nav>
