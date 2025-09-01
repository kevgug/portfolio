import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "$lib/projects";

interface ScrollOptions {
  duration?: number;
  ease?: string;
  offset?: number;
}

interface ReliableScrollOptions extends ScrollOptions {
  onComplete?: () => void;
  maxWaitTime?: number;
  preloadImages?: boolean; // Whether to preload images before scrolling (default: true)
}

// Cache for browser format support to avoid repeated checks
let formatSupportCache: { [key: string]: boolean } | null = null;

/**
 * Checks if the browser supports a specific image format
 */
function checkImageFormatSupport(format: "avif" | "webp"): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);

    // Test images (1x1 pixel transparent images in each format)
    const testImages = {
      avif: "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=",
      webp: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA",
    };

    img.src = testImages[format];
  });
}

/**
 * Gets browser format support, with caching
 */
async function getBrowserFormatSupport(): Promise<{
  avif: boolean;
  webp: boolean;
}> {
  if (formatSupportCache) {
    return formatSupportCache as { avif: boolean; webp: boolean };
  }

  const [avifSupport, webpSupport] = await Promise.all([
    checkImageFormatSupport("avif"),
    checkImageFormatSupport("webp"),
  ]);

  formatSupportCache = {
    avif: avifSupport,
    webp: webpSupport,
  };

  return formatSupportCache as { avif: boolean; webp: boolean };
}

/**
 * Selects the best supported image format
 */
async function selectBestImageFormat(imgOptions: {
  src: string;
  avifSrc?: string;
  webpSrc?: string;
}): Promise<string> {
  const support = await getBrowserFormatSupport();

  // Priority order: AVIF > WebP > fallback
  if (support.avif && imgOptions.avifSrc) {
    return imgOptions.avifSrc;
  }

  if (support.webp && imgOptions.webpSrc) {
    return imgOptions.webpSrc;
  }

  return imgOptions.src; // Fallback to PNG/JPG
}

/**
 * Preloads a single image and returns a promise that resolves when loaded
 */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn(`Failed to preload image: ${src}`);
      resolve(); // Don't fail the whole process for one image
    };
    img.src = src;
  });
}

/**
 * Preloads all image formats for a project - OPTIMIZED VERSION
 * Now only loads the best supported format instead of all formats
 */
async function preloadProjectImages(imgOptions: {
  src: string;
  avifSrc?: string;
  webpSrc?: string;
}): Promise<void> {
  const bestImageSrc = await selectBestImageFormat(imgOptions);
  await preloadImage(bestImageSrc);
}

/**
 * Preloads critical images that could affect scroll calculations
 * Loads all project images from the beginning up to and including the target,
 * since their heights determine the target's final scroll position
 *
 * Enhanced to also force-load any lazy-loaded images in the DOM
 */
async function preloadCriticalImages(
  targetElement: HTMLElement
): Promise<void> {
  const targetId = targetElement.id;

  if (!targetId) {
    // If no target ID, preload all project images as fallback
    const allImagePromises = projects.map((project) =>
      preloadProjectImages(project.imgOptions)
    );
    await Promise.all(allImagePromises);

    // Also force-load any lazy images in the DOM
    await forceLoadLazyImages();
    return;
  }

  // Find the target project and nearby projects
  const targetIndex = projects.findIndex((project) => project.id === targetId);

  if (targetIndex === -1) {
    // Target not found in projects, try to find images in the target element
    await preloadImagesInElement(targetElement);
    return;
  }

  // Preload all projects from start up to and including target
  // All previous project heights affect the target's scroll position
  const indicesToLoad = Array.from(
    { length: targetIndex + 1 },
    (_, index) => index
  );

  const imagePromises = indicesToLoad.map((index) =>
    preloadProjectImages(projects[index].imgOptions)
  );

  await Promise.all(imagePromises);

  // Force-load any lazy images in the DOM that might affect layout
  await forceLoadLazyImages();
}

/**
 * Forces lazy-loaded images to load immediately by temporarily changing their loading attribute
 */
