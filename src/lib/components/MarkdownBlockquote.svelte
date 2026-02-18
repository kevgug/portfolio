<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import type { ParagraphToken } from "$lib/essays/parse";
  import {
    reliableScrollToElement,
    getResponsiveOffset,
  } from "$lib/util/reliableScroll";

  export let tokens: ParagraphToken[];
  export let paragraphs: ParagraphToken[][] | undefined = undefined;
  export let multiline: boolean = false;
  export let endsWithBreak: boolean = false;
  export let citation: string | undefined = undefined;
  export let nextIsBlockquote: boolean = false;

  let blockquoteEl: HTMLElement;
  let paragraphEl: HTMLElement;
  let paragraphsContainerEl: HTMLElement;
  let citationEl: HTMLElement;
  let hasAnimated = false;
  
  let allRefNums: string[] = [];
  $: {
    const nums: string[] = [];
    if (paragraphs) {
      for (const para of paragraphs) {
        for (const t of para) {
          if (t.type === "ref" && "num" in t) {
            nums.push((t as { type: "ref"; num: string }).num);
          }
        }
      }
    } else {
      for (const t of tokens) {
        if (t.type === "ref" && "num" in t) {
          nums.push((t as { type: "ref"; num: string }).num);
        }
      }
    }
    allRefNums = nums;
  }

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

  /**
   * Splits HTML text into words while preserving HTML tags
   */
  function wrapWordsInSpans(htmlText: string): string {
    // Create a temporary element to parse HTML
    const temp = document.createElement("div");
    temp.innerHTML = htmlText;

    function processNode(node: Node, insideButton: boolean = false): string {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        // If inside a button, don't split into words
        if (insideButton) {
          return text;
        }
        // Split text into words and wrap each in a span
        const words = text.split(/(\s+)/); // Split on whitespace but keep whitespace
        return words
          .map((word) => {
            if (word.trim()) {
              return `<span class="word-anim">${word}</span>`;
            }
            return word; // Keep whitespace as is
          })
          .join("");
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();
        const attributes = Array.from(el.attributes)
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(" ");
        const attributeStr = attributes ? ` ${attributes}` : "";
        
        // Check if this is a sup element containing a button (footnote)
        const isFootnoteSup = tagName === "sup" && el.querySelector("button.footnote-ref");
        
        if (isFootnoteSup) {
          // Wrap the entire sup element in a word-anim span
          const childrenHtml = Array.from(el.childNodes)
            .map((child) => processNode(child, true))
            .join("");
          return `<span class="word-anim"><${tagName}${attributeStr}>${childrenHtml}</${tagName}></span>`;
        }
        
        // Check if we're entering a button
        const isButton = tagName === "button";
        const childrenHtml = Array.from(el.childNodes)
          .map((child) => processNode(child, insideButton || isButton))
          .join("");
        return `<${tagName}${attributeStr}>${childrenHtml}</${tagName}>`;
      }
      return "";
    }

    return Array.from(temp.childNodes)
      .map((node) => processNode(node))
      .join("");
  }

  /**
   * Convert tokens to HTML string for processing
   */
  function tokensToHtml(tokens: ParagraphToken[]): string {
    return tokens
      .map((token) => {
        if (token.type === "text") {
          return token.text;
        } else if (token.type === "ref") {
          // Match the main body footnote styling exactly
          return `<sup><button class="footnote-ref group" data-ref="${token.num}">
            <span class="footnote-ref-inner">
              [<span class="footnote-space">\u00A0</span><span class="footnote-num">${token.num}</span><span class="footnote-space">\u00A0</span>]
            </span>
          </button></sup>`;
        } else if (token.type === "latex") {
          // Note: LaTeX in blockquotes would need KaTeX rendering
          return `<span class="latex-inline">$$${token.latex}$$</span>`;
        } else if (token.type === "code") {
          return `<code>${token.code}</code>`;
        }
        return "";
      })
      .join("");
  }

  onMount(() => {
    let animationTargets: NodeListOf<Element>;

    if (multiline && paragraphs && paragraphsContainerEl) {
      // For multiline: render each paragraph as a separate span
      paragraphs.forEach((paraTokens) => {
        const span = document.createElement("span");
        span.className = "paragraph-anim block";
        const htmlText = tokensToHtml(paraTokens);
        span.innerHTML = htmlText;
        paragraphsContainerEl.appendChild(span);
      });

      // Add event listeners to footnote reference buttons
      const footnoteRefs = paragraphsContainerEl.querySelectorAll(".footnote-ref");
      footnoteRefs.forEach((ref) => {
        const num = ref.getAttribute("data-ref");
        if (num) {
          ref.addEventListener("click", () => {
            onClickRef(num);
          });
        }
      });

      // Get all paragraph spans for animation
      animationTargets = paragraphsContainerEl.querySelectorAll(".paragraph-anim");
    } else {
      // For single line: wrap each word in spans
      const htmlText = tokensToHtml(tokens);
      const wrappedHtml = wrapWordsInSpans(htmlText);
      paragraphEl.innerHTML = wrappedHtml;

      // Add event listeners to footnote reference buttons
      const footnoteRefs = paragraphEl.querySelectorAll(".footnote-ref");
      footnoteRefs.forEach((ref) => {
        const num = ref.getAttribute("data-ref");
        if (num) {
          ref.addEventListener("click", () => {
            onClickRef(num);
          });
        }
      });

      // Get all word spans
      animationTargets = paragraphEl.querySelectorAll(".word-anim");
    }

    // Set initial state for animation
    gsap.set(animationTargets, {
      opacity: 0,
      y: 10,
    });

    // Set initial state for citation if it exists
    if (citationEl) {
      gsap.set(citationEl, {
        opacity: 0,
      });
    }

    // Check if blockquote is already in view or above viewport on mount
    const rect = blockquoteEl.getBoundingClientRect();
    // If top is above viewport bottom, it's either visible or already scrolled past
    const shouldShowImmediately = rect.bottom < 0;

    if (shouldShowImmediately) {
      // Already visible or above viewport, show immediately without animation
      gsap.set(animationTargets, {
        opacity: 1,
        y: 0,
      });
      // Also show citation immediately if it exists
      if (citationEl) {
        gsap.set(citationEl, {
          opacity: 1,
          y: 0,
        });
      }
      hasAnimated = true;
    } else {
      // Set up intersection observer to trigger animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;

              // Animate with stagger
              gsap.to(animationTargets, {
                opacity: 1,
                y: 0,
                duration: multiline ? 0.8 : 0.35,
                stagger: multiline ? 0.15 : 0.09, // Stagger paragraphs or words
                ease: "power2.out",
                delay: multiline ? 0.1 : 0.1,
                onComplete: () => {
                  // Animate citation after quote animation completes
                  if (citationEl) {
                    gsap.to(citationEl, {
                      opacity: 1,
                      y: 0,
                      duration: 0.65,
                      ease: "power2.out",
                      delay: 0.1,
                    });
                  }
                },
              });

              // Unobserve after animation
              observer.unobserve(blockquoteEl);
            }
          });
        },
        {
          // Trigger when bottom of blockquote enters viewport
          threshold: 0,
          rootMargin: "0px 0px 0px 0px",
        }
      );

      observer.observe(blockquoteEl);

      return () => {
        observer.disconnect();
      };
    }
  });
