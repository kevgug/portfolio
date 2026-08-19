import { writable, type Writable } from "svelte/store";

/* A looping strip the reader can take over by dragging, which then eases back
   into autoplay on its own. Extracted from the project marquee so the logo
   ticker behaves identically instead of carrying a second implementation.

   The consumer owns the markup: it renders `copyCount` copies of its set into a
   track inside a viewport, and hands both elements to start(). Everything below
   that — geometry, playback, input — lives here. */

export interface MarqueeOptions {
  /** Track children that make up one copy of the set. Used to find the period. */
  itemsPerCopy: number;
  /** Seconds for one full set to pass. Ignored when pixelsPerSecond is set. */
  loopSeconds?: number;
  /** Constant speed, for strips whose period changes between breakpoints. */
  pixelsPerSecond?: number;
  /** Swallow the click that ends a drag, for strips whose items are links. */
  suppressClickAfterDrag?: boolean;
}

export interface Marquee {
  /** Enough copies to cover the strip at any offset within one period. */
  copyCount: Writable<number>;
  dragging: Writable<boolean>;
  /** Wire the engine to its elements. Returns its teardown; call from onMount. */
  start: (viewport: HTMLElement, track: HTMLElement) => () => void;
  onPointerDown: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerEnd: (event: PointerEvent) => void;
}

// Timing
const RESUME_DELAY_MS = 1200; // idle time before autoplay resumes
const RESUME_RAMP_MS = 600; // ramp from stopped to normal playback
const FLICK_DECAY = 4.5; // exponential decay rate for flick momentum (1/s)
const MAX_FLICK_SPEED = 4000; // px/s
const DRAG_SLOP_PX = 5; // movement past which a gesture is a drag, not a click
const HOVER_FACTOR = 1 / 3; // autoplay speed while the cursor rests on the strip
const HOVER_RAMP_MS = 500; // easing in and out of that slower speed

