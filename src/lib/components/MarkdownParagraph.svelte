<script lang="ts">
  import FootnoteTooltip from "$lib/components/FootnoteTooltip.svelte";
  import type { ParagraphToken } from "$lib/blog/parse";
  export let tokens: ParagraphToken[];
  export let footnotes: Record<string, string>;

  function onClickRef(num: string) {
    const el = document.getElementById(`footnote-${num}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 768 ? 80 : 64);
    window.scrollTo({ top: y, behavior: "smooth" });
  }
</script>

<p class="font-serif text-description-text-grey">
  {#each tokens as t}
    {#if t.type === 'text'}
      {@html t.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    {:else}
      <span class="inline-flex items-baseline" on:click={() => onClickRef(t.num)}>
        <FootnoteTooltip num={t.num} text={footnotes[t.num] || ''} />
      </span>
    {/if}
  {/each}
  </p>

