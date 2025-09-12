<script lang="ts">
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import Icon, { type IconName } from "./Icon.svelte";
  import PulsingCircle from "./PulsingCircle.svelte";

  // Props
  export let linkButtonContent: LinkButtonContent;
  export let iconName: IconName = "arrow-corner-right";
  export let usePulsingCircle: boolean = false;

  // Calculations
  let innerWidth: number = 0;
  $: arrowIconSize = responsiveIconSize(SmFontSize.xs, innerWidth);
  $: arrowIconSizeNumber = parseInt(arrowIconSize.replace("px", ""));
</script>

<svelte:window bind:innerWidth />

{#if typeof linkButtonContent.destination == "string"}
  <a
    class="group relative"
    href={linkButtonContent.destination}
    data-sa-link-event={linkButtonContent.eventName}
    target={linkButtonContent.openInNewTab ?? false ? "_blank" : "_self"}
    rel={linkButtonContent.openInNewTab ?? false ? "noreferrer" : ""}
  >
    <div
      class="flex flex-row items-center {usePulsingCircle
        ? 'space-x-2'
        : 'space-x-1.5'}"
    >
      <p
        class="text-white group-hover:!text-glacial-blue font-thin
  	  duration-100 transition-all"
      >
        {linkButtonContent.label}
      </p>
      {#if usePulsingCircle}
        <PulsingCircle size={arrowIconSizeNumber} />
      {:else}
        <Icon
          name={iconName}
          size={arrowIconSize}
          flipY={iconName === "arrow-corner-right"}
          class="text-white group-hover:!text-glacial-blue duration-100 transition-all"
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
    duration-100 transition-all"
      />
    </div>
  </a>
{:else}
  <button
    class="group relative cursor-pointer select-none"
    data-sa-link-event={linkButtonContent.eventName}
    on:click={linkButtonContent.destination}
  >
    <div
      class="flex flex-row items-center {usePulsingCircle
        ? 'space-x-2'
        : 'space-x-1.5'}"
    >
      <p
        class="text-white group-hover:!text-glacial-blue font-thin
  	  duration-100 transition-all select-none"
      >
        {linkButtonContent.label}
      </p>
      {#if usePulsingCircle}
        <PulsingCircle size={arrowIconSizeNumber} />
      {:else}
        <Icon
          name={iconName}
          size={arrowIconSize}
          flipY={iconName === "arrow-corner-right"}
          class="text-white group-hover:!text-glacial-blue duration-100 transition-all"
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
    duration-100 transition-all"
      />
    </div>
  </button>
{/if}