</script>

<blockquote
  bind:this={blockquoteEl}
  id={allRefNums.length > 0 ? `footnote-ref-${allRefNums[0]}` : undefined}
  class="px-4 md:px-6 border-l-4 md:rounded-r-lg bg-white/5 border-white"
  class:!my-7={!multiline}
  class:md:!my-9={!multiline}
  class:!my-2.5={multiline && !endsWithBreak}
  class:md:!my-3={multiline && !endsWithBreak}
  class:!mb-6={multiline && endsWithBreak && !nextIsBlockquote}
  class:md:!mb-7={multiline && endsWithBreak && !nextIsBlockquote}
  class:!mb-2.5={multiline && endsWithBreak && nextIsBlockquote}
  class:md:!mb-3={multiline && endsWithBreak && nextIsBlockquote}
  class:!mt-2.5={multiline && endsWithBreak}
  class:md:!mt-3={multiline && endsWithBreak}
  class:py-3.5={!multiline}
  class:md:py-4={!multiline}
  class:py-[1.2rem]={multiline}
>
  {#each allRefNums.slice(1) as refNum}
    <span id={`footnote-ref-${refNum}`} data-footnote-alias class="pointer-events-none"></span>
  {/each}
  {#if multiline && paragraphs}
    <div
      bind:this={paragraphsContainerEl}
      class="space-y-4 font-serif text-white"
    >
      <!-- Paragraphs will be populated by onMount -->
    </div>
  {:else}
    <p
      bind:this={paragraphEl}
      class="font-serif text-white font-semibold text-3xl md:text-4xl leading-tight"
    >
      <!-- Content will be populated by onMount -->
    </p>
  {/if}
  {#if citation}
    <cite
      bind:this={citationEl}
      class="block mt-3.5 md:mt-5 text-base md:text-lg text-muted-text-grey font-serif italic"
    >
      — {@html citation}
    </cite>
  {/if}
</blockquote>

<style lang="postcss">
  blockquote :global(em) {
    @apply italic;
  }

  blockquote :global(strong) {
    @apply font-bold;
  }

  blockquote :global(a) {
    @apply text-glacial-blue hover:text-white transition-colors underline;
  }

  /* Style individual lines in blockquotes with custom spacing */
  blockquote :global(.blockquote-line) {
    display: block;
    margin-bottom: 0.25em;
  }

  blockquote :global(.blockquote-line:last-child) {
    margin-bottom: 0;
  }

  /* Style markdown elements in citations */
  blockquote cite :global(em) {
    @apply italic;
  }

  blockquote cite :global(strong) {
    @apply font-bold;
  }

  blockquote cite :global(a) {
    @apply text-muted-text-grey;
    /* Gray underline by default */
    background-image: linear-gradient(to right, #C1C1C1, #C1C1C1);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    text-decoration: none;
    transition: background-size 0.2s ease, background-image 0.2s ease, color 0.2s ease;
  }

  blockquote cite :global(a:hover) {
    color: black;
    background-image: linear-gradient(to right, #ffffff, #ffffff);
    background-size: 100% 100%;
  }

  /* Footnote reference styling in blockquotes - match main body styling */
  blockquote :global(.footnote-ref) {
    @apply inline-flex items-baseline border-none cursor-pointer p-0 -ml-[0.375rem];
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  blockquote :global(.footnote-ref-inner) {
    @apply text-sm font-normal text-muted-text-grey transition-colors;
  }

  blockquote :global(.group:hover .footnote-ref-inner) {
    @apply text-white;
  }

  blockquote :global(.footnote-space) {
    @apply text-[0.32rem];
  }

  blockquote :global(.footnote-num) {
    @apply underline decoration-glacial-blue/60;
  }

  blockquote :global(.group:hover .footnote-num) {
    @apply decoration-glacial-blue;
  }

  /* Inline code in blockquotes - use page background color */
  blockquote :global(code) {
    @apply text-white bg-background/70;
    padding: 0.2rem 0.4rem;
    border-radius: 0.5rem;
    font-size: 0.9em;
  }
</style>