export function createMarquee(options: MarqueeOptions): Marquee {
  const {
    itemsPerCopy,
    loopSeconds = 30,
    pixelsPerSecond,
    suppressClickAfterDrag = false,
  } = options;

  const copyCount = writable(2);
  const dragging = writable(false);

  let viewport: HTMLElement | null = null;
  let track: HTMLElement | null = null;

  // Loop geometry — width of one full set, including the gap that separates it
  // from the next copy. Measured from the DOM so gaps/fonts/image sizes can't
  // drift out of sync with the animation.
  let period = 0;

  // Playback state
  let offset = 0; // current translateX, kept within [-period, 0)
  let flickVelocity = 0; // px/s left over from a drag release
  let lastInteractionAt = -Infinity; // performance.now() of last user input
  let isDragging = false;
  let paused = false; // off-screen or tab hidden
  let hovering = false; // a mouse is resting on the strip
  let hoverBlend = 0; // 0 at full speed, 1 fully slowed; travels between the two
  let reduceMotion = false;

  // Drag bookkeeping
  let activePointerId: number | null = null;
  let activePointerIsMouse = false;
  let lastPointerX = 0;
  let lastPointerAt = 0;
  let travelled = 0; // absolute px moved in the current gesture
  let suppressNextClick = false;

  const setDragging = (value: boolean) => {
    isDragging = value;
    dragging.set(value);
  };

  const wrap = () => {
    if (period <= 0) return;
    offset = (((offset % period) + period) % period) - period;
  };

  const render = () => {
    if (!track) return;
    track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
  };

  const measure = () => {
    if (!track) return;

    const children = track.children;
    if (children.length <= itemsPerCopy) return;

    // offsetLeft is unaffected by our transform, so the distance between an item
    // and its duplicate in the next copy is exactly one loop period.
    const first = children[0] as HTMLElement;
    const duplicate = children[itemsPerCopy] as HTMLElement;
    const next = duplicate.offsetLeft - first.offsetLeft;

    if (next > 0 && Math.abs(next - period) > 0.5) {
      period = next;
      wrap();
      render();
    }

    if (period > 0) {
      const width = viewport?.clientWidth || window.innerWidth;
      copyCount.set(Math.max(2, Math.ceil(width / period) + 2));
    }
  };

  const noteInteraction = (now: number) => {
    lastInteractionAt = now;
  };

  /* Cursor on or off the strip only sets the target; the strip takes
     HOVER_RAMP_MS to get there. Stepping straight to half speed would read as a
     stutter, and the strip would jolt again the moment the cursor left. */
  const advanceHover = (dt: number) => {
    const target = hovering ? 1 : 0;
    if (hoverBlend === target) return;
    const step = (dt * 1000) / HOVER_RAMP_MS;
    hoverBlend =
      target > hoverBlend
        ? Math.min(target, hoverBlend + step)
        : Math.max(target, hoverBlend - step);
  };

  // 1 away from the cursor, HOVER_FACTOR under it, eased across the ramp.
  const hoverSpeed = (): number => {
    const eased = hoverBlend * hoverBlend * (3 - 2 * hoverBlend); // smoothstep
    return 1 - eased * (1 - HOVER_FACTOR);
  };

  // 0 while the user is in control, easing to 1 once they've let go for
  // RESUME_DELAY_MS and the ramp has played out. Slowed under the cursor, so a
  // reader looking at one item gets longer with it without having to grab it.
  const playbackFactor = (now: number): number => {
    if (reduceMotion || isDragging) return 0;
    const idleFor = now - lastInteractionAt - RESUME_DELAY_MS;
    if (idleFor <= 0) return 0;
    const t = Math.min(idleFor / RESUME_RAMP_MS, 1);
    const ramp = t * t * (3 - 2 * t); // smoothstep
    return ramp * hoverSpeed();
  };

  // ----- Drag core, shared by pointer events and the touch fallback -----
  const beginDrag = (x: number, timeStamp: number) => {
    setDragging(true);
    flickVelocity = 0;
    lastPointerX = x;
    lastPointerAt = timeStamp;
    travelled = 0;
    suppressNextClick = false;
    noteInteraction(performance.now());
  };

  const moveDrag = (x: number, timeStamp: number) => {
    const dx = x - lastPointerX;
    const dt = timeStamp - lastPointerAt;
    lastPointerX = x;
    lastPointerAt = timeStamp;
    travelled += Math.abs(dx);
    if (suppressClickAfterDrag && travelled > DRAG_SLOP_PX) {
      suppressNextClick = true;
    }

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
    setDragging(false);
    flickVelocity = Math.max(
      -MAX_FLICK_SPEED,
      Math.min(MAX_FLICK_SPEED, flickVelocity)
    );
    noteInteraction(performance.now());
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (period <= 0 || activePointerId !== null) return;

    activePointerId = event.pointerId;
    activePointerIsMouse = event.pointerType === "mouse";
    beginDrag(event.clientX, event.timeStamp);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!isDragging || event.pointerId !== activePointerId) return;
    moveDrag(event.clientX, event.timeStamp);

    /* Capture the mouse only once the gesture is unmistakably a drag. A
       captured pointer retargets the click to the viewport, so capturing on
       press would mean an item could never be clicked at all. Touch is left
       alone: the browser captures it implicitly, and capturing ourselves would
       fight `touch-action: pan-y` when the gesture turns out to be a vertical
       page scroll. */
    if (
      activePointerIsMouse &&
      travelled > DRAG_SLOP_PX &&
      !viewport?.hasPointerCapture?.(event.pointerId)
    ) {
      viewport?.setPointerCapture?.(event.pointerId);
    }
  };

  const onPointerEnd = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return;

    if (viewport?.hasPointerCapture?.(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    activePointerId = null;
    finishDrag();
  };

  const start = (viewportEl: HTMLElement, trackEl: HTMLElement) => {
    viewport = viewportEl;
    track = trackEl;

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

      if (paused || period <= 0 || isDragging || dt <= 0) return;

      advanceHover(dt);

      let moved = false;

      if (flickVelocity !== 0) {
        offset += flickVelocity * dt;
        flickVelocity *= Math.exp(-FLICK_DECAY * dt);
        if (Math.abs(flickVelocity) < 8) flickVelocity = 0;
        moved = true;
      }

      const factor = playbackFactor(now);
      if (factor > 0) {
        const speed = pixelsPerSecond ?? period / loopSeconds;
        offset -= speed * factor * dt;
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
    track.addEventListener("load", onLoad, true);
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});

    // The track's own box is clamped by its containing block, so observe the
    // viewport (layout changes) and the first item (image decode) as well.
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measure())
        : null;
    if (resizeObserver) {
      resizeObserver.observe(track);
      if (track.firstElementChild) resizeObserver.observe(track.firstElementChild);
      resizeObserver.observe(viewport);
    }

    // Don't burn frames while the marquee is off-screen.
    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => (paused = !entry.isIntersecting),
            { rootMargin: "200px" }
          )
        : null;
    intersectionObserver?.observe(viewport);

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
    viewport.addEventListener("wheel", onWheel, { passive: false });

    /* Mouse only: touch fires enter on tap and leaves it set until the reader
       touches something else, which would leave the strip stuck at half speed. */
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = true;
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = false;
    };
    viewport.addEventListener("pointerenter", onPointerEnter);
    viewport.addEventListener("pointerleave", onPointerLeave);

    /* A press that slips off the strip before it counts as a drag never gets
       captured, so its release lands on the page rather than the viewport.
       Without this the strip would stay stuck in the dragging state. */
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);

    // A drag that ends on a link would otherwise navigate on release.
    const onClick = (event: MouseEvent) => {
      if (!suppressNextClick) return;
      suppressNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    if (suppressClickAfterDrag) {
      viewport.addEventListener("click", onClick, true);
    }

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
    if (usesTouchFallback) {
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchmove", onTouchMove, { passive: false });
      viewport.addEventListener("touchend", onTouchEnd);
      viewport.addEventListener("touchcancel", onTouchEnd);
    }

    return () => {
      cancelAnimationFrame(rafId);
      track?.removeEventListener("load", onLoad, true);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      viewport?.removeEventListener("wheel", onWheel);
      viewport?.removeEventListener("pointerenter", onPointerEnter);
      viewport?.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      if (suppressClickAfterDrag) {
        viewport?.removeEventListener("click", onClick, true);
      }
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
  };

  return { copyCount, dragging, start, onPointerDown, onPointerMove, onPointerEnd };
}
