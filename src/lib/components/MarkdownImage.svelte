<script lang="ts">
  import { marked } from "$lib/util/marked";
  import { onMount } from "svelte";

  export let slug: string;
  export let path: string;
  export let alt: string;
  export let caption: string | undefined = undefined;

  // Ensure path starts with / for proper static asset resolution
  $: imageSrc = path.startsWith('/') ? path : `/assets/essays/${slug}/images/${path}`;
  
  // Check if the image is an SVG
  $: isSvg = path.toLowerCase().endsWith('.svg');
  
  // SVG content for inline rendering
  let svgContent: string | null = null;
  let svgError = false;
  
  // Track if image is height-constrained
  let isHeightConstrained = false;
  let imgElement: HTMLImageElement;
  
  function checkHeightConstraint() {
    if (!imgElement) return;
    
    const naturalAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const renderedAspect = imgElement.clientWidth / imgElement.clientHeight;
    
    // If rendered aspect ratio is wider than natural, image is height-constrained
    isHeightConstrained = renderedAspect > naturalAspect * 1.01;
  }
  
  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      checkHeightConstraint();
    });
    
    if (imgElement) {
      resizeObserver.observe(imgElement);
    }
    
    return () => resizeObserver.disconnect();
  });
  
  // Fetch SVG content when path changes
  $: if (isSvg && imageSrc) {
    fetchSvgContent(imageSrc);
  }
  
  async function fetchSvgContent(src: string) {
    try {
      svgError = false;
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status}`);
      }
      const text = await response.text();
      // Basic validation that it's actually SVG content
      if (text.includes('<svg')) {
        svgContent = text;
      } else {
        throw new Error('Invalid SVG content');
      }
    } catch (e) {
      console.error('Error loading SVG:', e);
      svgError = true;
      svgContent = null;
    }
  }
  
  // Parse caption as inline markdown
  $: parsedCaption = caption ? (marked.parseInline(caption) as string) : undefined;
</script>

<figure class="w-full max-w-screen-md mx-auto my-8">
  {#if isSvg && svgContent}
    <div class="svg-container rounded-lg border border-separator-grey/50 overflow-hidden max-h-[calc(80vh+2rem)] p-4" role="img" aria-label={alt}>
      {@html svgContent}
    </div>
  {:else}
    <div 
      class="image-wrapper rounded-lg border border-separator-grey/50 overflow-hidden"
      class:height-constrained={isHeightConstrained}
    >
      <img
        bind:this={imgElement}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        on:load={checkHeightConstraint}
        class="w-full h-auto max-h-[80vh] object-contain"
        class:mx-auto={isHeightConstrained}
      />
    </div>
  {/if}
  {#if parsedCaption}
    <figcaption class="mt-3 text-center">
      <p class="text-sm text-muted-text-grey font-serif">
        {@html parsedCaption}
      </p>
    </figcaption>
  {/if}
</figure>

<style lang="postcss">
  .svg-container {
    @apply w-full h-auto;
    background-color: #111214;
  }
  
  .svg-container :global(svg) {
    @apply w-full h-auto max-h-[80vh] block;
  }
  
  .image-wrapper {
    @apply w-full;
  }
  
  .image-wrapper.height-constrained {
    @apply max-h-[80vh];
    background-color: #111214;
  }
  
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
