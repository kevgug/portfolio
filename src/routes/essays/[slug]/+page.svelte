<script lang="ts">
  import type { PageData } from "./$types";
  import type { ParagraphTokenRef } from "$lib/essays/parse";
  import MarkdownParagraph from "$lib/components/MarkdownParagraph.svelte";
  import MarkdownListItem from "$lib/components/MarkdownListItem.svelte";
  import MarkdownBlockquote from "$lib/components/MarkdownBlockquote.svelte";
  import MarkdownLatexBlock from "$lib/components/MarkdownLatexBlock.svelte";
  import MarkdownImage from "$lib/components/MarkdownImage.svelte";
  import MarkdownTable from "$lib/components/MarkdownTable.svelte";
  import MarkdownInlineCode from "$lib/components/MarkdownInlineCode.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import Separator from "$lib/components/Separator.svelte";
  import { renderInlineLatex } from "$lib/util/katex";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";
  import { onMount } from "svelte";
  import {
    setSubheaders,
    selectedIndex,
    scrollLock,
    type EssaySubheader,
  } from "$lib/stores/essayNav";
  import MarkdownCodeBlock from "$lib/components/MarkdownCodeBlock.svelte";

  export let data: PageData;
  const { slug, post, publish } = data;

  // Social media metadata
  const siteUrl = "https://kevingugelmann.com";
  const pageUrl = `${siteUrl}/essays/${slug}`;
  const pageTitle = post.title;
  const pageDescription = `An essay by Kevin Gugelmann`;
  const thumbnailUrl = `${siteUrl}/assets/thumbnails/${slug}.png`;
  const pageDomain = "kevingugelmann.com";

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

  async function onClickFootnoteRef(num: string) {
    const totalOffset = getResponsiveOffset();
    const targetId = `footnote-ref-${num}`;
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      targetEl.classList.add("footnote-bg-anim");
      targetEl.classList.add("footnote-bg-highlight");

      // Handle LaTeX gradient and footnote background elements
      const latexGradient = targetEl.querySelector(".latex-gradient-left");
      const latexFootnoteBg = targetEl.querySelector(".latex-footnote-bg");
      
      if (latexGradient) {
        (latexGradient as HTMLElement).style.opacity = "0";
      }
      if (latexFootnoteBg) {
        (latexFootnoteBg as HTMLElement).style.opacity = "0";
      }

      await reliableScrollToElement(targetEl, {
        duration: 1000,
        ease: "out-expo",
        offset: totalOffset,
        centerInViewport: true,
      });

      setTimeout(() => {
        targetEl.classList.remove("footnote-bg-highlight");
      }, 0);

      // Restore opacity after animation duration (140ms)
      setTimeout(() => {
        if (latexGradient) {
          (latexGradient as HTMLElement).style.opacity = "1";
        }
        if (latexFootnoteBg) {
          (latexFootnoteBg as HTMLElement).style.opacity = "1";
        }
      }, 140);
    }
  }

  // Helper to get consistent section IDs
  function getSectionId(index: number) {
    const hasForeword = post.sections[0]?.heading === "Foreword";
    if (hasForeword) {
      return `section-${index}`;
    }
    return `section-${index + 1}`;
  }

  // Build subheaders and set in store
  onMount(() => {
    const list: EssaySubheader[] = post.sections.map((section, i) => ({
      id: getSectionId(i),
      label: section.heading,
      icon: section.heading === "Foreword" ? "feather-pen" : undefined,
    }));
    if (Object.keys(post.footnotes).length || post.contributionNote) {
      list.push({ 
        id: "section-notes", 
        label: "Notes", 
        icon: "format-text-notes",
        iconOffsetY: "0.6px"
      });
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
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="canonical" href={pageUrl} />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={pageUrl} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:image" content={thumbnailUrl} />
  <meta property="article:published_time" content={post.date} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={pageDomain} />
  <meta property="twitter:url" content={pageUrl} />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={thumbnailUrl} />
</svelte:head>

<article class="py-8 md:py-12 w-full">
  <div>
    <header class="max-w-screen-md mx-auto">
      <h1
        class="text-3xl md:text-5xl font-bold text-glacial-blue leading-[1.175] md:leading-[1.1]"
      >
        {post.title}
      </h1>
      <div class="flex items-center gap-2 mt-3.5 md:mt-4">
        <p class="text-muted-text-grey">{formattedDate}</p>
        {#if publish === false}
          <Icon name="lock" size="16px" class="shrink-0 text-muted-text-grey" />
        {/if}
      </div>
    </header>
    <div class="my-12 md:my-14 max-w-screen-md mx-auto">
      <Separator />
    </div>
    <div class="space-y-12 md:space-y-14">
      {#each post.sections as section, i}
        <section id={getSectionId(i)} data-essay-section="true">
          {#if section.heading !== post.title && section.heading !== "Foreword"}
            <div class="max-w-screen-md mx-auto flex justify-start items-start">
              <h2 class="text-xl md:text-2xl font-semibold text-white">
                {section.heading}
              </h2>
            </div>
          {/if}
          {#each section.content as contentItem}
            {#if contentItem.type === "blockquote"}
            <div class="w-full max-w-screen-md mx-auto">
              <div class="-mx-[calc(1rem+4px)] md:-mx-[calc(1.5rem+4px)]">
                <MarkdownBlockquote tokens={contentItem.tokens} paragraphs={contentItem.paragraphs} multiline={contentItem.multiline} endsWithBreak={contentItem.endsWithBreak} citation={contentItem.citation} />
              </div>
            </div>
            {:else if contentItem.type === "image"}
              <MarkdownImage
                slug={slug}
                path={contentItem.path}
                alt={contentItem.alt}
                caption={contentItem.caption}
              />
            {:else if contentItem.type === "table"}
              <MarkdownTable
                headers={contentItem.headers}
                rows={contentItem.rows}
              />
            {:else}
              <div class="mt-3 space-y-4 max-w-screen-md mx-auto">
                  {#if contentItem.type === "paragraph"}
                    <MarkdownParagraph tokens={contentItem.tokens} slug={slug} />
                  {:else if contentItem.type === "code"}
                    <MarkdownCodeBlock
                      lang={contentItem.lang}
                      code={contentItem.code}
                    />
                  {:else if contentItem.type === "latex"}
                    <MarkdownLatexBlock
                      latex={contentItem.latex}
                      footnoteRef={contentItem.footnoteRef}
                    />
                  {:else if contentItem.type === "list"}
                    {#if contentItem.ordered}
                      <ol
                        class="ordered-list space-y-4 font-serif text-description-text-grey my-6"
                      >
                        {#each contentItem.items as itemTokens}
                          <MarkdownListItem tokens={itemTokens} slug={slug} />
                        {/each}
                      </ol>
                    {:else}
                      <ul
                        class="list-disc pl-5 space-y-2 font-serif text-description-text-grey my-6"
                      >
                        {#each contentItem.items as itemTokens}
                          <MarkdownListItem tokens={itemTokens} slug={slug} />
                        {/each}
                      </ul>
                    {/if}
                  {/if}
                </div>
            {/if}
          {/each}
        </section>
      {/each}
    </div>

    {#if Object.keys(post.footnotes).length || post.contributionNote}
      <div class="mt-[4em] md:mt-[5em] max-w-screen-md mx-auto" style="min-height: calc(50vh - 9rem);">
        <div
          class="-mx-5 md:-mx-8 bg-white/[0.02] rounded-none md:rounded-3xl p-5 md:p-8 border border-white/5"
          id="section-notes"
          data-essay-section="true"
        >
          <div class="flex justify-start items-start">
            <h2 class="text-xl md:text-2xl font-semibold text-white">Notes</h2>
          </div>
          {#if Object.keys(post.footnotes).length}
            <div class="mt-4 space-y-4">
              {#each Object.entries(post.footnotes) as [num, contentBlocks]}
                <div
                  id={`footnote-${num}`}
                  class="font-serif text-sm md:text-base text-muted-text-grey space-y-3"
                >
                  <div class="flex items-start gap-2">
                    <button
                      class="group inline-flex items-center px-1 rounded border-none bg-transparent cursor-pointer hover:bg-gray-700 transition-colors shrink-0"
                      on:click={() => onClickFootnoteRef(num)}
                    >
                      <span
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
                      </span>
                    </button>
                    <div class="flex-1 space-y-3">
                      {#each contentBlocks as contentItem, idx}
                        {#if contentItem.type === "paragraph"}
                          <p class:mt-0={idx === 0}>
                            {#each contentItem.tokens as t}
                              {#if t.type === "text"}
                                <span>
                                  {@html t.text}
                                </span>
                              {:else if t.type === "ref"}
                                {#if "num" in t}
                                  <button
                                    class="group inline-flex items-baseline border-none bg-transparent cursor-pointer"
                                    style="background-color: transparent; padding: 0;"
                                    on:click={() => onClickRef(t.num)}
                                  >
                                    <span
                                      class="text-sm text-muted-text-grey group-hover:text-white transition-colors"
                                    >
                                      [<span class="text-[0.32rem]">{" "}</span>
                                      <span
                                        class="underline decoration-glacial-blue/60 group-hover:decoration-glacial-blue"
                                        >{t.num}</span
                                      ><span class="text-[0.32rem]">{" "}</span>]
                                    </span>
                                  </button>
                                {/if}
                              {:else if t.type === "latex"}
                                {#if "latex" in t}
                                  {@html renderInlineLatex(t.latex)}
                                {/if}
                              {:else if t.type === "code"}
                                {#if "code" in t}
                                  <MarkdownInlineCode code={t.code} audio={t.audio} slug={slug} />
                                {/if}
                              {/if}
                            {/each}
                          </p>
                        {:else if contentItem.type === "list"}
                          <div class:mt-0={idx === 0}>
                            {#if contentItem.ordered}
                              <ol
                                class="ordered-list space-y-4 font-serif text-muted-text-grey"
                              >
                                {#each contentItem.items as itemTokens}
                                  <MarkdownListItem tokens={itemTokens} slug={slug} />
                                {/each}
                              </ol>
                            {:else}
                              <ul
                                class="list-disc pl-5 space-y-2 font-serif text-muted-text-grey"
                              >
                                {#each contentItem.items as itemTokens}
                                  <MarkdownListItem tokens={itemTokens} slug={slug} />
                                {/each}
                              </ul>
                            {/if}
                          </div>
                        {/if}
                      {/each}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          {#if post.contributionNote}
            <div class="space-y-4" class:mt-6={!Object.keys(post.footnotes).length} class:mt-12={Object.keys(post.footnotes).length} class:md:mt-14={Object.keys(post.footnotes).length}>
              {#each post.contributionNote as contentItem}
                {#if contentItem.type === "blockquote"}
                  <div class="w-full max-w-screen-md mx-auto">
                    <div class="-mx-[calc(1rem+4px)] md:-mx-[calc(1.5rem+4px)]">
                      <MarkdownBlockquote tokens={contentItem.tokens} paragraphs={contentItem.paragraphs} multiline={contentItem.multiline} endsWithBreak={contentItem.endsWithBreak} citation={contentItem.citation} />
                    </div>
                  </div>
                {:else if contentItem.type === "image"}
                  <MarkdownImage
                    slug={slug}
                    path={contentItem.path}
                    alt={contentItem.alt}
                    caption={contentItem.caption}
                  />
                {:else if contentItem.type === "table"}
                  <MarkdownTable
                    headers={contentItem.headers}
                    rows={contentItem.rows}
                  />
                {:else}
                  <div class="space-y-4 max-w-screen-md mx-auto">
                    {#if contentItem.type === "paragraph"}
                      <MarkdownParagraph tokens={contentItem.tokens} slug={slug} />
                    {:else if contentItem.type === "code"}
                      <MarkdownCodeBlock
                        lang={contentItem.lang}
                        code={contentItem.code}
                      />
                    {:else if contentItem.type === "latex"}
                      <MarkdownLatexBlock
                        latex={contentItem.latex}
                        footnoteRef={contentItem.footnoteRef}
                      />
                    {:else if contentItem.type === "list"}
                      {#if contentItem.ordered}
                        <ol
                          class="ordered-list space-y-4 font-serif text-description-text-grey my-6"
                        >
                          {#each contentItem.items as itemTokens}
                            <MarkdownListItem tokens={itemTokens} slug={slug} />
                          {/each}
                        </ol>
                      {:else}
                        <ul
                          class="list-disc pl-5 space-y-2 font-serif text-description-text-grey my-6"
                        >
                          {#each contentItem.items as itemTokens}
                            <MarkdownListItem tokens={itemTokens} slug={slug} />
                          {/each}
                        </ul>
                      {/if}
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
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

  /* Override global li margin for essay content - let space-y handle spacing */
  article :global(ul li),
  article :global(ol li) {
    margin-bottom: 0;
  }

  /* Ordered list styling with custom circular numbers */
  article :global(.ordered-list) {
    counter-reset: list-counter;
  }

  article :global(.ordered-list li) {
    counter-increment: list-counter;
    list-style-type: none;
    padding-left: 2.5rem;
  }

  /* Custom circular number indicator - vertically centered with first line of text */
  article :global(.ordered-list li::before) {
    content: counter(list-counter) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: absolute !important;
    width: 1.75rem !important;
    height: 1.75rem !important;
    border-radius: 9999px !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    left: 0 !important;
    /* Center circle (1.75rem) with first line of text at each breakpoint */
    /* Formula: top = (line-height / 2) - (circle-height / 2) */
    /* Mobile (text-sm 0.9rem, ~1.35rem line-height): (1.35 - 1.75) / 2 = -0.2rem */
    top: -0.2rem !important;
    font-family: "Euclid Square", sans-serif !important;
    color: #F2F2F2 !important;
    opacity: 1 !important;
    line-height: 1 !important;
  }

  /* md+: text-base 1rem, ~1.5rem line-height: (1.5 - 1.75) / 2 = -0.125rem */
  @media (min-width: 768px) {
    article :global(.ordered-list li::before) {
      top: -0.125rem !important;
    }
  }

  /* Link styling in notes section to match blockquote citation links */
  #section-notes :global(a) {
    @apply text-muted-text-grey;
    /* Gray underline by default */
    background-image: linear-gradient(to right, #C1C1C1, #C1C1C1);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    text-decoration: none;
    transition: background-size 0.2s ease, background-image 0.2s ease, color 0.2s ease;
  }

  #section-notes :global(a:hover) {
    color: black;
    background-image: linear-gradient(to right, #ffffff, #ffffff);
    background-size: 100% 100%;
  }

  /* Code block styling in notes section - use white instead of blue */
  #section-notes :global(pre > code) {
    @apply text-white;
  }

  #section-notes :global(p > code),
  #section-notes :global(li > code) {
    @apply text-white;
  }
</style>
