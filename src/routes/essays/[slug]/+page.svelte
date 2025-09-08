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

  // Build subheaders and set in store
  onMount(() => {
    if (!post) return;
    const list = post.sections.map((section, i) => ({
      id: `section-${i}`,
      label: section.heading,
    }));
    if (Object.keys(post.footnotes).length) {
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

    let lastScrollTop = window.scrollY;

    const observer = new IntersectionObserver(() => {
      if ($scrollLock) return; // ignore while locked by programmatic scroll
      const scrollingDown = window.scrollY >= lastScrollTop;
      lastScrollTop = window.scrollY;

      // Compute with full list for consistency in both directions
      const tops = sectionEls.map((el) => el.getBoundingClientRect().top);
      // first index whose top is in viewport (>= 0)
      let firstInView = tops.findIndex(
        (top) => top >= 0 && top <= window.innerHeight
      );
      if (firstInView === -1) firstInView = sectionEls.length - 1;

      const nextIndex = scrollingDown
        ? firstInView
        : Math.max(0, firstInView - 1);
      selectedIndex.update((curr: number) =>
        curr === nextIndex ? curr : nextIndex
      );
    }, options);

    sectionEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
</script>

{#if !post}
  <p class="text-muted-text-grey">Post not found.</p>
{:else}
  <article class="py-8 md:py-12">
    <div>
      <header>
        <h1 class="text-3xl md:text-4xl font-bold text-white leading-tight">
          {post.title}
        </h1>
        <p class="text-muted-text-grey mt-1">{formattedDate}</p>
        <div class="mt-4 md:mt-5">
          <Separator />
        </div>
      </header>

      <div class="mt-6 md:mt-8 space-y-8">
        {#each post.sections as section, i}
          <section id={`section-${i}`} data-essay-section="true">
            <h2 class="text-xl md:text-2xl font-semibold text-white">
              {section.heading}
            </h2>
            <div class="mt-3 space-y-4">
              {#each section.paragraphs as para}
                <MarkdownParagraph
                  tokens={tokenizeParagraphForFootnotes(para)}
                />
              {/each}
            </div>
          </section>
        {/each}
      </div>

      {#if Object.keys(post.footnotes).length}
        <div class="mt-6 md:mt-8" id="section-notes" data-essay-section="true">
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
    </div>
  </article>
{/if}
