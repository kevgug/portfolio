<script lang="ts">
  import type { PageData } from "./$types";
  import MarkdownParagraph from "$lib/components/MarkdownParagraph.svelte";
  import MarkdownBlockquote from "$lib/components/MarkdownBlockquote.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Separator from "$lib/components/Separator.svelte";
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
  import MarkdownCodeBlock from "$lib/components/MarkdownCodeBlock.svelte";

  export let data: PageData;
  const { post } = data;

  let sectionEls: HTMLElement[] = [];

  /**
   * Sets the active navigation index by finding the last essay section whose top
   * is above the vertical midpoint of the viewport.
   */
  function updateSelection() {
    if ($scrollLock) return;

    const midpoint = window.innerHeight / 2;
    let nextIndex = 0;
    for (let i = 0; i < sectionEls.length; i++) {
      if (sectionEls[i].getBoundingClientRect().top <= midpoint) {
        nextIndex = i;
      } else {
        // Since sections are ordered, we can break early
        break;
      }
    }
    selectedIndex.set(nextIndex);
  }

$: formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  timeZone: "UTC",
  });

  async function onClickFootnoteRef(num: string) {
    const totalOffset = getResponsiveOffset();
    const targetId = `footnote-ref-${num}`;
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      targetEl.classList.add("footnote-bg-anim");
      targetEl.classList.add("footnote-bg-highlight");

      await reliableScrollToElement(targetEl, {
        duration: 1000,
        ease: "out-expo",
        offset: totalOffset,
        centerInViewport: true,
      });

      setTimeout(() => {
        targetEl.classList.remove("footnote-bg-highlight");
      }, 0);
    }
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

    sectionEls = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-essay-section="true"]`)
    );

    let observer: IntersectionObserver;

    function setupObserver() {
      // Disconnect previous observer if it exists
      if (observer) observer.disconnect();

      const verticalMargin = Math.floor(window.innerHeight / 2);
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: `-${verticalMargin - 1}px 0px -${verticalMargin}px 0px`,
        threshold: 0,
      };

      observer = new IntersectionObserver(updateSelection, options);
      sectionEls.forEach((el) => observer.observe(el));
    }

    // Set up the observer initially
    setupObserver();

    // Re-run selection logic and re-setup observer on resize
    function handleResize() {
      updateSelection();
      setupObserver();
    }

    window.addEventListener("resize", handleResize);

    // Initial sync to set the correct section on page load.
    updateSelection();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  });
</script>

<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<article class="py-8 md:py-12 w-full">
  <div>
    <header class="max-w-screen-md mx-auto">
      <h1
        class="text-3xl md:text-4xl font-bold text-glacial-blue leading-[1.175] md:leading-[1.1]"
      >
        {post.title}
      </h1>
      <p class="text-muted-text-grey mt-3.5 md:mt-4">{formattedDate}</p>
    </header>
    <div class="my-9 md:my-12 max-w-screen-md mx-auto">
      <Separator />
    </div>
    <div class="space-y-8">
      {#each post.sections as section, i}
        <section id={`section-${i}`} data-essay-section="true">
          {#if section.heading !== post.title}
            <h2 class="text-xl md:text-2xl font-semibold text-white max-w-screen-md mx-auto">
              {section.heading}
            </h2>
          {/if}
          {#each section.content as contentItem}
            {#if contentItem.type === "blockquote"}
            <div class="w-full max-w-screen-md mx-auto">
              <div class="-mx-[calc(1rem+4px)] md:-mx-[calc(1.5rem+4px)]">
                <MarkdownBlockquote text={contentItem.text} />
              </div>
            </div>
            {:else}
              <div class:mt-3={section.heading !== post.title} class="space-y-4 max-w-screen-md mx-auto">
                  {#if contentItem.type === "paragraph"}
                    <MarkdownParagraph tokens={contentItem.tokens} />
                  {:else if contentItem.type === "code"}
                    <MarkdownCodeBlock
                      lang={contentItem.lang}
                      code={contentItem.code}
                    />
                  {:else if contentItem.type === "list"}
                    <ul
                      class="list-disc pl-5 space-y-2 font-serif text-description-text-grey"
                    >
                      {#each contentItem.items as item}
                        <li>{@html item}</li>
                      {/each}
                    </ul>
                  {/if}
                </div>
            {/if}
          {/each}
        </section>
      {/each}
    </div>

    {#if Object.keys(post.footnotes).length || post.contributionNote}
      <div
        class="mt-[8em] md:mt-[12em] max-w-screen-md mx-auto"
        id="section-notes"
        data-essay-section="true"
      >
        <h2 class="text-xl md:text-2xl font-semibold text-white">Notes</h2>
        {#if Object.keys(post.footnotes).length}
          <div class="mt-4 space-y-2">
            {#each Object.entries(post.footnotes) as [num, text]}
              <div
                id={`footnote-${num}`}
                class="font-serif text-sm md:text-base text-muted-text-grey"
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
          <div
            class="mt-6 font-serif text-sm md:text-base text-muted-text-grey"
          >
            {@html post.contributionNote}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</article>

<style lang="postcss">
  article :global(pre) {
    background-color: rgba(203, 213, 225, 0.05);
    border-radius: 0.65rem;
    font-size: 0.9em;
    padding: 1.25rem;
    overflow-x: auto;
  }

  article :global(code) {
    overflow-x: auto;
  }

  /* Inline code */
  article :global(p > code),
  article :global(li > code) {
    background-color: rgba(203, 213, 225, 0.05);
    @apply text-glacial-blue;
    padding: 0.2rem 0.4rem;
    border-radius: 0.5rem;
    font-size: 0.9em;
  }

  article :global(pre > code) {
    padding: 0 !important;
    background-color: transparent !important;
    color: white;
  }
</style>
