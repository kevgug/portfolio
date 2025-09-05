<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let isBlogPostPage = false;
  let isBlogPage = false;

  onMount(() => {
    // Check if current URL has a slug pattern (essays/[slug])
    const unsubscribe = page.subscribe(($page) => {
      const isBlogPost =
        $page.url.pathname.match(/^\/essays\/[^\/]+\/?$/) !== null;
      const isMainBlog = $page.url.pathname === "/essays";

      isBlogPostPage = isBlogPost;
      isBlogPage = isMainBlog;
    });

    return unsubscribe;
  });
</script>

<NavBar {isBlogPage} {isBlogPostPage} />

<div
  class="flex flex-col mx-auto w-screen max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] pt-16 md:pt-20"
>
  <slot />
</div>
