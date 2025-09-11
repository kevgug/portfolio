<script lang="ts">
  import type { PageData } from "./$types";
  import MarkdownParagraph from "$lib/components/MarkdownParagraph.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import { tokenizeParagraphForFootnotes } from "$lib/essays/parse";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  import { onMount } from "svelte";
  import {
    setSubheaders,
    selectedIndex,
    scrollLock,
  } from "$lib/stores/essayNav";

  export let data: PageData;
  const { post } = data;

  $: formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function onClickFootnoteRef(num: string) {
    const totalOffset = getResponsiveOffset({ spacing: "default" });
    await reliableScrollToElement(`#footnote-ref-${num}`, {
      duration: 1000,
      ease: "out-expo",
      offset: totalOffset,
      centerInViewport: true,
    });
  }

  // Build subheaders and set in store
  onMount(() => {
    const list = post.sections.map((section, i) => ({
      id: `section-${i}`,
      label: section.heading,
    }));
    if (Object.keys(post.footnotes).length || post.contributionNote) {
      list.push({ id: "section-notes", label: "Notes" });
    }
    setSubheaders(list);

    // Intersection-based selection syncing
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 1.0],
    };

    const sectionEls = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-essay-section="true"]`)
    );

    const observer = new IntersectionObserver(() => {
      if ($scrollLock) return; // ignore while locked by programmatic scroll

      const midpoint = window.innerHeight / 2;
      const rects = sectionEls.map((el) => el.getBoundingClientRect());

      // Prefer the section intersecting the viewport midpoint
      let nextIndex = rects.findIndex(
        (rect) => rect.top <= midpoint && rect.bottom >= midpoint
      );

      if (nextIndex === -1) {
        // If the midpoint is between sections, choose the last section above it
        let fallbackIndex = 0;
        for (let i = 0; i < rects.length; i++) {
          if (rects[i].top <= midpoint) fallbackIndex = i;
          else break;
        }
        nextIndex = fallbackIndex;
      }

      selectedIndex.update((curr: number) =>
        curr === nextIndex ? curr : nextIndex
      );
    }, options);

    sectionEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<article class="py-8 md:py-12 w-full max-w-screen-sm">
  <div>
    <header>
      <h1
        class="text-3xl md:text-4xl font-bold text-glacial-blue leading-[1.175] md:leading-[1.1]"
      >
        {post.title}
      </h1>
      <p class="text-muted-text-grey mt-3.5 md:mt-4">{formattedDate}</p>
    </header>
    <div class="my-9 md:my-12">
      <Separator />
    </div>
    <div class="space-y-8">
      {#each post.sections as section, i}
        <section id={`section-${i}`} data-essay-section="true">
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

    {#if Object.keys(post.footnotes).length || post.contributionNote}
      <div
        class="mt-[8em] md:mt-[12em]"
        id="section-notes"
        data-essay-section="true"
      >
        <h2 class="text-xl md:text-2xl font-semibold text-white">Notes</h2>
        {#if Object.keys(post.footnotes).length}
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
                {@html text}
              </div>
            {/each}
          </div>
        {/if}

        {#if post.contributionNote}
          <div class="mt-6 text-sm md:text-base text-muted-text-grey">
            {@html post.contributionNote}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</article>
