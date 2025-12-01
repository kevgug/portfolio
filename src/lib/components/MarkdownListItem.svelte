<script lang="ts">
  import type { ParagraphToken, ParagraphTokenRef } from "$lib/essays/parse";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  import { renderInlineLatex } from "$lib/util/katex";
  import MarkdownInlineCode from "$lib/components/MarkdownInlineCode.svelte";
  export let tokens: ParagraphToken[];
  export let slug: string;
  let firstRefNum: string | undefined;

  $: firstRefNum = (
    tokens.find((t) => t.type === "ref") as ParagraphTokenRef | undefined
  )?.num;

  async function onClickRef(num: string) {
    const totalOffset = getResponsiveOffset({ spacing: "lg" });
    const targetId = `footnote-${num}`;
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      targetEl.classList.add("footnote-bg-anim");
      targetEl.classList.add("footnote-bg-highlight");

      await reliableScrollToElement(targetEl, {
        duration: 1000,
        ease: "out-expo",
        offset: totalOffset,
      });

      setTimeout(() => {
        targetEl.classList.remove("footnote-bg-highlight");
      }, 0);
    }
  }

  function getRefNum(token: ParagraphToken): string {
    return (token as ParagraphTokenRef).num;
  }
</script>

<li>
  <span
    class="li-content"
    id={firstRefNum ? `footnote-ref-${firstRefNum}` : undefined}
  >
    {#each tokens as t}
      {#if t.type === "text"}
        {@html t.text}
      {:else if t.type === "ref"}
        <button
          class="group inline-flex items-baseline border-none bg-transparent p-0 cursor-pointer"
          on:click={() => onClickRef(getRefNum(t))}
        >
          <span
            class="text-sm text-muted-text-grey group-hover:text-white transition-colors"
          >
            [<span class="text-[0.32rem]">{" "}</span>
            <span
              class="underline decoration-glacial-blue/60 group-hover:decoration-glacial-blue"
              >{getRefNum(t)}</span
            ><span class="text-[0.32rem]">{" "}</span>]
          </span>
        </button>
      {:else if t.type === "latex"}
        {@html renderInlineLatex(t.latex)}
      {:else if t.type === "code"}
        <MarkdownInlineCode code={t.code} audio={t.audio} copyable={t.copyable} slug={slug} />
      {/if}
    {/each}
  </span>
</li>

