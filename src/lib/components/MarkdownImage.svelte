<script lang="ts">
  import { marked } from "$lib/util/marked";

  export let slug: string;
  export let path: string;
  export let alt: string;
  export let caption: string | undefined = undefined;

  // Ensure path starts with / for proper static asset resolution
  $: imageSrc = path.startsWith('/') ? path : `/assets/essays/${slug}/images/${path}`;
  
  // Parse caption as inline markdown
  $: parsedCaption = caption ? (marked.parseInline(caption) as string) : undefined;
</script>

<figure class="w-full max-w-screen-md mx-auto my-8">
  <img
    src={imageSrc}
    alt={alt}
    loading="lazy"
    class="w-full h-auto rounded-lg border border-separator-grey/50"
  />
  {#if parsedCaption}
    <figcaption class="mt-3 text-center">
      <p class="text-sm text-muted-text-grey font-serif">
        {@html parsedCaption}
      </p>
    </figcaption>
  {/if}
</figure>

<style lang="postcss">
  figcaption :global(a) {
    @apply text-muted-text-grey text-sm;
    background-image: linear-gradient(to right, #C1C1C1, #C1C1C1);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    text-decoration: none;
    transition: background-size 0.2s ease, background-image 0.2s ease, color 0.2s ease;
  }

  figcaption :global(a:hover) {
    color: black;
    background-image: linear-gradient(to right, #ffffff, #ffffff);
    background-size: 100% 100%;
  }
</style>
