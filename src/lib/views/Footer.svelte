<script lang="ts">
  // Components
  import Icon from "$lib/components/Icon.svelte";
</script>

<div
  class="flex flex-col
        pb-11
        mt-0.5 md:pt-1 lg:pt-2
        md:justify-between md:items-center md:flex-row-reverse"
>
  <div
    class="flex flex-row
          space-x-2.5 md:space-x-[0.7rem] lg:space-x-3
          pb-[1.35rem] md:pb-0
          mt-2 md:mt-0"
  >
    <a href="https://cal.com/kevgug/intro" target="_blank" rel="noreferrer">
      <Icon name="webcam" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <a href="mailto:kevin@kevingugelmann.com">
      <Icon name="email" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <a
      href="https://www.linkedin.com/in/kevingugelmann"
      target="_blank"
      rel="noreferrer"
    >
      <Icon name="linkedin" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <a href="/rss.xml" target="_blank" rel="noreferrer">
      <Icon name="rss" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <!-- <a href="https://github.com/kevgug" target="_blank" rel="noreferrer">
      <Icon name="github" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a> -->
  </div>
  <div class="flex flex-col-reverse md:flex-row md:justify-between">
    <p class="text-muted-text-grey font-light">
      Product Designer. AI-Native Engineer.<br />
      Copyright © 2025 Kevin Gugelmann. All rights reserved.
    </p>
  </div>
</div>

<style lang="postcss">
  a {
    @apply text-white/80;
    @apply transition-all;
    @apply ease-outro;
    @apply duration-200;
  }

  a:hover {
    @apply text-white;
    @apply transition-all;
    @apply ease-intro;
    @apply duration-intro;
  }
</style>
