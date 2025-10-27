<script lang="ts">
  import { renderDisplayLatex } from "$lib/util/katex";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";

  export let latex: string;
  export let footnoteRef: string | undefined = undefined;

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
</script>

<div
  class="latex-display-container"
  id={footnoteRef ? `footnote-ref-${footnoteRef}` : undefined}
>
  <div class="latex-scroll-wrapper" class:has-footnote={footnoteRef}>
    <div class="latex-display-block">
      {@html renderDisplayLatex(latex)}
    </div>
  </div>
  <div class="latex-gradient-left"></div>
  {#if footnoteRef}
    <div class="latex-footnote-bg">
      <button
        class="latex-footnote-ref group inline-flex items-baseline border-none bg-transparent p-0 cursor-pointer"
        on:click={() => onClickRef(footnoteRef)}
      >
        <span
          class="text-sm text-muted-text-grey group-hover:text-white transition-colors"
        >
          [<span class="text-[0.32rem]">{" "}</span>
          <span
            class="underline decoration-glacial-blue/60 group-hover:decoration-glacial-blue"
            >{footnoteRef}</span
          ><span class="text-[0.32rem]">{" "}</span>]
        </span>
      </button>
    </div>
  {/if}
</div>

<style lang="postcss">
  .latex-display-container {
    @apply w-full my-4 relative;
  }

  .latex-scroll-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    text-align: center;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .latex-scroll-wrapper::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .latex-scroll-wrapper.has-footnote {
    padding-left: 4rem;
    padding-right: 4rem;
  }

  .latex-display-block {
    display: inline-block;
    text-align: left;
  }

  .latex-display-block :global(.katex-display) {
    margin: 0;
    text-align: left;
  }

  .latex-gradient-left {
    @apply absolute left-0;
    top: 0;
    bottom: 0;
    width: 3rem;
    background: linear-gradient(to right, #141518, transparent 75%);
    pointer-events: none;
  }

  .latex-footnote-bg {
    @apply absolute right-0;
    top: 0;
    bottom: 0;
    width: 4rem;
    background: linear-gradient(to right, transparent, #141518 25%);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .latex-footnote-ref {
    pointer-events: auto;
  }
</style>

