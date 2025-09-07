<script lang="ts">
  import { page } from "$app/stores";
</script>

{#if $page.url.pathname === "/essays"}
  <div
    class="flex flex-col mx-auto w-screen max-w-screen-2xl px-5 md:px-[2.5rem] xl:px-[5rem] pt-16 md:pt-20"
  >
    <slot />
  </div>
{:else}
  <slot />
{/if}
