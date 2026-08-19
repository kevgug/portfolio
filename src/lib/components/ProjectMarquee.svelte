<script lang="ts">
  import { onMount } from "svelte";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";
  import { BreakpointSizes, getCurrentBreakpoint } from "$lib/util/breakpoints";

  // Import all formats for progressive loading (AVIF -> WebP -> Original)
  // Pizza Screens
  import pizzaScreensSrc from "$lib/images/projects/pizza-screens.jpg";
  import pizzaScreensAvif from "$lib/images/projects/pizza-screens.avif";
  import pizzaScreensWebp from "$lib/images/projects/pizza-screens.webp";

  // Sport Video Analysis
  import sportVideoAnalysisSrc from "$lib/images/projects/sport-video-analysis.jpg";
  import sportVideoAnalysisAvif from "$lib/images/projects/sport-video-analysis.avif";
  import sportVideoAnalysisWebp from "$lib/images/projects/sport-video-analysis.webp";

  // Arc for iOS
  import arcForIosMediumSrc from "$lib/images/projects/arcforios-medium.jpg";
  import arcForIosMediumAvif from "$lib/images/projects/arcforios-medium.avif";
  import arcForIosMediumWebp from "$lib/images/projects/arcforios-medium.webp";

  // Task Timer
  import taskTimerSrc from "$lib/images/projects/task-timer-app.png";
  import taskTimerAvif from "$lib/images/projects/task-timer-app.avif";
  import taskTimerWebp from "$lib/images/projects/task-timer-app.webp";

  // GridLink
  import gridLinkSrc from "$lib/images/projects/gridlink-landingpage.jpg";
  import gridLinkAvif from "$lib/images/projects/gridlink-landingpage.avif";
  import gridLinkWebp from "$lib/images/projects/gridlink-landingpage.webp";

  // Optimized project set with progressive loading support
  const projects: ImageOptions[] = [
    {
      src: sportVideoAnalysisSrc,
      avifSrc: sportVideoAnalysisAvif,
      webpSrc: sportVideoAnalysisWebp,
      alt: "Sport Video Analysis project preview",
      loading: "eager",
    },
    {
      src: arcForIosMediumSrc,
      avifSrc: arcForIosMediumAvif,
      webpSrc: arcForIosMediumWebp,
      alt: "Arc for iOS project preview",
      loading: "eager",
    },
    {
      src: pizzaScreensSrc,
      avifSrc: pizzaScreensAvif,
      webpSrc: pizzaScreensWebp,
      alt: "Pizza Screens project preview",
      loading: "eager",
    },
    {
      src: gridLinkSrc,
      avifSrc: gridLinkAvif,
      webpSrc: gridLinkWebp,
      alt: "GridLink project preview",
      loading: "eager",
    },
    {
      src: taskTimerSrc,
      avifSrc: taskTimerAvif,
      webpSrc: taskTimerWebp,
      alt: "Task Timer project preview",
      loading: "eager",
    },
  ];

  // Timing
  const LOOP_SECONDS = 30; // seconds for one full set to pass
  const RESUME_DELAY_MS = 1200; // idle time before autoplay resumes
  const RESUME_RAMP_MS = 600; // ramp from stopped to normal playback
  const FLICK_DECAY = 4.5; // exponential decay rate for flick momentum (1/s)
  const MAX_FLICK_SPEED = 4000; // px/s

  let viewport: HTMLElement;
  let container: HTMLElement;
  let screenWidth = 0;

  // Responsive gap calculation
  $: breakpoint = getCurrentBreakpoint(screenWidth);
  $: gapClass =
    breakpoint === BreakpointSizes.sm
      ? "gap-4"
      : breakpoint === BreakpointSizes.md
      ? "gap-5"
      : "gap-6";

  // Loop geometry — width of one full set, including the gap that separates it
  // from the next copy. Measured from the DOM so gaps/fonts/image sizes can't
  // drift out of sync with the animation.
  let period = 0;
  let viewportWidth = 0;

  // Enough copies to cover the visible strip at any offset within one period.
  $: copyCount =
    period > 0
      ? Math.max(2, Math.ceil((viewportWidth || screenWidth) / period) + 2)
      : 2;

  // Playback state
  let offset = 0; // current translateX, kept within [-period, 0)
  let flickVelocity = 0; // px/s left over from a drag release
  let lastInteractionAt = -Infinity; // performance.now() of last user input
  let dragging = false;
  let paused = false; // off-screen or tab hidden
  let reduceMotion = false;

  // Drag bookkeeping
  let activePointerId: number | null = null;
  let lastPointerX = 0;
  let lastPointerAt = 0;

  const wrap = () => {
    if (period <= 0) return;
    offset = (((offset % period) + period) % period) - period;
  };

  const render = () => {
    if (!container) return;
    container.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
  };

  const measure = () => {
    if (!container) return;

    if (viewport) viewportWidth = viewport.clientWidth;

    const children = container.children;
    if (children.length <= projects.length) return;

    // offsetLeft is unaffected by our transform, so the distance between a card
    // and its duplicate in the next copy is exactly one loop period.
    const first = children[0] as HTMLElement;
    const duplicate = children[projects.length] as HTMLElement;
    const next = duplicate.offsetLeft - first.offsetLeft;

    if (next > 0 && Math.abs(next - period) > 0.5) {
      period = next;
      wrap();
      render();
    }
  };

  const noteInteraction = (now: number) => {
    lastInteractionAt = now;
  };

  // 0 while the user is in control, easing to 1 once they've let go for
  // RESUME_DELAY_MS and the ramp has played out.
  const playbackFactor = (now: number): number => {
    if (reduceMotion || dragging) return 0;
    const idleFor = now - lastInteractionAt - RESUME_DELAY_MS;
    if (idleFor <= 0) return 0;
    const t = Math.min(idleFor / RESUME_RAMP_MS, 1);
    return t * t * (3 - 2 * t); // smoothstep
  };

  // ----- Drag core, shared by pointer events and the touch fallback -----
  const beginDrag = (x: number, timeStamp: number) => {
    dragging = true;
    flickVelocity = 0;
    lastPointerX = x;
    lastPointerAt = timeStamp;
    noteInteraction(performance.now());
  };

  const moveDrag = (x: number, timeStamp: number) => {
    const dx = x - lastPointerX;
    const dt = timeStamp - lastPointerAt;
    lastPointerX = x;
    lastPointerAt = timeStamp;

    if (dt > 0) {
      // Smooth the sampled velocity so a single jittery frame can't dominate.
      const sampled = (dx / dt) * 1000;
      flickVelocity = flickVelocity * 0.7 + sampled * 0.3;
    }

    offset += dx;
    wrap();
    render();
    noteInteraction(performance.now());
  };

  const finishDrag = () => {
    dragging = false;
    flickVelocity = Math.max(
      -MAX_FLICK_SPEED,
      Math.min(MAX_FLICK_SPEED, flickVelocity)
    );
    noteInteraction(performance.now());
  };

  onMount(() => {
    let rafId = 0;
    let lastFrameAt = 0;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion = motionQuery.matches;
    const onMotionChange = () => (reduceMotion = motionQuery.matches);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", onMotionChange);
    } else {
      motionQuery.addListener(onMotionChange);
    }

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);

      // Clamp dt so a backgrounded tab or a long task can't teleport the strip.
      const dt = Math.min((now - lastFrameAt) / 1000, 0.05);
      lastFrameAt = now;

      if (paused || period <= 0 || dragging || dt <= 0) return;

      let moved = false;

      if (flickVelocity !== 0) {
        offset += flickVelocity * dt;
        flickVelocity *= Math.exp(-FLICK_DECAY * dt);
        if (Math.abs(flickVelocity) < 8) flickVelocity = 0;
        moved = true;
      }

      const factor = playbackFactor(now);
      if (factor > 0) {
        offset -= (period / LOOP_SECONDS) * factor * dt;
        moved = true;
      }

      if (moved) {
        wrap();
        render();
      }
    };

    // Kick off once the first frame gives us a timestamp baseline.
    rafId = requestAnimationFrame((now) => {
      lastFrameAt = now;
      rafId = requestAnimationFrame(frame);
    });

    measure();
    // Re-measure as images decode — intrinsic widths aren't known before that.
    const onLoad = () => measure();
    container?.addEventListener("load", onLoad, true);
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});

    // The track's own box is clamped by its containing block, so observe the
    // viewport (layout changes) and the first card (image decode) as well.
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;
    if (resizeObserver) {
      if (container) {
        resizeObserver.observe(container);
        if (container.firstElementChild) {
          resizeObserver.observe(container.firstElementChild);
        }
      }
      if (viewport) resizeObserver.observe(viewport);
    }

    // Don't burn frames while the marquee is off-screen.
    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => (paused = !entry.isIntersecting),
            { rootMargin: "200px" }
          )
        : null;
    if (intersectionObserver && viewport) intersectionObserver.observe(viewport);

    const onVisibility = () => {
      if (!document.hidden) lastFrameAt = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Registered by hand so preventDefault is allowed (Svelte's `on:wheel`
    // gives no control over passiveness here).
    const onWheel = (event: WheelEvent) => {
      if (period <= 0) return;
      // Only intercept clearly horizontal intent; vertical scrolling and
      // pinch-zoom stay with the page.
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      event.preventDefault();
      flickVelocity = 0;
      offset -= event.deltaX;
      wrap();
      render();
      noteInteraction(performance.now());
    };
    viewport?.addEventListener("wheel", onWheel, { passive: false });

    // Fallback for browsers without pointer events (older iOS Safari).
    let touchId: number | null = null;
    let touchAxis: "none" | "x" | "y" = "none";
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (event: TouchEvent) => {
      if (period <= 0 || touchId !== null) return;
      const touch = event.changedTouches[0];
      touchId = touch.identifier;
      touchAxis = "none";
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      beginDrag(touch.clientX, event.timeStamp);
    };

    const findTouch = (list: TouchList) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].identifier === touchId) return list[i];
      }
      return null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchId === null) return;
      const touch = findTouch(event.touches);
      if (!touch) return;

      if (touchAxis === "none") {
        const dx = Math.abs(touch.clientX - touchStartX);
        const dy = Math.abs(touch.clientY - touchStartY);
        if (dx < 6 && dy < 6) return;
        touchAxis = dx > dy ? "x" : "y";
        if (touchAxis === "y") {
          // Vertical swipe belongs to the page.
          touchId = null;
          finishDrag();
          flickVelocity = 0;
          return;
        }
      }

      event.preventDefault();
      moveDrag(touch.clientX, event.timeStamp);
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchId === null) return;
      if (!findTouch(event.changedTouches)) return;
      touchId = null;
      finishDrag();
    };

    const usesTouchFallback = typeof window.PointerEvent === "undefined";
    if (usesTouchFallback && viewport) {
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchmove", onTouchMove, { passive: false });
      viewport.addEventListener("touchend", onTouchEnd);
      viewport.addEventListener("touchcancel", onTouchEnd);
    }

    return () => {
      cancelAnimationFrame(rafId);
      container?.removeEventListener("load", onLoad, true);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      viewport?.removeEventListener("wheel", onWheel);
      if (usesTouchFallback && viewport) {
        viewport.removeEventListener("touchstart", onTouchStart);
        viewport.removeEventListener("touchmove", onTouchMove);
        viewport.removeEventListener("touchend", onTouchEnd);
        viewport.removeEventListener("touchcancel", onTouchEnd);
      }
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", onMotionChange);
      } else {
        motionQuery.removeListener(onMotionChange);
      }
    };
  });

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (period <= 0 || activePointerId !== null) return;

    activePointerId = event.pointerId;
    beginDrag(event.clientX, event.timeStamp);

    // Only capture the mouse: for touch the browser already implicitly captures
    // the pointer, and capturing ourselves would fight `touch-action: pan-y`
    // when the gesture turns out to be a vertical page scroll.
    if (event.pointerType === "mouse") {
      viewport.setPointerCapture?.(event.pointerId);
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== activePointerId) return;
    moveDrag(event.clientX, event.timeStamp);
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return;

    if (viewport.hasPointerCapture?.(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    activePointerId = null;
    finishDrag();
  };
</script>

<svelte:window bind:innerWidth={screenWidth} on:resize={measure} />

<div
  bind:this={viewport}
  class="relative w-full h-[250px] lg:h-[300px] overflow-hidden marquee-viewport"
  class:dragging
  on:pointerdown={onPointerDown}
  on:pointermove={onPointerMove}
  on:pointerup={onPointerEnd}
  on:pointercancel={onPointerEnd}
  on:dragstart|preventDefault
>
  <!-- Marquee container -->
  <div
    bind:this={container}
    class="absolute top-0 left-0 h-full flex items-center {gapClass} marquee-track"
  >
    {#each Array(copyCount) as _, copy}
      {#each projects as project}
        <div class="h-[250px] lg:h-[300px] flex-shrink-0" aria-hidden={copy > 0}>
          <Image
            imgOptions={project}
            class="h-[250px] lg:h-[300px] w-auto object-cover rounded-md lg:rounded-xl"
          />
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .marquee-viewport {
    touch-action: pan-y;
    cursor: grab;
  }

  .marquee-viewport.dragging {
    cursor: grabbing;
  }

  .marquee-track {
    will-change: transform;
    user-select: none;
    -webkit-user-select: none;
  }

  .marquee-track :global(img) {
    -webkit-user-drag: none;
    pointer-events: none;
  }
</style>
