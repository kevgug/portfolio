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
          label: "Start a conversation",
          destination:
            "mailto:kevin@kevingugelmann.com?subject=Inquiry%20from%20kevingugelmann.com&body=Hi%20Kevin%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20was%20impressed%20by%20your%20work.%20I%27d%20like%20to%20start%20a%20conversation%20about%20a%20potential%20opportunity.%0A%0A%5BBriefly%20describe%20the%20role%20or%20project%20you%20have%20in%20mind%5D%0A%0ALooking%20forward%20to%20connecting.%0A%0ABest%2C%0A%5BYour%20Name%5D",
          mediaType: "none",
          eventName: "navbar_ext_email_primary",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
</nav>
