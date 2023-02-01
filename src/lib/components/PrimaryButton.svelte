<script lang="ts">
  import { tailwindTheme } from "$lib/tailwindTheme";
  import Icon from "./Icon.svelte";

  export let label: string;
  export let iconName: string;
  export let iconFlipY = false;

  const whiteColor = tailwindTheme.colors.white;
</script>

<button class="button flex flex-row">
  {label}
  <div class="mr-[0.4rem] md:mr-[0.6rem]" />
  <Icon name={iconName} color={whiteColor} size="0.75em" flipY={iconFlipY} />
</button>

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
    @apply duration-outro;
    @apply ease-outro;
  }

  .button:hover {
    box-shadow: rgba(0, 1, 0, 0.15) 0 2px 30px;

    @apply opacity-[85%];
    @apply transition-all;
    @apply duration-intro;
    @apply ease-intro;
  }

  .button:active {
    box-shadow: rgba(0, 1, 0, 0.3) 0 2px 4px;

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
