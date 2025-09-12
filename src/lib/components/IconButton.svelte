<script lang="ts">
  import { responsiveIconSize, SmFontSize } from "$lib/util/responsiveIcon";
  import Icon, { type IconName } from "./Icon.svelte";

  // Props
  export let destination: string | VoidFunction;
  export let iconName: IconName;
  export let eventName: string;
  export let openInNewTab: boolean = false;

  // Calculations
  let innerWidth: number = 0;
  $: iconSize = responsiveIconSize(SmFontSize.sm, innerWidth);
</script>

<svelte:window bind:innerWidth />

<a
  class="group relative"
  href={typeof destination == "string" ? destination : null}
  data-sa-link-event={eventName}
  target={openInNewTab ? "_blank" : "_self"}
  rel={openInNewTab ? "noreferrer" : ""}
  on:click={typeof destination == "function" ? destination : null}
>
  <Icon
    name={iconName}
    size={iconSize}
    class="text-white group-hover:!text-glacial-blue duration-100 transition-all"
  />
</a>
