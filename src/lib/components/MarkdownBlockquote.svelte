<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  export let text: string;

  let blockquoteEl: HTMLElement;
  let paragraphEl: HTMLElement;
  let hasAnimated = false;

  /**
   * Splits HTML text into words while preserving HTML tags
   */
  function wrapWordsInSpans(htmlText: string): string {
    // Create a temporary element to parse HTML
    const temp = document.createElement("div");
    temp.innerHTML = htmlText;

    function processNode(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split text into words and wrap each in a span
        const text = node.textContent || "";
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
        const childrenHtml = Array.from(el.childNodes)
          .map((child) => processNode(child))
          .join("");
        return `<${tagName}${attributeStr}>${childrenHtml}</${tagName}>`;
      }
      return "";
    }

    return Array.from(temp.childNodes)
      .map((node) => processNode(node))
      .join("");
  }

  onMount(() => {
    // Replace paragraph content with word-wrapped version
    const wrappedHtml = wrapWordsInSpans(text);
    paragraphEl.innerHTML = wrappedHtml;

    // Get all word spans
    const words = paragraphEl.querySelectorAll(".word-anim");

    // Set initial state for animation
    gsap.set(words, {
      opacity: 0,
      y: 10,
    });

    // Check if blockquote is already in view or above viewport on mount
    const rect = blockquoteEl.getBoundingClientRect();
    // If top is above viewport bottom, it's either visible or already scrolled past
    const shouldShowImmediately = rect.top < window.innerHeight;

    if (shouldShowImmediately) {
      // Already visible or above viewport, show immediately without animation
      gsap.set(words, {
        opacity: 1,
        y: 0,
      });
      hasAnimated = true;
    } else {
      // Set up intersection observer to trigger animation
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              hasAnimated = true;

              // Animate words with stagger
              gsap.to(words, {
                opacity: 1,
                y: 0,
                duration: 0.35, // 350ms per word
                stagger: 0.09, // 90ms stagger delay
                ease: "power2.out",
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
  class="!my-7 md:!my-9 py-3.5 px-4 md:px-6 md:py-4 border-l-4 border-glacial-blue bg-glacial-blue/5 md:rounded-r-lg"
>
  <p 
    bind:this={paragraphEl}
    class="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight md:leading-snug"
  >
    {@html text}
  </p>
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
</style>
