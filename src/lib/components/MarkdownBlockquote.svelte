<script lang="ts">
  export let text: string;
</script>

<blockquote
  class="!my-5 md:!my-8 py-3 px-4 md:px-6 md:py-4 border-l-4 border-glacial-blue bg-glacial-blue/5 md:rounded-r-lg"
>
  <p class="font-serif text-3xl md:text-4xl font-semibold text-white leading-snug">
    {@html text}
  </p>
</blockquote>

<style lang="postcss">
  blockquote :global(em) {
    @apply italic;
  }

  blockquote :global(strong) {
    @apply font-bold;
  }

  blockquote :global(a) {
    @apply text-glacial-blue hover:text-white transition-colors underline;
  }
</style>
