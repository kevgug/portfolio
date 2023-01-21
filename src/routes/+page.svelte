<script>
  import HeroSection from "../lib/views/HeroSection.svelte";
</script>

<div class="w-screen max-w-screen-xl flex flex-col mx-auto">
  <HeroSection />
  <p class="text-lg">below the fold</p>
</div>

<style lang="postcss">
  :root {
    @apply bg-background;
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
    @apply list-none;
    @apply relative; /* positioning context for bullet */
  }

  :global(li::before) {
    content: "";
    font-size: 2.5em; /* the default unicode bullet size is very small */
    line-height: 0; /* kills huge line height on resized bullet */

    @apply w-1;
    @apply h-1;
    @apply xl:w-[0.4rem];
    @apply xl:h-[0.4rem];
    @apply rounded-full;
    @apply bg-mutedGrey;
    @apply absolute; /* position bullet relative to list item */
    @apply top-[0.23em]; /* vertical align bullet position relative to list item */
    @apply left-[-0.55em]; /* position the bullet L- R relative to list item */
  }
</style>
