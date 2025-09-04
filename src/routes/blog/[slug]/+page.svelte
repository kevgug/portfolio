<script lang="ts">
  import type { PageData } from "./$types";
  import MarkdownParagraph from "$lib/components/MarkdownParagraph.svelte";
  import { tokenizeParagraphForFootnotes } from "$lib/blog/parse";

  export let data: PageData;
  const { post } = data;
</script>

{#if !post}
  <p class="text-muted-text-grey">Post not found.</p>
{:else}
  <article class="pt-3">
    <header>
      <h1 class="text-3xl md:text-4xl font-bold text-white leading-tight">
        {post.title}
      </h1>
      <p class="text-muted-text-grey mt-2">{post.date}</p>
    </header>

    <div class="mt-8 space-y-8">
      {#each post.sections as section}
        <section>
          <h2 class="text-xl md:text-2xl font-semibold text-white">
            {section.heading}
          </h2>
          <div class="mt-3 space-y-4">
            {#each section.paragraphs as para}
              <MarkdownParagraph
                tokens={tokenizeParagraphForFootnotes(para)}
                footnotes={post.footnotes}
              />
            {/each}
          </div>
        </section>
      {/each}
    </div>

    {#if Object.keys(post.footnotes).length}
      <div class="mt-12 md:mt-14">
        <h2 class="text-xl md:text-2xl font-semibold text-white">Notes</h2>
        <div class="mt-4 space-y-2">
          {#each Object.entries(post.footnotes) as [num, text]}
            <div id={`footnote-${num}`} class="text-sm md:text-base text-muted-text-grey">
              <span class="text-white">[{num}]</span> {text}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </article>
{/if}

