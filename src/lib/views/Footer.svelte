<script lang="ts">
  // Components
  import Icon from "$lib/components/Icon.svelte";

  // Optional essay slug for essay pages - changes LLM link to point to essay markdown
  export let essaySlug: string | undefined = undefined;

  let showToast = false;
  let toastTimeout: ReturnType<typeof setTimeout>;

  function copyRssLink() {
    const rssUrl = `${window.location.origin}/rss.xml`;
    navigator.clipboard.writeText(rssUrl).then(() => {
      // Clear any existing timeout
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      // Show the toast
      showToast = true;

      // Hide the toast after 2 seconds
      toastTimeout = setTimeout(() => {
        showToast = false;
      }, 2000);
    });
  }
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
          pb-[1.25rem] md:pb-0
          mt-2 md:mt-0"
  >
    <a href="https://cal.com/kevgug/intro" target="_blank" rel="noreferrer">
      <Icon name="webcam" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <a href="mailto:kevin@kevingugelmann.com">
      <Icon name="email" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <a
      href="https://x.com/kevingugelmann"
      target="_blank"
      rel="noreferrer"
    >
      <Icon name="x" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <a
      href="https://www.linkedin.com/in/kevingugelmann"
      target="_blank"
      rel="noreferrer"
    >
      <Icon name="linkedin" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a>
    <button
      on:click={copyRssLink}
      type="button"
      class="text-white/80 transition-all ease-outro duration-200 border-none p-0 cursor-pointer bg-transparent hover:text-white hover:ease-intro hover:duration-intro"
    >
      <Icon name="rss" class="h-4 w-4 lg:h-5 lg:w-5" />
    </button>
    <!-- <a href="https://github.com/kevgug" target="_blank" rel="noreferrer">
      <Icon name="github" class="h-4 w-4 lg:h-5 lg:w-5" />
    </a> -->
  </div>
  <div class="flex flex-col-reverse md:flex-row md:justify-between">
    <p class="text-muted-text-grey font-light">
      {#if essaySlug}
        LLM? Read <a href="/essays/{essaySlug}.txt" target="_blank" rel="noreferrer">markdown</a>. <br />
      {:else}
        LLM? Read <a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt</a>. <br />
      {/if}
      Copyright © 2025 Kevin Gugelmann. All rights reserved.
    </p>
  </div>
</div>

{#if showToast}
  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#3D3D3D]/80 backdrop-blur-md text-white py-3 px-6 rounded-xl text-sm font-medium z-50 shadow-lg toast-animate"
  >
    RSS link copied
  </div>
{/if}

<style lang="postcss">
  /* Icon links - keep current hover behavior */
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

  /* Text links in footer - gray underline with fill effect on hover (like footnotes) */
  p a {
    @apply text-muted-text-grey;
    /* Gray underline by default */
    background-image: linear-gradient(to right, #C1C1C1, #C1C1C1);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    text-decoration: none;
    transition: background-size 0.2s ease, background-image 0.2s ease, color 0.2s ease;
  }

  p a:hover {
    color: black;
    background-image: linear-gradient(to right, #ffffff, #ffffff);
    background-size: 100% 100%;
  }

  .toast-animate {
    animation: toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards,
      toast-out 0.3s cubic-bezier(0.9, 0, 0.51, 1) 1.7s forwards;
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  @keyframes toast-out {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.95);
    }
  }
</style>
