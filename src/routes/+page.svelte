<script>
  import Separator from "$lib/components/Separator.svelte";
  import CtaSection from "$lib/views/CtaSection.svelte";
  import Footer from "$lib/views/Footer.svelte";
  import ProjectCard from "$lib/views/ProjectCard.svelte";
  import HeroSection from "../lib/views/HeroSection.svelte";
</script>

<div
  class="flex flex-col mx-auto
w-screen max-w-screen-2xl
px-[32px] lg:px-[2.5rem] xl:px-[5rem]"
>
  <HeroSection />
  <div class="flex flex-col">
    <ProjectCard
      year="2022"
      name="Sport Video Analysis"
      outputMedium="Desktop App"
      role="Concept Design"
      imgPath="/images/projects/sport-video-analysis.png"
      imgAlt=""
      description="Aliquid voluptatem vel ut quaerat veniam quisquam. Optio eos libero veniam rem et consequuntur omnis. Optio libero veniam doloremque."
      linkButtonContent={{
        label: "Dribbble",
        href: "",
      }}
    />
  </div>
  <div class="pt-20 md:pt-24 lg:pt-32">
    <Separator />
  </div>
  <div class="py-20 md:py-24 lg:py-32">
    <CtaSection />
  </div>
  <Footer />
</div>

<style lang="postcss">
  :root {
    @apply bg-background;
  }

  :global(html) {
    @apply scroll-smooth;
  }

  :global(p, h1, h2, li) {
    @apply text-white;
  }

  :global(h1) {
    @apply text-2xl;
    @apply font-semibold;
    @apply md:text-3xl;
    @apply xl:text-4xl;
    @apply leading-tight;
  }

  :global(h2) {
    @apply text-base;
    @apply md:text-lg;
  }

  :global(p, li, a) {
    @apply text-sm;
    @apply md:text-base;
  }

  :global(button) {
    @apply text-sm;
    @apply md:text-base;
  }

  :global(li) {
    @apply font-serif;
    @apply list-none;
    @apply relative; /* positioning context for bullet */
  }

  :global(li:not(:last-child)) {
    @apply mb-[0.65rem] lg:mb-3;
  }

  :global(li::before) {
    content: "";
    font-size: 2.5em; /* the default unicode bullet size is very small */
    line-height: 0; /* kills huge line height on resized bullet */

    @apply w-1 xl:w-[0.4rem];
    @apply h-1 xl:h-[0.4rem];
    @apply rounded-full;
    @apply bg-bullet-grey;
    @apply absolute; /* position bullet relative to list item */
    @apply top-[0.22em] md:top-[0.23em] lg:top-[0.24em] xl:top-[0.23em]; /* vertical align bullet position relative to list item */
    @apply left-[-0.48em] md:left-[-0.55em]; /* position the bullet L- R relative to list item */
  }
</style>
