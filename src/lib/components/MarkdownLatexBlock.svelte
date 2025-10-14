<script lang="ts">
  import { renderDisplayLatex } from "$lib/util/katex";

  export let latex: string;
</script>

<div class="latex-display-block">
  {@html renderDisplayLatex(latex)}
</div>

<style lang="postcss">
  .latex-display-block {
    @apply w-full my-4;
    text-align: center;
  }

  .latex-display-block :global(.katex-display) {
    margin: 0;
  }
</style>

