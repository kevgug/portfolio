<script lang="ts">
  import type { ParagraphToken, ParagraphTokenRef } from "$lib/essays/parse";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  export let tokens: ParagraphToken[];
  let firstRefNum: string | undefined;

  $: firstRefNum = (
    tokens.find((t) => t.type === "ref") as ParagraphTokenRef | undefined
  )?.num;

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

<p
  class="font-serif text-description-text-grey"
  id={firstRefNum ? `footnote-ref-${firstRefNum}` : undefined}
>
  {#each tokens as t}
    {#if t.type === "text"}
      {@html t.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}
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
    {/if}
  {/each}
</p>
