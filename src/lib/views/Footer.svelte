<script lang="ts">
  // Assets
  import githubSvg from "$lib/images/built-with-icons/github.svg";
  import linkedinSvg from "$lib/images/built-with-icons/linkedin.svg";
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
    <a href="https://github.com/kevgug" target="_blank" rel="noreferrer">
      <img src={githubSvg} alt="Github logo" />
    </a>
    <a
      href="https://www.linkedin.com/in/kevingugelmann"
      target="_blank"
      rel="noreferrer"
    >
      <img src={linkedinSvg} alt="LinkedIn logo" />
    </a>
  </div>
  <div class="flex flex-col-reverse md:flex-row md:justify-between">
    <p class="text-muted-text-grey font-light">
      Designed in Sketch. Developed with SvelteKit & TailwindCSS.<br />
      Copyright © 2024 Kevin Gugelmann. All rights reserved.
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
