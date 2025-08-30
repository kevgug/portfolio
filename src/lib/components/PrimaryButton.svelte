<script lang="ts">
  import type { LinkButtonContent as LinkButtonContent } from "$lib/util/linkButtonContent";
  import Icon, { type IconName } from "./Icon.svelte";

  export let linkButtonContent: LinkButtonContent;
  export let iconName: IconName;
  export let iconFlipY = false;
  export let variant: "default" | "glacial" = "default";
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
  <div class="pl-[0.52rem] md:pl-[0.6rem] pr-[0.04rem] md:pr-[0.1rem]">
    <Icon name={iconName} size="0.75em" flipY={iconFlipY} />
  </div>
</a>

<style lang="postcss">
  .button {
    align-items: center;
    background: linear-gradient(180deg, #4b4e56 0%, #282b2f 99%);
    border: 1px solid #403e3e;
    @apply text-white;

    @apply rounded-full;
    @apply px-4 md:px-6;
    @apply py-2 md:py-2.5;

    @apply transition-all;
    @apply duration-200;
    @apply ease-outro;
  }

  .button--glacial {
    @apply text-white;
    @apply bg-none bg-[#097678];
    @apply border-solid border-[1px] border-[#043131];

    @apply transition-all;
    @apply duration-200;
    @apply ease-outro;
  }

  .button:hover {
    box-shadow: rgba(213, 219, 218, 0.15) 0 8px 28px;
    @apply border-white;

    @apply transition-all;
    @apply duration-200;
    @apply ease-out;
  }

  .button--glacial:hover {
    box-shadow: rgba(213, 219, 218, 0.15) 0 8px 28px;
    @apply text-white;
    @apply border-glacial-blue;

    @apply transition-all;
    @apply duration-200;
    @apply ease-out;
  }

  .button:active {
    box-shadow: rgba(169, 244, 233, 0.5) 0 0px 32px;

    @apply opacity-[75%];
    @apply transition-all;
    @apply duration-200;
    @apply ease-intro;
  }

  .button--glacial:active {
    box-shadow: rgba(169, 244, 233, 0.6) 0 0px 32px;
  }
</style>
