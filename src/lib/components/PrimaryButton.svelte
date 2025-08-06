<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import type { LinkButtonContent as LinkButtonContent } from "$lib/util/linkButtonContent";
  import Icon from "./Icon.svelte";

  export let linkButtonContent: LinkButtonContent;
  export let iconName: string;
  export let iconFlipY = false;

  const whiteColor = tailwindTheme.colors.white;
</script>

<a
  class="button flex flex-row"
  href={typeof linkButtonContent.destination == "string"
    ? linkButtonContent.destination
    : "javascript:;"}
  data-sa-link-event={linkButtonContent.eventName}
  target={linkButtonContent.openInNewTab ?? false ? "_blank" : "_self"}
  rel={linkButtonContent.openInNewTab ?? false ? "noreferrer" : ""}
  on:click={typeof linkButtonContent.destination == "function"
    ? linkButtonContent.destination
    : null}
>
  {linkButtonContent.label}
  <div class="mr-[0.4rem] md:mr-[0.6rem]" />
  <Icon name={iconName} color={whiteColor} size="0.75em" flipY={iconFlipY} />
</a>

<style lang="postcss">
  .button {
    align-items: center;
    background: linear-gradient(180deg, #4b4e56 0%, #282b2f 99%);
    border: 1px solid #403e3e;
    color: theme(colors.white);

    @apply rounded-lg md:rounded-xl;
    @apply px-[0.85rem] md:px-4;
    @apply py-2;

    @apply transition-all;
    @apply duration-intro;
    @apply ease-outro;
  }

  .button:hover {
    box-shadow: rgba(169, 244, 233, 0.2) 0 1px 24px;
    @apply border-glacial-blue;

    @apply transition-all;
    @apply duration-intro;
    @apply ease-out;
  }

  .button:active {
    box-shadow: rgba(169, 244, 233, 0.5) 0 0px 32px;

    @apply opacity-[75%];
    @apply transition-all;
    @apply duration-intro;
    @apply ease-intro;
  }
</style>
