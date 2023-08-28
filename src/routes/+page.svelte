<script>
  import Separator from "$lib/components/Separator.svelte";
  import CtaSection from "$lib/views/CtaSection.svelte";
  import Footer from "$lib/views/Footer.svelte";
  import ProjectCard from "$lib/views/ProjectCard.svelte";
  import HeroSection from "../lib/views/HeroSection.svelte";

  // Assets
  import zeestaLabsLockupSrc from "$lib/images/projects/zeesta-labs-lockup.jpg";
  import zeestaLabsLockupAvif from "$lib/images/projects/zeesta-labs-lockup.avif";
  import zeestaLabsLockupWebp from "$lib/images/projects/zeesta-labs-lockup.webp";
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.jpg";
  import sportVideoAnalysisAvif from "$lib/images/projects/sport-video-analysis.avif";
  import sportVideoAnalysisWebp from "$lib/images/projects/sport-video-analysis.webp";
  import tfdiSrc from "$lib/images/projects/tfdi.jpg";
  import tfdiAvif from "$lib/images/projects/tfdi.avif";
  import tfdiWebp from "$lib/images/projects/tfdi.webp";
  import mindxoneLandingPageSrc from "$lib/images/projects/mindxone-landing-page.jpg";
  import mindxoneLandingPageWebp from "$lib/images/projects/mindxone-landing-page.webp";
  import taskTimerAppSrc from "$lib/images/projects/task-timer-app.png";
  import taskTimerAppAvif from "$lib/images/projects/task-timer-app.avif";
  import taskTimerAppWebp from "$lib/images/projects/task-timer-app.webp";
  import panoramaMailSrc from "$lib/images/projects/panorama-mail.png";
  import panoramaMailAvif from "$lib/images/projects/panorama-mail.avif";
  import panoramaMailWebp from "$lib/images/projects/panorama-mail.webp";
  import prismaticNewsSrc from "$lib/images/projects/prismatic-news.jpg";
  import prismaticNewsAvif from "$lib/images/projects/prismatic-news.avif";
  import prismaticNewsWebp from "$lib/images/projects/prismatic-news.webp";

  // Link previews
  import linkPreviewSrc from "$lib/images/portfolio-preview.jpg";
  const pageTitle =
    "Kevin Gugelmann | SaaS Designer, Developer, & Marketing Strategist with a Meticulous Eye for Detail";
  const pageDescription =
    "Remarkably meticulous SaaS designer, developer, and marketing strategist with 7+ years of cross-industry experience, studying CS & Economics at UChicago.";
  const pageUrl = "https://kevingugelmann.com";
  const pageDomain = "kevingugelmann.com";
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

