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

  // Assets
  import freestyleLogoSrc from "$lib/images/projects/freestyle-logo.jpg";
  import freestyleLogoAvif from "$lib/images/projects/freestyle-logo.avif";
  import freestyleLogoWebp from "$lib/images/projects/freestyle-logo.webp";
  import gridLinkSrc from "$lib/images/projects/gridlink-landingpage.jpg";
  import gridLinkAvif from "$lib/images/projects/gridlink-landingpage.avif";
  import gridLinkWebp from "$lib/images/projects/gridlink-landingpage.webp";
  import arcForIosMediumSrc from "$lib/images/projects/arcforios-medium.jpg";
  import arcForIosMediumAvif from "$lib/images/projects/arcforios-medium.avif";
  import arcForIosMediumWebp from "$lib/images/projects/arcforios-medium.webp";
  import zeestaLabsLockupSrc from "$lib/images/projects/zeesta-labs-lockup.jpg";
  import zeestaLabsLockupAvif from "$lib/images/projects/zeesta-labs-lockup.avif";
  import zeestaLabsLockupWebp from "$lib/images/projects/zeesta-labs-lockup.webp";
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.jpg";
  import sportVideoAnalysisAvif from "$lib/images/projects/sport-video-analysis.avif";
  import sportVideoAnalysisWebp from "$lib/images/projects/sport-video-analysis.webp";
  import pizzaSrc from "$lib/images/projects/pizza-screens.jpg";
  import pizzaAvif from "$lib/images/projects/pizza-screens.avif";
  import pizzaWebp from "$lib/images/projects/pizza-screens.webp";
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
  import kevingugelmannPortfolioPreviewSrc from "$lib/images/projects/kevingugelmann-portfolio-preview.jpg";
  import kevingugelmannPortfolioPreviewAvif from "$lib/images/projects/kevingugelmann-portfolio-preview.avif";
  import kevingugelmannPortfolioPreviewWebp from "$lib/images/projects/kevingugelmann-portfolio-preview.webp";

  // Link previews
  import linkPreviewSrc from "$lib/images/portfolio-preview.jpg";
  const pageTitle = "Kevin Gugelmann | Thoughtful Design. Radical Speed.";
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
px-5 md:px-[2.5rem] xl:px-[5rem]"
>
  <HeroSection bind:useZeigarnikEffect={heroUsesZeigarnik} />
  <div
    bind:this={projectsSectionElement}
    class="projects-section-on-load flex flex-col
          space-y-20 md:space-y-24 lg:space-y-[7.25rem]"
  >
    <ProjectCard
      year={2024}
      name="Freestyle (YC S24)"
      outputMedium="AI Infrastructure"
      role="Software Engineer"
      imgOptions={{
        src: freestyleLogoSrc,
        avifSrc: freestyleLogoAvif,
        webpSrc: freestyleLogoWebp,
        alt: "Freestyle logo",
      }}
      description="Designed and engineered company website and blog, driving 2k+ monthly visitors. Built JavaScript runtime functionality in Rust/V8, helping secure multi-million funding."
      builtWith={["React", "JavaScript", "TypeScript", "TailwindCSS", "Rust"]}
      linkButtonContent={{
        label: "View Website",
        destination: "https://www.freestyle.sh",
        mediaType: "webpage",
        eventName: "projects_ext_freestyle_landingpage",
        openInNewTab: true,
      }}
      bgColor="#1e1e1e"
    />
    <ProjectCard
      year={2023}
      name="GridLink (Techstars '23)"
      outputMedium="EV Fleet SaaS"
      role="Platform Engineer"
      imgOptions={{
        src: gridLinkSrc,
        avifSrc: gridLinkAvif,
        webpSrc: gridLinkWebp,
        alt: "A screenshot of the GridLink EV fleet management platform landing page",
      }}
      description="Redesigned and implemented the fleet charging schedule page, shipping React components from Figma designs. Simplified navigation UX with a platform-wide redesign proposal."
      builtWith={["React", "TypeScript", "Figma"]}
      linkButtonContent={{
        label: "View Website",
        destination: "https://gridlink.co",
        mediaType: "webpage",
        eventName: "projects_ext_gridlink_landingpage",
        openInNewTab: true,
      }}
      bgColor="#1e2521"
    />
    <ProjectCard
      year={2023}
      name="Arc Browser for iOS"
      outputMedium="UX Case Study"
      role="Research, Design, & Writing"
      imgOptions={{
        src: arcForIosMediumSrc,
        avifSrc: arcForIosMediumAvif,
        webpSrc: arcForIosMediumWebp,
        alt: "A showcase of multiple screens from across the whole Arc for iOS redesign",
      }}
      description="Designed and prototyped a complete Arc for iOS redesign in 30 days, publishing the case study in Bootcamp, the largest design publication on Medium."
      builtWith={["Figma", "Medium", "Artboard Studio"]}
      linkButtonContent={{
        label: "Read Story",
        destination:
          "https://bootcamp.uxdesign.cc/arc-for-ios-gets-the-student-redesign-it-deserves-in-30-days-5c54decf90af",
        mediaType: "read",
        eventName: "projects_ext_arcforios_mediumstory",
        openInNewTab: true,
      }}
      bgColor="#1d252c"
    />
    <ProjectCard
      year={2023}
      name="Zeesta Labs"
      outputMedium="Medical AI Startup"
      role="UX Engineer"
      imgOptions={{
        src: zeestaLabsLockupSrc,
        avifSrc: zeestaLabsLockupAvif,
        webpSrc: zeestaLabsLockupWebp,
        alt: "Zeesta Labs logo lockup rendered onto an outside wall poster",
      }}
      description="Built complete brand identity from scratch and engineered iOS app in React Native from my Figma designs. Created custom brand book and determined unique value proposition for medical AI startup."
      builtWith={["Figma", "Figma Variables", "React Native", "TypeScript"]}
      linkButtonContent={undefined}
      bgColor="#18292d"
    />
    <ProjectCard
      year={2023}
      name="Design Portfolio"
      outputMedium="Website"
      role="Design & Engineering"
      imgOptions={{
        src: kevingugelmannPortfolioPreviewSrc,
        avifSrc: kevingugelmannPortfolioPreviewAvif,
        webpSrc: kevingugelmannPortfolioPreviewWebp,
        alt: "Mini preview of Kevin Gugelmann's portfolio website",
      }}
      description="This website! Designed in Sketch and engineered with SvelteKit & Tailwind CSS. Deployed on GitHub Pages with image lazy-loading, achieving 98% Lighthouse Performance."
      builtWith={[
        "Sketch",
        "SvelteKit",
        "Tailwind CSS",
        "TypeScript",
        "GitHub Pages",
      ]}
      linkButtonContent={undefined}
      bgColor="#182025"
    />
    <ProjectCard
      year={2022}
      name="Sport Video Analysis UI Prototype"
      outputMedium="Desktop App"
      role="Design & Prototyping"
      imgOptions={{
        src: sportVideoAnalysisSrc,
        avifSrc: sportVideoAnalysisAvif,
        webpSrc: sportVideoAnalysisWebp,
        alt: "Visually highlighting an athlete's technique in a sport video analysis desktop UI",
      }}
      description="Designed and prototyped ten interactive UI states for a sport video analysis desktop app, solving the lack of documented session review I experienced training for UK rowing nationals. Used dark neutrals to focus attention on video content."
      builtWith={["Sketch"]}
      linkButtonContent={{
        label: "Play Prototype",
        destination:
          "https://www.sketch.com/s/6b635a81-80df-4b3f-b768-f79b2f50a17a/prototype/a/C3BA3CB2-6410-4698-A061-DB50BF2985EA",
        mediaType: "play",
        eventName: "projects_ext_sportvideoanalysis_sketchprototype",
        openInNewTab: true,
      }}
      bgColor="#262626"
    />
    <ProjectCard
      year={2022}
      name="Best Design Prize at UChicago's Designathon"
      outputMedium="Concept App"
      role="Lead Designer"
      imgOptions={{
        src: pizzaSrc,
        avifSrc: pizzaAvif,
        webpSrc: pizzaWebp,
        alt: "Three iPhone mockups of a mobile app prototype for gamified group pizza ordering",
      }}
      description="Led a 5-hour designathon as part of an ad-hoc UChicago team, creating a prize-winning mobile app prototype. Gamified pizza ordering with Secret Santa mechanics, reimagining the entire ordering and delivery process."
      builtWith={["Figma", "FigJam"]}
      linkButtonContent={undefined}
      bgColor="#2b2a24"
    />
    <ProjectCard
      year={2021}
      name="Trade Finance Distribution Initiative"
      outputMedium="Website Redesign"
      role="Digital Marketing Strategist"
      imgOptions={{
        src: tfdiSrc,
        avifSrc: tfdiAvif,
        webpSrc: tfdiWebp,
        alt: "Hero section of the Trade Finance Distribution Initiative's landing page with a clear CTA and social validation",
      }}
      description="Designed and built complete website redesign in Figma and Webflow, increasing traffic by 100% in first month. Rewrote all 1k+ words of copy, eliminating jargon and achieving sub-20% bounce rate on 3.7k monthly visits."
      builtWith={["Figma", "Webflow"]}
      linkButtonContent={{
        label: "View Website",
        destination: "https://www.tradefinancedistribution.com/",
        mediaType: "webpage",
        eventName: "projects_ext_tfdi_landingpage",
        openInNewTab: true,
      }}
      bgColor="#08262c"
    />
    <ProjectCard
      year={2020}
      name="Mindxone"
      outputMedium="Web App"
      role="Co-Founder & UX Engineer"
      imgOptions={{
        src: mindxoneLandingPageSrc,
        webpSrc: mindxoneLandingPageWebp,
        alt: "Hero section of Mindxone's landing page displaying a screenshot of the web SaaS product",
      }}
      description="Co-founded and engineered a web app reimagining digital content organization with tag-exclusive ideology. Built full-stack product to MVP stage before sunsetting to focus on studies."
      builtWith={[
        "Adobe XD",
        "HTML/CSS/JS",
        "JQuery",
        "NodeJS",
        "Express.js",
        "AWS",
      ]}
      linkButtonContent={undefined}
      bgColor="#2b2b2b"
    />
    <ProjectCard
      year={2019}
      name="Task App with Focus Timer"
      outputMedium="Mobile App"
      role="UX Engineer"
      imgOptions={{
        src: taskTimerAppSrc,
        avifSrc: taskTimerAppAvif,
        webpSrc: taskTimerAppWebp,
        alt: "Side-by-side iPhone mockups of a task app with a focus timer",
      }}
      description="Designed and built an iOS task app with focus timer and priority estimation in Flutter. Implemented swipe-first navigation with custom micro-interactions. Was too young to publish to App Store."
      builtWith={["InVision Studio", "Flutter"]}
      linkButtonContent={undefined}
      bgColor="#17233b"
    />
    <ProjectCard
      year={2018}
      name="Panorama Mail"
      outputMedium="Concept App"
      role="Design & Prototyping"
      imgOptions={{
        src: panoramaMailSrc,
        avifSrc: panoramaMailAvif,
        webpSrc: panoramaMailWebp,
        alt: "Side-by-side iPhone screenshots of a concept design mail app",
      }}
      description="Designed and prototyped 57 animated artboards for a concept mobile mail app. Built rapid email triaging with 'Panorama' screen, plus snooze, quick reply, and undo send features."
      builtWith={["Adobe XD", "Auto-Animate"]}
      linkButtonContent={{
        label: "Play Prototype",
        destination:
          "https://xd.adobe.com/view/552c22ef-39b5-49f2-b148-08ff939eb20b-007f/?fullscreen",
        mediaType: "play",
        eventName: "projects_ext_panoramamail_prototype",
        openInNewTab: true,
      }}
      bgColor="#102436"
    />
    <ProjectCard
      year={2018}
      name="Prismatic News"
      outputMedium="Android App"
      role="Full-Stack Engineer"
      imgOptions={{
        src: prismaticNewsSrc,
        avifSrc: prismaticNewsAvif,
        webpSrc: prismaticNewsWebp,
        alt: "Side-by-side promotional Android mockups for an offline news-reading app",
      }}
      description="Engineered and published a native Android app with API integration and web scraping for offline reading. Built nine theme variants, text-to-speech, and AI sentence highlighting. Reached 5,000+ installs on Google Play Store."
      builtWith={["Android Studio", "Java", "Firebase"]}
      linkButtonContent={{
        label: "Play Video",
        destination: "https://youtu.be/6lico6jtV5E",
        mediaType: "play",
        eventName: "projects_ext_prismaticnews_promovideo",
        openInNewTab: true,
      }}
      bgColor="#142934"
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
