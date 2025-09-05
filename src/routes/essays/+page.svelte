<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
  const { posts } = data;
</script>

<svelte:head>
  <title>Essays | Kevin Gugelmann</title>
  <meta name="description" content="Thoughts by Kevin Gugelmann" />
</svelte:head>

<section class="py-8 md:py-12">
  <h1
    class="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
  >
    Essays
  </h1>
  <p class="text-muted-text-grey mt-3">
    Writing by <span class="text-white">Kevin Gugelmann</span>
  </p>
</section>

<div class="space-y-8 md:space-y-10 pb-8 md:pb-12">
  {#each posts as post}
    <a
      class="block group"
      href={`/essays/${post.slug}`}
      data-sa-link-event="blog_index_post"
    >
      <div
        class="flex flex-col md:flex-row md:items-baseline justify-between border border-white/10 rounded-3xl md:rounded-4xl p-6 md:p-7 hover:border-white/20 transition-colors"
      >
        <div class="flex-1 pr-0 md:pr-6">
          <h2
            class="text-xl md:text-2xl font-semibold text-white group-hover:text-glacial-blue transition-colors"
          >
            {post.title}
          </h2>
        </div>
        <p class="text-muted-text-grey mt-1 md:mt-0 shrink-0">
          {post.formattedDate}
        </p>
      </div>
    </a>
  {/each}
</div>
