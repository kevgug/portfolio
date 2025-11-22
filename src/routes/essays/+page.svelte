<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import Icon from "$lib/components/Icon.svelte";
  export let data: PageData;
  const { posts } = data;

  // Social media metadata
  const siteUrl = "https://kevingugelmann.com";
  const pageUrl = `${siteUrl}/essays`;
  const pageTitle = "Essays | Kevin Gugelmann";
  const pageDescription = "Essays and thoughts by Kevin Gugelmann on design, AI, and building products";
  const pageDomain = "kevingugelmann.com";

  let listContainer: HTMLElement;

  onMount(() => {
    const ctx = gsap.context(() => {
      const cards = Array.from(
        (listContainer?.querySelectorAll(
          ".anim-in"
        ) as unknown as NodeListOf<HTMLElement>) || []
      );

      if (cards.length) {
        gsap.set(cards, {
          autoAlpha: 0,
          y: 20,
          scale: 0.98,
          filter: "blur(4px)",
          willChange: "transform, opacity, filter",
        });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          overwrite: "auto",
          clearProps: "transform,filter,willChange",
          delay: 0.05,
        });
      }
    }, listContainer);

    return () => ctx.revert();
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="canonical" href={pageUrl} />

  <!-- Facebook Meta Tags -->
  <meta property="og:url" content={pageUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary" />
  <meta property="twitter:domain" content={pageDomain} />
  <meta property="twitter:url" content={pageUrl} />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
</svelte:head>

<section class="py-8 md:py-12">
  <h1
    class="text-2xl md:text-3xl xl:text-4xl font-bold text-glacial-blue tracking-tight leading-tight"
  >
    Essays
  </h1>
  <p class="text-muted-text-grey mt-1 md:mt-1.5">
    Writing by <span class="text-white">Kevin Gugelmann</span>
  </p>
</section>

<div bind:this={listContainer} class="space-y-3 md:space-y-4 pb-8 md:pb-12">
  {#if posts.length === 0}
    <div class="pt-8 md:pt-12">
      <p class="text-muted-text-grey text-lg">Coming soon.</p>
    </div>
  {:else}
    {#each posts as post}
      <div id={`essay-item-${post.slug}`} class="anim-in">
        <a
          class="block group"
          href={`/essays/${post.slug}`}
          data-sa-link-event="blog_index_post"
        >
          <div
            class="flex flex-col justify-between border border-white/10 rounded-3xl md:rounded-4xl px-5 py-4 md:px-6 md:py-5 xl:px-8 xl:py-7 hover:border-white/20 transition-colors"
          >
            <div class="flex-1 pr-0 md:pr-6">
              <h2
                class="text-lg md:text-xl font-semibold text-white group-hover:text-glacial-blue transition-colors"
              >
                {post.title}
              </h2>
            </div>
            <div class="flex items-center gap-2 mt-1 md:mt-0.5">
              <p
                class="text-muted-text-grey text-xs md:text-sm shrink-0"
              >
                {post.formattedDate}
              </p>
              {#if post.publish === false}
                <Icon name="lock" size="16px" class="shrink-0 text-muted-text-grey" />
              {/if}
            </div>
          </div>
        </a>
      </div>
    {/each}
  {/if}
</div>

<style>
  .anim-in {
    opacity: 0;
    visibility: hidden;
  }
</style>
