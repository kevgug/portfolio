<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import Icon from "$lib/components/Icon.svelte";
  import LinkButton from "$lib/components/LinkButton.svelte";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";

  // Colors
  const mutedTextGreyColor = tailwindTheme.colors["muted-text-grey"];
  let screenWidth = 0;
  $: globeIconSize = responsiveIconSize(SmFontSize.sm, screenWidth);
</script>

<svelte:window bind:innerWidth={screenWidth} />

<nav
  class="w-full sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-white/10"
>
  <div
    class="flex flex-row justify-between items-center mx-auto w-full max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] h-16 md:h-20"
  >
    <div class="flex flex-row items-center space-x-2 md:space-x-3">
      <p class="text-muted-text-grey">Kevin Gugelmann</p>
    </div>
    <div class="flex flex-row space-x-4 md:space-x-5">
      <LinkButton
        linkButtonContent={{
          label: "Let's build together",
          destination:
            "mailto:kevin@kevingugelmann.com?subject=Let's%20collaborate%20on%20%5BProject%20name%5D&body=Hi%20Kevin%2C%0A%0AI%27m%20reaching%20out%20about%20a%20potential%20collaboration%20in%20UX%20engineering.%20Here%27s%20what%20I%27m%20looking%20for%3A%0A%0A%5BDescribe%20your%20project%20%E2%80%94%20landing%20page%2C%20full%20stack%20help%2C%20startup%20role%2C%20etc.%5D%0A%0AWhy%20I%20think%20you%27d%20be%20a%20great%20fit%3A%0A%0A%5BShare%20your%20thoughts%5D%0A%0ALooking%20forward%20to%20connecting!%0A%0ABest%2C%0A%5BYour%20Name%5D",
          mediaType: "none",
          eventName: "hero_ext_email_primary",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
</nav>
