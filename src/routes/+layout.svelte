<script lang="ts">
  import "../app.css"; // TailwindCSS
  import SubscribeModal from "$lib/components/SubscribeModal.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import CustomCursor from "$lib/components/CustomCursor.svelte";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { layoutReady } from "$lib/stores/layoutReady";
  
  $: isEssaySlug = /^\/essays\/[^/]+\/?$/.test($page.url.pathname);
  $: isEssaysRoot = $page.url.pathname === "/essays";
  $: isEssaysRoute = isEssaysRoot || isEssaySlug;
  $: isErrorPage = $page.status >= 400;
  
  // Only apply layout ready check on home page
  $: isHomePage = $page.url.pathname === "/";
  $: shouldHideUntilReady = isHomePage && !$layoutReady;
</script>

<!-- Wrapper to prevent layout shift on home page -->
<div class={shouldHideUntilReady ? "opacity-0" : "opacity-100"}>
  <div
    class={isEssaySlug || isErrorPage
      ? "invisible pointer-events-none"
      : "contents"}
    aria-hidden={isEssaySlug || isErrorPage}
  >
    <NavBar />
  </div>

  {#if isEssaysRoute}
    {#key $page.url.pathname}
      <div class="contents">
        <slot />
      </div>
    {/key}
  {:else}
    {#key $page.url.pathname}
      <div
        in:fade={{ duration: 180 }}
        out:fade={{ duration: 130 }}
        class="contents"
      >
        <slot />
      </div>
    {/key}
  {/if}
</div>

<CustomCursor />
<SubscribeModal />
