<script lang="ts">
  import { page } from "$app/stores";
  import Footer from "$lib/views/Footer.svelte";
</script>

{#if $page.url.pathname === "/essays"}
  <div
    class="flex flex-col mx-auto w-screen max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] pt-16 md:pt-20"
  >
    <div class="min-h-screen">
      <slot />
    </div>
    <Footer />
  </div>
{:else}
  <slot />
{/if}
