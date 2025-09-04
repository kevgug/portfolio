<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;
  const { posts } = data;
</script>

<svelte:head>
  <title>Blog | Kevin Gugelmann</title>
  <meta name="description" content="Thoughts by Kevin Gugelmann" />
</svelte:head>

<section class="pt-3">
  <h1
    class="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
  >
    Blog
  </h1>
  <p class="text-muted-text-grey mt-3">
    Writing by <span class="text-white">Kevin Gugelmann</span>
  </p>
</section>

<div class="mt-10 md:mt-12 lg:mt-14 space-y-8 md:space-y-10">
  {#each posts as post}
    <a
      class="block group"
      href={`/blog/${post.slug}`}
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
          <p class="text-description-text-grey font-serif mt-3">
            {post.description}
          </p>
        </div>
        <p class="text-muted-text-grey mt-4 md:mt-0 shrink-0">{post.date}</p>
      </div>
    </a>
  {/each}
</div>

