<script lang="ts">
  export let src: string;
  export let alt: string;
  export let loading: "eager" | "lazy" = "lazy";

  // Helpers
  const replaceImgExt = (newExt: string) => {
    let prefix = src.split(".")[0];
    return `${prefix}.${newExt}`;
  };
</script>

<picture>
  <!-- <source srcset={replaceImgExt("avif")} type="image/avif" />
  <source srcset={replaceImgExt("webp")} type="image/webp" /> -->
  <img {src} {alt} {loading} class={$$props.class} />
</picture>
