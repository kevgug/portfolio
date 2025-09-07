<script lang="ts">
  import "../app.css"; // TailwindCSS
  import SubscribeModal from "$lib/components/SubscribeModal.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  $: isEssaySlug = /^\/essays\/[^/]+\/?$/.test($page.url.pathname);
</script>

{#if !isEssaySlug}
  <NavBar />
{/if}

{#key $page.url.pathname}
  <div
    in:fade={{ duration: 180 }}
    out:fade={{ duration: 130 }}
    class="contents"
  >
    <slot />
  </div>
{/key}

<SubscribeModal />
