import type { LinkButtonContent } from "$lib/util/linkButtonContent";

// Assets
import jpmcLogoSrc from "$lib/images/projects/jpmc-logo.jpg";
import jpmcLogoAvif from "$lib/images/projects/jpmc-logo.avif";
import jpmcLogoWebp from "$lib/images/projects/jpmc-logo.webp";
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

export interface Project {
  id: string;
  year: number;
  name: string;
  outputMedium: string;
  role: string;
  imgOptions: {
    src: string;
    avifSrc?: string;
    webpSrc?: string;
    alt: string;
  };
  description: string;
  builtWith: string[];
  linkButtonContent?: LinkButtonContent;
  bgColor: string;
}

export const projects: Project[] = [
  {
    id: "jpmorganchase",
    year: 2025,
    name: "JPMorganChase",
    outputMedium: "Global Private Bank",
    role: "UX Engineer",
    imgOptions: {
      src: jpmcLogoSrc,
      avifSrc: jpmcLogoAvif,
      webpSrc: jpmcLogoWebp,
      alt: "JPMorganChase logo in gold",
    },
    description:
      "Delivered 500x performance improvements to publish a Figma plugin worldwide, enabling 300+ annual hours saved in design. Engineered a data visualization generator converting CSVs to on-brand charts in 1 second and built AI-native tool enabling designers to collaboratively build Figma plugins via natural language without code or git. Selected as 1 of 5 interns to present these solutions to 460+ JPMC tech interns globally.",
    builtWith: ["Figma", "TypeScript", "React", "TailwindCSS", "Bash Scripts"],
    linkButtonContent: {
      label: "View Website",
      destination: "https://www.jpmorganchase.com",
      mediaType: "webpage",
      eventName: "projects_ext_jpmc_landingpage",
      openInNewTab: true,
    },
    bgColor: "#28211D",
  },
  {
    id: "freestyle",
    year: 2024,
    name: "Freestyle (YC S24)",
    outputMedium: "AI Infrastructure",
    role: "Software Engineer",
    imgOptions: {
      src: freestyleLogoSrc,
      avifSrc: freestyleLogoAvif,
      webpSrc: freestyleLogoWebp,
      alt: "Freestyle logo",
    },
    description:
      "Designed and engineered end-to-end company website and essays with data-driven information architecture, doubling monthly traffic to 2k+ visitors across 80 countries through landing page redesign, clearer messaging, and CRM integration. Built JavaScript runtime functionality in Rust on top of the V8 engine, helping secure multi-million funding.",
    builtWith: ["React", "JavaScript", "TypeScript", "TailwindCSS", "Rust"],
    linkButtonContent: {
      label: "View Website",
      destination: "https://www.freestyle.sh",
      mediaType: "webpage",
      eventName: "projects_ext_freestyle_landingpage",
      openInNewTab: true,
    },
    bgColor: "#1e1e1e",
  },
  {
    id: "gridlink",
    year: 2023,
    name: "GridLink (Techstars '23)",
    outputMedium: "EV Fleet SaaS",
    role: "Platform Engineer",
    imgOptions: {
      src: gridLinkSrc,
      avifSrc: gridLinkAvif,
      webpSrc: gridLinkWebp,
      alt: "A screenshot of the GridLink EV fleet management platform landing page",
    },
    description:
      "First product hire; mapped product strategy for $18B EV fleet market through analysis of 33 deliverables across 6 stakeholders. Wireframed a full platform UI redesign proposal, balancing simplified navigation with familiarity bias for older demographic. Redesigned the product-central charging schedule page around Material UI design system, improving information hierarchy and shipping React components from Figma designs.",
    builtWith: ["React", "TypeScript", "Figma"],
    linkButtonContent: {
      label: "View Website",
      destination: "https://gridlink.co",
      mediaType: "webpage",
      eventName: "projects_ext_gridlink_landingpage",
      openInNewTab: true,
    },
    bgColor: "#1e2521",
  },
  {
    id: "arcbrowser",
    year: 2023,
    name: "Arc Browser iOS Redesign",
    outputMedium: "UX Case Study",
    role: "Research, Design, & Writing",
    imgOptions: {
      src: arcForIosMediumSrc,
      avifSrc: arcForIosMediumAvif,
      webpSrc: arcForIosMediumWebp,
      alt: "A showcase of multiple screens from across the whole Arc for iOS redesign",
    },
    description:
      "Produced animated mobile app redesign generating 16K+ views and scouted by UX Collective's founder Fabricio Teixeira—Partner at Work & Co, whose work influences millions of designers worldwide and has earned recognition from global brands like Google, Samsung, and Mailchimp. Conducted user research yielding novel mental state framework and delivered 4 core UX innovations through complete Arc for iOS redesign in 30 days.",
    builtWith: ["Figma", "Medium", "Artboard Studio"],
    linkButtonContent: {
      label: "Read Story",
      destination:
        "https://bootcamp.uxdesign.cc/arc-for-ios-gets-the-student-redesign-it-deserves-in-30-days-5c54decf90af",
      mediaType: "read",
      eventName: "projects_ext_arcforios_mediumstory",
      openInNewTab: true,
    },
    bgColor: "#1d252c",
  },
  {
    id: "zeestalabs",
    year: 2023,
    name: "Zeesta Labs",
    outputMedium: "Medical AI Startup",
    role: "UX Engineer",
    imgOptions: {
      src: zeestaLabsLockupSrc,
      avifSrc: zeestaLabsLockupAvif,
      webpSrc: zeestaLabsLockupWebp,
      alt: "Zeesta Labs logo lockup rendered onto an outside wall poster",
    },
    description:
      "Built complete brand identity from scratch and engineered iOS app in React Native from my Figma designs. Created custom brand book and determined unique value proposition for medical AI startup.",
    builtWith: ["Figma", "Figma Variables", "React Native", "TypeScript"],
    linkButtonContent: undefined,
    bgColor: "#18292d",
  },
  {
    id: "sportvideoanalysis",
    year: 2022,
    name: "Sport Video Analysis App",
    outputMedium: "Desktop App",
    role: "Design & Prototyping",
    imgOptions: {
      src: sportVideoAnalysisSrc,
      avifSrc: sportVideoAnalysisAvif,
      webpSrc: sportVideoAnalysisWebp,
      alt: "Visually highlighting an athlete's technique in a sport video analysis desktop UI",
    },
    description:
      "Designed and prototyped ten interactive UI states for a sport video analysis desktop app, solving the lack of documented session review I experienced training for UK rowing nationals. Used dark neutrals to focus attention on video content.",
    builtWith: ["Sketch"],
    linkButtonContent: {
      label: "Play Prototype",
      destination:
        "https://www.sketch.com/s/6b635a81-80df-4b3f-b768-f79b2f50a17a/prototype/a/C3BA3CB2-6410-4698-A061-DB50BF2985EA",
      mediaType: "play",
      eventName: "projects_ext_sportvideoanalysis_sketchprototype",
      openInNewTab: true,
    },
    bgColor: "#262626",
  },
  {
    id: "uchicagodesignathon",
    year: 2022,
    name: "UChicago Designathon Winner",
    outputMedium: "Best Design Prize",
    role: "Lead Designer",
    imgOptions: {
      src: pizzaSrc,
      avifSrc: pizzaAvif,
      webpSrc: pizzaWebp,
      alt: "Three iPhone mockups of a mobile app prototype for gamified group pizza ordering",
    },
    description:
      "Led a 5-hour designathon as part of an ad-hoc UChicago team, creating a prize-winning mobile app prototype. Gamified pizza ordering with Secret Santa mechanics, reimagining the entire ordering and delivery process.",
    builtWith: ["Figma", "FigJam"],
    linkButtonContent: undefined,
    bgColor: "#2b2a24",
  },
  {
    id: "tfdi",
    year: 2021,
    name: "Trade Finance Distribution Initiative",
    outputMedium: "Website Redesign",
    role: "Digital Marketing Strategist",
    imgOptions: {
      src: tfdiSrc,
      avifSrc: tfdiAvif,
      webpSrc: tfdiWebp,
      alt: "Hero section of the Trade Finance Distribution Initiative's landing page with a clear CTA and social validation",
    },
    description:
      "Redesigned the company website using a user-centered approach, increasing site traffic by 2x to 4k+ monthly visitors and attracting 90% more members through social validation featuring 14 Fortune 500 members with $20T+ AUM. Led three design reviews with C-suite executives, successfully advocating for key brand storytelling elements while rewriting all 1k+ words of copy to eliminate jargon and achieve sub-20% bounce rate.",
    builtWith: ["Figma", "Webflow"],
    linkButtonContent: {
      label: "View Website",
      destination: "https://www.tradefinancedistribution.com/",
      mediaType: "webpage",
      eventName: "projects_ext_tfdi_landingpage",
      openInNewTab: true,
    },
    bgColor: "#08262c",
  },
  {
    id: "mindxone",
    year: 2020,
    name: "Mindxone",
    outputMedium: "Web App",
    role: "Co-Founder & UX Engineer",
    imgOptions: {
      src: mindxoneLandingPageSrc,
      webpSrc: mindxoneLandingPageWebp,
      alt: "Hero section of Mindxone's landing page displaying a screenshot of the web SaaS product",
    },
    description:
      "Co-founded and engineered a web app reimagining digital content organization with tag-exclusive ideology. Built full-stack product to MVP stage before sunsetting to focus on studies.",
    builtWith: [
      "Adobe XD",
      "HTML/CSS/JS",
      "JQuery",
      "NodeJS",
      "Express.js",
      "AWS",
    ],
    linkButtonContent: undefined,
    bgColor: "#2b2b2b",
  },
  {
    id: "taskapp",
    year: 2019,
    name: "Task App with Focus Timer",
    outputMedium: "Mobile App",
    role: "UX Engineer",
    imgOptions: {
      src: taskTimerAppSrc,
      avifSrc: taskTimerAppAvif,
      webpSrc: taskTimerAppWebp,
      alt: "Side-by-side iPhone mockups of a task app with a focus timer",
    },
    description:
      "Designed and built an iOS task app with focus timer and priority estimation in Flutter. Implemented swipe-first navigation with custom micro-interactions.",
    builtWith: ["InVision Studio", "Flutter"],
    linkButtonContent: undefined,
    bgColor: "#17233b",
  },
  {
    id: "panoramamail",
    year: 2018,
    name: "Panorama Mail",
    outputMedium: "Concept App",
    role: "Design & Prototyping",
    imgOptions: {
      src: panoramaMailSrc,
      avifSrc: panoramaMailAvif,
      webpSrc: panoramaMailWebp,
      alt: "Side-by-side iPhone screenshots of a concept design mail app",
    },
    description:
      "Designed and prototyped 50+ animated artboards for a concept mobile mail app. Built rapid email triaging with 'Panorama' screen, plus snooze, quick reply, and undo send features.",
    builtWith: ["Adobe XD", "Auto-Animate"],
    linkButtonContent: {
      label: "Play Prototype",
      destination:
        "https://xd.adobe.com/view/552c22ef-39b5-49f2-b148-08ff939eb20b-007f/?fullscreen",
      mediaType: "play",
      eventName: "projects_ext_panoramamail_prototype",
      openInNewTab: true,
    },
    bgColor: "#102436",
  },
  {
    id: "prismaticnews",
    year: 2018,
    name: "Prismatic News",
    outputMedium: "Android App",
    role: "Full-Stack Engineer",
    imgOptions: {
      src: prismaticNewsSrc,
      avifSrc: prismaticNewsAvif,
      webpSrc: prismaticNewsWebp,
      alt: "Side-by-side promotional Android mockups for an offline news-reading app",
    },
    description:
      "Designed and programmed native Android news reader with custom web scraping, AI text summarization, and offline capabilities reaching 5,000+ users on Google Play Store. Engineered line-by-line text-to-speech playback, content parsing algorithms in Java, nine theme variants, and AI sentence highlighting for comprehensive reading experience.",
    builtWith: ["Android Studio", "Java", "Firebase"],
    linkButtonContent: {
      label: "Play Video",
      destination: "https://youtu.be/6lico6jtV5E",
      mediaType: "play",
      eventName: "projects_ext_prismaticnews_promovideo",
      openInNewTab: true,
    },
    bgColor: "#142934",
  },
];
