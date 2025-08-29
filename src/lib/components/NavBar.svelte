<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import Icon from "$lib/components/Icon.svelte";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import HamburgerMenu from "$lib/components/HamburgerMenu.svelte";
  import MenuOverlay from "$lib/components/MenuOverlay.svelte";

  // Colors
  const mutedTextGreyColor = tailwindTheme.colors["muted-text-grey"];
  let screenWidth = 0;
  $: globeIconSize = responsiveIconSize(SmFontSize.sm, screenWidth);
  let menuOpen = false;
</script>

<svelte:window bind:innerWidth={screenWidth} />

<MenuOverlay bind:open={menuOpen} />

<nav
  class="w-full fixed top-0 z-50 backdrop-blur-md bg-background/70 border-b border-white/10"
>
  <div
    class="flex flex-row justify-between items-center mx-auto w-full max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] h-16 md:h-20"
  >
    <div class="flex flex-row items-center space-x-2 md:space-x-3">
      <HamburgerMenu bind:open={menuOpen} />
    </div>
    <div class="flex flex-row space-x-4 md:space-x-5">
      <LinkButton
        linkButtonContent={{
          label: "Connect with Kevin",
          destination: "https://linkedin.com/in/kevingugelmann",
          mediaType: "none",
          eventName: "navbar_ext_linkedin_primary",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
</nav>
