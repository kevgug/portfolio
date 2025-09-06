<script lang="ts">
  import type { PageData } from "./$types";
  import MarkdownParagraph from "$lib/components/MarkdownParagraph.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import { tokenizeParagraphForFootnotes } from "$lib/essays/parse";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";

  export let data: PageData;
  const { post } = data;

  $: formattedDate = post
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  async function onClickFootnoteRef(num: string) {
    const totalOffset = getResponsiveOffset({ spacing: "md" });
    await reliableScrollToElement(`#footnote-ref-${num}`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
    });
  }
</script>

{#if !post}
  <p class="text-muted-text-grey">Post not found.</p>
{:else}
  <article class="py-8 md:py-12">
    <header>
      <h1 class="text-3xl md:text-4xl font-bold text-white leading-tight">
        {post.title}
      </h1>
      <p class="text-muted-text-grey mt-1">{formattedDate}</p>
    </header>

    <div class="mt-6 md:mt-8 space-y-8">
      {#each post.sections as section}
        <section>
          <h2 class="text-xl md:text-2xl font-semibold text-white">
            {section.heading}
          </h2>
          <div class="mt-3 space-y-4">
            {#each section.paragraphs as para}
              <MarkdownParagraph tokens={tokenizeParagraphForFootnotes(para)} />
            {/each}
          </div>
        </section>
      {/each}
    </div>

    {#if Object.keys(post.footnotes).length}
      <div class="mt-6 md:mt-8">
        <h2 class="text-xl md:text-2xl font-semibold text-white">Notes</h2>
        <div class="mt-4 space-y-2">
          {#each Object.entries(post.footnotes) as [num, text]}
            <div
              id={`footnote-${num}`}
              class="text-sm md:text-base text-muted-text-grey"
            >
              <button
                class="group inline-flex items-center px-1 py-0.5 rounded border-none bg-transparent cursor-pointer hover:bg-gray-700 transition-colors"
                on:click={() => onClickFootnoteRef(num)}
              >
                <p
                  class="text-sm text-muted-text-grey group-hover:text-white transition-colors"
                >
                  [<span class="text-[0.9rem]">{" "}</span>
                  <span class="text-white underline decoration-glacial-blue"
                    >{num}</span
                  ><span class="text-[0.32rem]">{" "}</span>
                  <Icon
                    name="arrow-up"
                    size="12px"
                    class="inline text-muted-text-grey group-hover:text-white transition-colors"
                  />
                  <span class="text-[0.32rem]">{" "}</span>]
                </p>
              </button>
              {text}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </article>
{/if}
