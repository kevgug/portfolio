<script lang="ts">
  export let num: string;
  export let text: string;
  let hovering = false;
</script>

<span class="relative inline-flex align-baseline">
  <span
    class="text-glacial-blue cursor-pointer select-none"
    on:mouseenter={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}
  >
    [{num}]
  </span>
  <span
    class="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-2 pointer-events-none"
  >
    <span
      class="block px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs md:text-sm shadow-xl backdrop-blur-md transition-all duration-200"
      style="opacity: {hovering ? 1 : 0}; transform: scale({hovering ? 1 : 0.97});"
    >
      {text}
    </span>
  </span>
</span>

