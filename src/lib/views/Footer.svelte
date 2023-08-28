<script lang="ts">
  // Assets
  import sketchSvg from "$lib/images/built-with-icons/sketch.svg";
  import svelteSvg from "$lib/images/built-with-icons/svelte.svg";
  import tailwindCssSvg from "$lib/images/built-with-icons/tailwind-css.svg";
</script>

<div
  class="flex flex-col
        mb-11
        mt-0.5 md:mt-1 lg:mt-2
        md:justify-between md:items-center md:flex-row-reverse"
>
  <div
    class="flex flex-row
          space-x-2.5 md:space-x-[0.7rem] lg:space-x-3
          mb-[1.35rem] md:mb-0
          mt-2 md:mt-0"
  >
    <a href="https://www.sketch.com/" target="_blank" rel="noreferrer">
      <img src={sketchSvg} alt="Sketch logo" />
    </a>
    <a href="https://svelte.dev/" target="_blank" rel="noreferrer">
      <img src={svelteSvg} alt="Svelte logo" />
    </a>
    <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
      <img src={tailwindCssSvg} alt="Tailwind CSS logo" />
    </a>
  </div>
  <div class="flex flex-col-reverse md:flex-row md:justify-between">
    <p class="text-muted-text-grey font-light">
      Designed in Sketch. Developed with SvelteKit & TailwindCSS.<br />
      Copyright © 2023 Kevin Gugelmann. All rights reserved.
    </p>
  </div>
</div>

<style lang="postcss">
  a {
    @apply grayscale;
    @apply transition-all;
    @apply ease-outro;
    @apply duration-200;
  }

  a:hover {
    @apply grayscale-0;
    @apply transition-all;
    @apply ease-intro;
    @apply duration-intro;
  }

  img {
    @apply h-5 w-5 lg:h-6 lg:w-6;
  }
</style>
