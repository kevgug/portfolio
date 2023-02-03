<script>
  import Separator from "$lib/components/Separator.svelte";
  import CtaSection from "$lib/views/CtaSection.svelte";
  import Footer from "$lib/views/Footer.svelte";
  import ProjectCard from "$lib/views/ProjectCard.svelte";
  import HeroSection from "../lib/views/HeroSection.svelte";

  // Assets
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.png";
</script>

<div
  class="flex flex-col mx-auto
w-screen max-w-screen-2xl
px-[2rem] md:px-[2.5rem] xl:px-[5rem]"
>
  <HeroSection />
  <div
    class="flex flex-col
          space-y-20 md:space-y-24 lg:space-y-[7.25rem]"
  >
    <ProjectCard
      year={2022}
      name="Sport Video Analysis"
      outputMedium="Desktop App"
      role="Concept Design"
      imgPath={sportVideoAnalysisSrc}
      imgAlt=""
      description="Aliquid voluptatem vel ut quaerat veniam quisquam. Optio eos libero veniam rem et consequuntur omnis. Optio libero veniam doloremque."
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2021}
      name="TFDi Website Redesign"
      outputMedium="Website"
      role="Digital Marketing"
      imgPath={sportVideoAnalysisSrc}
      imgAlt=""
      description="Aliquid voluptatem vel ut quaerat veniam quisquam. Optio eos libero veniam rem et consequuntur omnis. Optio libero veniam doloremque."
      linkButtonContent={{
        label: "TFDi Website",
        href: "https://www.tradefinancedistribution.com/",
        openInNewTab: true,
      }}
    />
    <ProjectCard
      year={2020}
      name="Mindxone Co-Founder"
      outputMedium="Web SaaS"
      role="Product, Design & Development"
      imgPath={sportVideoAnalysisSrc}
      imgAlt=""
      description="Aliquid voluptatem vel ut quaerat veniam quisquam. Optio eos libero veniam rem et consequuntur omnis. Optio libero veniam doloremque."
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2019}
      name="Task App with Focus Timer"
      outputMedium="Mobile App"
      role="Design & Development"
      imgPath={sportVideoAnalysisSrc}
      imgAlt=""
      description="Aliquid voluptatem vel ut quaerat veniam quisquam. Optio eos libero veniam rem et consequuntur omnis. Optio libero veniam doloremque."
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2018}
      name="Panorama Mail"
      outputMedium="Mobile App"
      role="Concept Design"
      imgPath={sportVideoAnalysisSrc}
      imgAlt=""
      description="Aliquid voluptatem vel ut quaerat veniam quisquam. Optio eos libero veniam rem et consequuntur omnis. Optio libero veniam doloremque."
      linkButtonContent={undefined}
    />
  </div>
  <div class="pt-20 md:pt-24 lg:pt-32">
    <Separator />
  </div>
  <div class="py-20 md:py-[6.3rem] lg:py-32">
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

    @apply w-1 xl:w-[0.3rem];
    @apply h-1 xl:h-[0.3rem];
    @apply rounded-full;
    @apply bg-bullet-grey;
    @apply absolute; /* position bullet relative to list item */
    @apply top-[0.22em] md:top-[0.23em] lg:top-[0.24em] xl:top-[0.23em]; /* vertical align bullet position relative to list item */
    @apply left-[-0.44em] xl:left-[-0.54em]; /* position the bullet L- R relative to list item */
  }
</style>
