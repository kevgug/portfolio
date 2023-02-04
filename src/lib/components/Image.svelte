<script lang="ts">
  import type { ImageOptions } from "$lib/util/image";

  export let imgOptions: ImageOptions;
</script>

<picture class="flex">
  {#if imgOptions.avifSrc}
    <source srcset={imgOptions.avifSrc} type="image/avif" />
  {/if}
  {#if imgOptions.webpSrc}
    <source srcset={imgOptions.webpSrc} type="image/webp" />
  {/if}
  <img
    src={imgOptions.src}
    alt={imgOptions.alt}
    loading={imgOptions.loading ?? "lazy"}
    class={$$props.class}
  />
</picture>
