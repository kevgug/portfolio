<script lang="ts">
  import type { LinkButtonContent } from "$lib/util/linkButtonContent";
  import Icon, { type IconName } from "./Icon.svelte";

  export let linkButtonContent: LinkButtonContent;
  export let iconName: IconName;
  export let iconFlipY = false;
  export let variant: "default" | "glacial" = "default";
</script>

<a
  class="button flex flex-row"
  class:button--glacial={variant === "glacial"}
  href={typeof linkButtonContent.destination === "string"
    ? linkButtonContent.destination
    : undefined}
  data-sa-link-event={linkButtonContent.eventName}
  target={linkButtonContent.openInNewTab ?? false ? "_blank" : "_self"}
  rel={linkButtonContent.openInNewTab ?? false ? "noreferrer" : ""}
  on:click={typeof linkButtonContent.destination === "function"
    ? linkButtonContent.destination
    : undefined}
>
  {linkButtonContent.label}
  <div class="pl-[0.52rem] md:pl-[0.6rem] pr-[0.04rem] md:pr-[0.1rem]">
    <Icon name={iconName} size="0.75em" flipY={iconFlipY} />
  </div>
</a>

<style lang="postcss">
  .button {
    align-items: center;
    background: transparent;
    border: 1px solid #5a5a5a;
    @apply text-white;

    @apply rounded-full;
    @apply px-4 md:px-6;
    @apply py-2 md:py-2.5;

    @apply transition-all;
    @apply duration-200;
    @apply ease-outro;
  }

  .button--glacial {
    @apply text-black;
    @apply bg-glacial-blue;
    @apply border-solid border-[1px] border-white/40;

    @apply transition-all;
    @apply duration-200;
    @apply ease-outro;
  }

  .button:hover {
    box-shadow: rgba(213, 219, 218, 0.15) 0 8px 28px;
    @apply border-[#a7a7a7];

    @apply transition-all;
    @apply duration-200;
    @apply ease-out;
  }

  .button--glacial:hover {
    @apply opacity-90;
    @apply border-solid border-[1px] border-white/70;

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
    @apply opacity-80;
  }
</style>