<!-- Portfolio website -->
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
      year={2023}
      name="Zeesta Labs"
      outputMedium="Medical AI Startup"
      role="UI/UX Design, Frontend Dev, Brand Strategy Intern"
      imgOptions={{
        src: zeestaLabsLockupSrc,
        avifSrc: zeestaLabsLockupAvif,
        webpSrc: zeestaLabsLockupWebp,
        alt: "Zeesta Labs logo lockup rendered onto an outside wall poster",
      }}
      description="Built up a unique verbal & visual brand identity from scratch, including the logo, documented in a custom brand book. Helped develop an efficient iOS app in React Native based on my Figma UI designs. Determined unique value proposition."
      builtWith={["Figma", "Figma Variables", "React Native", "TypeScript"]}
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2022}
      name="Sport Video Analysis"
      outputMedium="Desktop App"
      role="Concept Design"
      imgOptions={{
        src: sportVideoAnalysisSrc,
        avifSrc: sportVideoAnalysisAvif,
        webpSrc: sportVideoAnalysisWebp,
        alt: "Visually highlighting an athlete's technique in a sport video analysis desktop UI",
      }}
      description="Designed and prototyped ten UI states of a sport video analysis desktop app, which would solve the lack of documented session review I experienced when training for UK rowing national gold in high school. Used mainly dark neutrals to keep the user's focus on each video."
      builtWith={["Sketch App"]}
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2021}
      name="Trade Finance Distribution Initiative"
      outputMedium="Website Redesign"
      role="Digital Marketing Intern"
      imgOptions={{
        src: tfdiSrc,
        avifSrc: tfdiAvif,
        webpSrc: tfdiWebp,
        alt: "Hero section of the Trade Finance Distribution Initiative's landing page with a clear CTA and social validation",
      }}
      description="Led the full redesign of their primary website using Figma and Webflow, increasing site traffic by 100% within the first month. Revamped all 1k+ words of the original copy, eliminating financial jargon, leading to a sub-20% bounce rate on 3.7k monthly visits. Determined slogan."
      builtWith={["Figma", "Webflow"]}
      linkButtonContent={{
        label: "TFDi Website",
        destination: "https://www.tradefinancedistribution.com/",
        eventName: "projects_ext_tfdi_landingpage",
        openInNewTab: true,
      }}
    />
    <ProjectCard
      year={2020}
      name="Mindxone Co-Founder"
      outputMedium="Web SaaS"
      role="Product, Design & Development"
      imgOptions={{
        src: mindxoneLandingPageSrc,
        webpSrc: mindxoneLandingPageWebp,
        alt: "Hero section of Mindxone's landing page displaying a screenshot of the web SaaS product",
      }}
      description="Co-developed a web app reimagining how people create and manage their digital content, based on a tag–exclusive organisation ideology. Took the product to its MVP stage. Sunset to focus on my studies."
      builtWith={[
        "Adobe XD",
        "HTML/CSS/JS",
        "JQuery",
        "NodeJS",
        "Express.js",
        "AWS",
      ]}
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2019}
      name="Task App with Focus Timer"
      outputMedium="Mobile App"
      role="Design & Development"
      imgOptions={{
        src: taskTimerAppSrc,
        avifSrc: taskTimerAppAvif,
        webpSrc: taskTimerAppWebp,
        alt: "Side-by-side iPhone mockups of a task app with a focus timer",
      }}
      description="Designed, prototyped, and built an iOS task app with a focus timer and priority estimation. Swipe-first navigation and duration selection. Custom subtle and playful micro-interactions. Too young to publish to the App Store (16 years old)."
      builtWith={["InVision Studio", "Flutter"]}
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2018}
      name="Panorama Mail"
      outputMedium="Mobile App"
      role="Concept Design"
      imgOptions={{
        src: panoramaMailSrc,
        avifSrc: panoramaMailAvif,
        webpSrc: panoramaMailWebp,
        alt: "Side-by-side iPhone screenshots of a concept design mail app",
      }}
      description="Prototyped 57 animated artboards of a concept mobile mail app. The titular 'Panorama' screen enables rapid email triaging. Features also include: snooze, quick reply, and undo send. Inspired by Spark Mail."
      builtWith={["Adobe XD"]}
      linkButtonContent={undefined}
    />
    <ProjectCard
      year={2018}
      name="Prismatic News"
      outputMedium="Android App"
      role="Native Development"
      imgOptions={{
        src: prismaticNewsSrc,
        avifSrc: prismaticNewsAvif,
        webpSrc: prismaticNewsWebp,
        alt: "Side-by-side promotional Android mockups for an offline news-reading app",
      }}
      description="Developed and published a native Android app that fetches trending news via an API, then scrapes webpages for offline reading. Nine reading theme variants. Line-by-line text-to-speech. AI top sentences highlighting. 1000+ installs on the Google Play Store."
      builtWith={["Android Studio", "Java", "Firebase"]}
      linkButtonContent={{
        label: "Promo Video (YouTube)",
        destination: "https://youtu.be/6lico6jtV5E",
        eventName: "projects_ext_prismaticnews_promovideo",
        openInNewTab: true,
      }}
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
    @apply absolute; /* position bullet relative to list item */
    @apply top-[0.22em] md:top-[0.23em] lg:top-[0.24em] xl:top-[0.23em]; /* vertical align bullet position relative to list item */
    @apply left-[-0.44em] xl:left-[-0.54em]; /* position the bullet L- R relative to list item */
  }

  :global(img) {
    /* For alt text */
    @apply text-glacial-blue;
  }
</style>
