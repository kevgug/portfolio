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
    : null}
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
    background: linear-gradient(180deg, #3a3c42 0%, #232529 99%);
    border: 1px solid #434343;
    color: theme(colors.white);

    @apply rounded-lg md:rounded-xl;
    @apply px-[0.85rem] md:px-4;
    @apply py-2;

    @apply transition-all;
    @apply duration-intro;
    @apply ease-outro;
  }

  .button:hover {
    box-shadow: rgba(255, 255, 255, 0.06) 0 0px 12px;

    @apply transition-all;
    @apply duration-intro;
    @apply ease-out;
  }

  .button:active {
    box-shadow: rgba(255, 255, 255, 0.1) 0 0px 12px;

    @apply opacity-[75%];
    @apply transition-all;
    @apply duration-intro;
    @apply ease-intro;
  }

  @media (max-width: 420px) {
    .button {
      height: 48px;
    }
  }
</style>
