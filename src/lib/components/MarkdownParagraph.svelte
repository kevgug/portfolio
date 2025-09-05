<script lang="ts">
  import type { ParagraphToken, ParagraphTokenRef } from "$lib/essays/parse";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  export let tokens: ParagraphToken[];

  async function onClickRef(num: string) {
    const totalOffset = getResponsiveOffset({ spacing: "sm" });
    await reliableScrollToElement(`#footnote-${num}`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
    });
  }

  function getRefNum(token: ParagraphToken): string {
    return (token as ParagraphTokenRef).num;
  }
</script>

<p class="font-serif text-description-text-grey">
  {#each tokens as t}
    {#if t.type === "text"}
      {@html t.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}
    {:else if t.type === "ref"}
      <button
        id={`footnote-ref-${getRefNum(t)}`}
        class="inline-flex items-baseline border-none bg-transparent p-0 cursor-pointer"
        on:click={() => onClickRef(getRefNum(t))}
      >
        <p
          class="group text-sm text-muted-text-grey hover:text-white transition-colors"
        >
          [<span class="text-[0.32rem]">{" "}</span>
          <span
            class="underline decoration-glacial-blue/60 group-hover:decoration-glacial-blue"
            >{getRefNum(t)}</span
          ><span class="text-[0.32rem]">{" "}</span>]
        </p>
      </button>
    {/if}
  {/each}
</p>
