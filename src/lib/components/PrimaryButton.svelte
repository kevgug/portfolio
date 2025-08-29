<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import type { LinkButtonContent as LinkButtonContent } from "$lib/util/linkButtonContent";
  import Icon, { type IconName } from "./Icon.svelte";

  export let linkButtonContent: LinkButtonContent;
  export let iconName: IconName;
  export let iconFlipY = false;
  export let variant: "default" | "glacial" = "default";

  const whiteColor = tailwindTheme.colors.white;
  const glacialColor = tailwindTheme.colors["glacial-blue-darkest"];

  let iconColor: string = whiteColor;
  $: iconColor = variant === "glacial" ? glacialColor : whiteColor;
</script>

<a
  class="button flex flex-row"
  class:button--glacial={variant === "glacial"}
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
  <Icon name={iconName} color={iconColor} size="0.75em" flipY={iconFlipY} />
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

  .button--glacial {
    @apply bg-none bg-glacial-blue-deep;
    @apply border-solid border-[1px] border-glacial-blue-deep;
    @apply text-glacial-blue-darkest;

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

  .button--glacial:hover {
    box-shadow: rgba(93, 217, 203, 0.35) 0 8px 28px;
    @apply border-glacial-blue-darker;

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

  .button--glacial:active {
    box-shadow: rgba(169, 244, 233, 0.6) 0 0px 32px;
  }
</style>
