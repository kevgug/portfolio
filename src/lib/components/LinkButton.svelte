<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import Icon from "./Icon.svelte";

  // Props
  export let linkButtonContent: LinkButtonContent;

  // Interactions
  let isHovering = false;

  // Colors
  const mutedTextGreyColor = tailwindTheme.colors["muted-text-grey"];
  const whiteColor = tailwindTheme.colors["white"];
  $: iconColor = isHovering ? whiteColor : mutedTextGreyColor;

  // Calculations
  let innerWidth: number = 0;
  $: arrowIconSize = responsiveIconSize(SmFontSize.xs, innerWidth);
</script>

<svelte:window bind:innerWidth />

<a
  class="group relative"
  href={typeof linkButtonContent.destination == "string"
    ? linkButtonContent.destination
    : null}
  data-sa-link-event={linkButtonContent.eventName}
  target={linkButtonContent.openInNewTab ?? false ? "_blank" : "_self"}
  rel={linkButtonContent.openInNewTab ?? false ? "noreferrer" : ""}
  on:pointerover={() => (isHovering = true)}
  on:pointerout={() => (isHovering = false)}
  on:click={typeof linkButtonContent.destination == "function"
    ? linkButtonContent.destination
    : null}
>
  <div class="group flex flex-row items-center space-x-1.5">
    <p
      class="text-muted-text-grey group-hover:text-white
	  duration-100"
    >
      {linkButtonContent.label}
    </p>
    <Icon
      name="arrow-corner-right"
      color={iconColor}
      size={arrowIconSize}
      flipY
    />
  </div>
  <div
    class="absolute flex flex-col-reverse
	w-full h-[0.24rem] md:h-[0.25rem]"
  >
    <div
      class="
	  h-[2px] rounded-sm
  bg-muted-text-grey group-hover:bg-white
  opacity-40 group-hover:opacity-100
  duration-100"
    />
  </div>
</a>
