<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import Icon, { type IconName } from "./Icon.svelte";
  import PulsingCircle from "./PulsingCircle.svelte";

  // Props
  export let linkButtonContent: LinkButtonContent;
  export let iconName: IconName = "arrow-corner-right";
  export let usePulsingCircle: boolean = false;

  // Interactions
  let isHovering = false;

  // Colors
  const textColor = tailwindTheme.colors["white"];
  const hoverColor = tailwindTheme.colors["glacial-blue"];
  $: iconColor = isHovering ? hoverColor : textColor;

  // Calculations
  let innerWidth: number = 0;
  $: arrowIconSize = responsiveIconSize(SmFontSize.xs, innerWidth);
  $: arrowIconSizeNumber = parseInt(arrowIconSize.replace("px", ""));
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
  <div
    class="group flex flex-row items-center {usePulsingCircle
      ? 'space-x-2'
      : 'space-x-1.5'}"
  >
    <p
      class="text-white font-thin group-hover:text-glacial-blue
	  duration-100"
    >
      {linkButtonContent.label}
    </p>
    {#if usePulsingCircle}
      <PulsingCircle size={arrowIconSizeNumber} />
    {:else}
      <Icon
        name={iconName}
        color={iconColor}
        size={arrowIconSize}
        flipY={iconName === "arrow-corner-right"}
      />
    {/if}
  </div>
  <div
    class="flex flex-col-reverse
	w-full h-[0.24rem] md:h-[0.25rem]"
  >
    <div
      class="
	  h-[2px] rounded-sm
    bg-white group-hover:bg-glacial-blue
  opacity-[36%] group-hover:opacity-100
  duration-100"
    />
  </div>
</a>
