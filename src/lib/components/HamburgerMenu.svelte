<script lang="ts">
  export let open = false;
</script>

<button
  on:click={() => (open = !open)}
  class="relative w-8 h-8 z-50 flex flex-col justify-center items-center group focus-visible:outline focus-visible:outline-2 focus-visible:outline-glacial-blue focus-visible:outline-offset-4"
  aria-label={open ? "Close menu" : "Open menu"}
  aria-expanded={open}
>
  <!-- Top line -->
  <div
    class="w-6 h-px bg-off-white group-hover:bg-glacial-blue rounded-full transition-all duration-300 ease-in-out absolute"
    class:rotate-45={open}
    class:-translate-y-1.5={!open}
  />

  <!-- Middle line -->
  <div
    class="w-6 h-px bg-off-white group-hover:bg-glacial-blue rounded-full transition-all duration-300 ease-in-out absolute"
    class:opacity-0={open}
    class:scale-0={open}
  />

  <!-- Bottom line -->
  <div
    class="w-6 h-px bg-off-white group-hover:bg-glacial-blue rounded-full transition-all duration-300 ease-in-out absolute"
    class:-rotate-45={open}
    class:translate-y-1.5={!open}
  />
</button>
