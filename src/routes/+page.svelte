<script>
  import HeroSection from "../lib/views/HeroSection.svelte";
</script>

<div class="w-screen max-w-screen-xl flex flex-col mx-auto">
  <HeroSection />
  <p class="text-lg">below the fold</p>
</div>

<style lang="postcss">
  :root {
    background-color: theme(colors.background);
  }

  :global(p, h1, h2, li) {
    color: theme(colors.white);
  }

  :global(h1) {
    @apply text-2xl;
    @apply font-semibold;
    @apply md:text-3xl;
    @apply xl:text-4xl;
  }

  :global(h2) {
    @apply text-base;
    @apply md:text-lg;
  }

  :global(p, li) {
    @apply text-sm;
    @apply md:text-base;
    @apply xl:text-xl;
  }

  :global(li) {
    @apply font-serif;
  }
</style>