async function forceLoadLazyImages(): Promise<void> {
  const lazyImages = document.querySelectorAll(
    'img[loading="lazy"]'
  ) as NodeListOf<HTMLImageElement>;

  if (lazyImages.length === 0) {
    return;
  }

  const imagePromises: Promise<void>[] = [];

  lazyImages.forEach((img, index) => {
    const promise = new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
        return;
      }

      // Temporarily change loading to eager and force load
      const originalLoading = img.loading;
      img.loading = "eager";

      const onLoad = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
        img.loading = originalLoading; // Restore original loading attribute
        resolve();
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onLoad);

      // Force load by setting src again if it's not already loading
      if (!img.complete) {
        const currentSrc = img.src;
        img.src = "";
        img.src = currentSrc;
      }
    });

    imagePromises.push(promise);
  });

  await Promise.all(imagePromises);
}

/**
 * Finds and preloads images within a specific element
 * Enhanced to handle picture elements and force-load lazy images
 */
async function preloadImagesInElement(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img");
  const imagePromises: Promise<void>[] = [];

  images.forEach((img) => {
    if (img.src) {
      imagePromises.push(preloadImage(img.src));
    }

    // Also check for srcset images
    if (img.srcset) {
      const srcsetUrls = img.srcset
        .split(",")
        .map((src) => src.trim().split(" ")[0]);
      srcsetUrls.forEach((url) => {
        if (url) imagePromises.push(preloadImage(url));
      });
    }
  });

  // Check for source elements in picture tags
  const sources = element.querySelectorAll("source");
  sources.forEach((source) => {
    if (source.srcset) {
      const srcsetUrls = source.srcset
        .split(",")
        .map((src) => src.trim().split(" ")[0]);
      srcsetUrls.forEach((url) => {
        if (url) imagePromises.push(preloadImage(url));
      });
    }
  });

  await Promise.all(imagePromises);

  // Force-load any lazy images in this element
  const lazyImages = element.querySelectorAll(
    'img[loading="lazy"]'
  ) as NodeListOf<HTMLImageElement>;
  const lazyImagePromises: Promise<void>[] = [];

  lazyImages.forEach((img) => {
    const promise = new Promise<void>((resolve) => {
      if (img.complete) {
        resolve();
        return;
      }

      const originalLoading = img.loading;
      img.loading = "eager";

      const onLoad = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
        img.loading = originalLoading;
        resolve();
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onLoad);

      if (!img.complete) {
        const currentSrc = img.src;
        img.src = "";
        img.src = currentSrc;
      }
    });

    lazyImagePromises.push(promise);
  });

  await Promise.all(lazyImagePromises);
}

/**
 * Calculates the precise scroll position for an element
 */
function calculateTargetScrollPosition(
  element: HTMLElement,
  offset: number
): number {
  const elementRect = element.getBoundingClientRect();
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  return currentScrollTop + elementRect.top + offset;
}

/**
 * Converts ease string to GSAP ease format
 */
function convertEaseToGSAP(ease: string): string {
  const easeMap: Record<string, string> = {
    "out-expo": "expo.out",
    "in-expo": "expo.in",
    "inout-expo": "expo.inOut",
    "out-quint": "power4.out",
    outQuint: "power4.out",
    "in-quint": "power4.in",
    "inout-quint": "power4.inOut",
    "out-cubic": "power2.out",
    "in-cubic": "power2.in",
    "inout-cubic": "power2.inOut",
    linear: "none",
  };
  return easeMap[ease] || ease;
}

/**
 * Reliably scrolls to an element with smooth animation
 *
 * Enhanced version that provides smooth scroll animation with:
 * 1. Preloading critical images to ensure accurate layout calculations
 * 2. Using GSAP for precise scroll animation control
 * 3. Clamping scroll position to prevent overshooting beyond valid scroll range
 * 4. Maintaining smooth easing throughout the entire scroll process
 *
 * The scroll position is clamped between 0 and the maximum scrollable area
 * to prevent scrolling beyond the page boundaries.
 */
