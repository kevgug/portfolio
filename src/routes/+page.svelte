<script lang="ts">
  import Separator from "$lib/components/Separator.svelte";
  import CtaSection from "$lib/views/CtaSection.svelte";
  import Footer from "$lib/views/Footer.svelte";
  import ProjectCard from "$lib/views/ProjectCard.svelte";
  import HeroSection from "../lib/views/HeroSection.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { projects } from "$lib/projects";

  // Assets
  // Link previews
  import linkPreviewSrc from "$lib/images/portfolio-preview.jpg";
  const pageTitle = "Kevin Gugelmann | Product Designer. AI-Native Engineer.";
  const pageDescription =
    "I'm a UX Engineer who combines a background in Cognitive Science with deep technical expertise to ship impactful products for startups and enterprises.";
  const pageUrl = "https://kevingugelmann.com";
  const pageDomain = "kevingugelmann.com";

  let projectsSectionElement: HTMLDivElement;
  let heroUsesZeigarnik: boolean;

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (projectsSectionElement) {
      if (heroUsesZeigarnik) {
        // With Zeigarnik: Animate on scroll with shorter delay
        gsap.fromTo(
          projectsSectionElement,
          {
            opacity: 0,
            filter: "blur(5px)",
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.8,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectsSectionElement,
              start: "top bottom-=40",
            },
          }
        );
      } else {
        // Without Zeigarnik: Keep current non-scroll animation
        gsap.fromTo(
          projectsSectionElement,
          {
            opacity: 0,
            filter: "blur(5px)",
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.8,
            delay: 0.68,
            ease: "power3.out",
          }
        );
      }
    }
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
  <meta property="og:image" content={linkPreviewSrc} />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={pageDomain} />
  <meta property="twitter:url" content={pageUrl} />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={linkPreviewSrc} />

  <!-- 100% privacy friendly analytics -->
  <script
    data-collect-dnt="true"
    async
    defer
    src="https://scripts.simpleanalyticscdn.com/latest.js"
  ></script>

  <script type="text/javascript">
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "k9uwm0mq3h");
  </script>
  <script>
    (function () {
      function saLoadedLinkEvents() {
        document
          .querySelectorAll("a[data-sa-link-event]")
          .forEach(function (element) {
            var href = element.getAttribute("href");
            var eventName = element.getAttribute("data-sa-link-event");
            if (!window.sa_event || !window.sa_loaded) return;

            /*
            Add click listener to all <a> elements with the
            `data-sa-link-event` attribute
            */
            element.addEventListener("click", function (event) {
              var target = element.getAttribute("target");
              window.sa_event(eventName);
              return target !== "_blank";
            });
          });
      }

      if (
        document.readyState === "ready" ||
        document.readyState === "complete"
      ) {
        saLoadedLinkEvents();
      } else {
        document.addEventListener("readystatechange", function (event) {
          if (event.target.readyState === "complete") saLoadedLinkEvents();
        });
      }
    })();
  </script>
</svelte:head>

<NavBar />

<div
  class="flex flex-col mx-auto
w-screen max-w-screen-2xl
px-5 md:px-[2.5rem] xl:px-[5rem]
pt-16 md:pt-20"
>
  <HeroSection bind:useZeigarnikEffect={heroUsesZeigarnik} />
  <div
    bind:this={projectsSectionElement}
    class="projects-section-on-load flex flex-col
          space-y-20 md:space-y-24 lg:space-y-[7.25rem]"
  >
    {#each projects as project}
      <div id={project.id}>
        <ProjectCard
          year={project.year}
          name={project.name}
          outputMedium={project.outputMedium}
          role={project.role}
          imgOptions={project.imgOptions}
          description={project.description}
          builtWith={project.builtWith}
          linkButtonContent={project.linkButtonContent}
          bgColor={project.bgColor}
        />
      </div>
    {/each}
  </div>
  <div class="pt-20 md:pt-24 lg:pt-32">
    <Separator />
  </div>
  <div id="contact" class="py-20 md:py-[6.3rem] lg:py-32">
    <CtaSection />
  </div>
  <Footer />
</div>

<!-- 100% privacy friendly analytics -->
<noscript
  ><img
    src="https://queue.simpleanalyticscdn.com/hello.gif"
    alt=""
    referrerpolicy="no-referrer-when-downgrade"
  /></noscript
>

<style lang="postcss">
  :global(body) {
    @apply bg-background;
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

  :global(a) {
    @apply cursor-pointer;
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
    @apply opacity-50;
    @apply absolute; /* position bullet relative to list item */
    @apply top-[0.22em] md:top-[0.23em] lg:top-[0.24em] xl:top-[0.23em]; /* vertical align bullet position relative to list item */
    @apply left-[-0.34em] xl:left-[-0.54em]; /* position the bullet L- R relative to list item */
  }

  :global(li span) {
    @apply italic;
    @apply text-bullet-grey;
  }

  :global(img) {
    /* For alt text */
    @apply text-glacial-blue;
  }

  :global(a) {
    @apply text-glacial-blue;
  }

  .projects-section-on-load {
    opacity: 0;
    filter: blur(5px);
    transform: translateY(20px);
  }
</style>