export async function reliableScrollToElement(
  target: string | HTMLElement,
  options: ReliableScrollOptions = {}
): Promise<void> {
  const {
    duration = 1000,
    ease = "out-expo",
    offset = 0,
    onComplete,
    preloadImages = true,
  } = options;

  // Get the target element
  const targetElement =
    typeof target === "string"
      ? (document.querySelector(target) as HTMLElement)
      : target;

  if (!targetElement) {
    console.warn(`Target element not found: ${target}`);
    return;
  }

  // Step 1: Force complete any ongoing GSAP animations and ensure visibility
  await prepareElementsForScroll();

  // Step 2: Preload critical images that affect layout before calculating position
  // Always preload project images for accurate scroll calculations, regardless of target
  if (preloadImages) {
    if (
      targetElement.id &&
      projects.some((project) => project.id === targetElement.id)
    ) {
      // Target is a project section - preload images up to this project
      await preloadCriticalImages(targetElement);
    } else {
      // Target is not a project section (e.g., contact) - still preload all project images
      // because they affect the overall page layout and scroll calculations

      // Preload all project images to ensure accurate layout calculations
      const allImagePromises = projects.map((project) =>
        preloadProjectImages(project.imgOptions)
      );
      await Promise.all(allImagePromises);

      // Force-load any lazy images in the DOM that might affect layout
      await forceLoadLazyImages();
    }

    // Additional wait to ensure layout is fully stable after image loading
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Force a layout recalculation to ensure all image dimensions are properly calculated
    targetElement.offsetHeight; // Force reflow
  }

  // Step 3: Calculate precise target position (now with correct layout)
  const targetScrollTop = calculateTargetScrollPosition(targetElement, offset);

  // Step 3.5: Clamp scroll position to prevent overshooting
  const maxScrollTop = Math.max(
    0,
    document.body.scrollHeight - window.innerHeight
  );
  const clampedTargetScrollTop = Math.max(
    0,
    Math.min(targetScrollTop, maxScrollTop)
  );

  // Step 4: Perform the main scroll with GSAP (custom scroll animation)
  const gsapEase = convertEaseToGSAP(ease);
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;

  return new Promise((resolve) => {
    // Create a proxy object to animate the scroll position
    const scrollProxy = { scrollTop: currentScrollTop };

    gsap.to(scrollProxy, {
      duration: duration / 1000, // GSAP uses seconds
      scrollTop: clampedTargetScrollTop,
      ease: gsapEase,
      onUpdate: () => {
        // Update the actual scroll position during animation
        window.scrollTo(0, scrollProxy.scrollTop);
      },
      onComplete: () => {
        // Call user onComplete callback directly
        if (onComplete) {
          onComplete();
        }

        resolve();
      },
      // Add error handling
      onInterrupt: () => {
        console.warn("Scroll animation was interrupted");
        resolve();
      },
    });
  });
}

/**
 * Prepares elements for scroll by forcing GSAP animations to complete
 */
async function prepareElementsForScroll(): Promise<void> {
  // Force complete any ongoing GSAP animations on the projects section
  const projectsSection = document.querySelector(
    ".projects-section-on-load"
  ) as HTMLElement;

  if (projectsSection) {
    // Kill any ongoing animations on the projects section
    gsap.killTweensOf(projectsSection);

    // Force the projects section to be fully visible immediately
    gsap.set(projectsSection, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transform: "translateY(0px)",
    });

    // Update ScrollTrigger calculations after forcing visibility
    ScrollTrigger.refresh();
  }

  // Wait for layout to stabilize
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve(void 0);
      });
    });
  });

  // Additional wait to ensure all animations are truly complete
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Force a layout recalculation to ensure all elements are properly sized
  if (projectsSection) {
    projectsSection.offsetHeight; // Force reflow
  }
}

/**
 * Ensures a GSAP-animated element is fully visible and ready for interaction
 */
export function ensureElementVisible(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    // Kill any ongoing animations
    gsap.killTweensOf(element);

    // Set to fully visible state
    gsap.set(element, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transform: "translateY(0px)",
    });

    // Wait for layout to stabilize
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Calculates responsive offset based on viewport size
 */
export function getResponsiveOffset(options?: {
  useExtraSpacing?: boolean;
}): number {
  const { useExtraSpacing = false } = options ?? {};

  let totalSpacing = 0;

  // Calculate navbar height offset (64px mobile, 80px desktop)
  if (window.innerWidth >= 768) {
    totalSpacing += 80; // Desktop navbar height
  } else {
    totalSpacing += 64; // Mobile navbar height
  }

  // Add extra spacing for projects only
  if (useExtraSpacing) {
    if (window.innerWidth >= 768) {
      totalSpacing += 48; // Desktop extra spacing
    } else {
      totalSpacing += 36; // Mobile extra spacing
    }
  }

  return -totalSpacing; // Negative to scroll above the element
}
