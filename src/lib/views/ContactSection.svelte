<script>
  import { onDestroy, onMount } from "svelte";
  import PrimaryButton from "$lib/components/PrimaryButton.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import portrait from "$lib/kevin-gugelmann-portrait.txt?raw";
  import essayIndex from "$content/essays/index.json";

  /* The generator already emits these newest-first, and filters unpublished
     ones in production only — same source and behaviour as /essays. Sorted
     again here so the order does not depend on how the file was written. */
  const recentEssays = [...essayIndex]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map((e) => ({
      ...e,
      formattedDate: new Date(e.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    }));

  const BASE = portrait.replace(/\s+$/, "").split("\n");
  // Substitutes are drawn from the art's own alphabet, derived from the file so
  // it cannot drift out of sync with it. Glyphs from outside the density ramp
  // punch holes of unrelated weight into the portrait.
  const ALPHABET = [...new Set(portrait.replace(/\s/g, ""))].join("");

  /* Surfaced only where the cursor's radius covers it, so it is not sitting in
     the DOM to be found. Clicking while any of it shows swaps to the next one.
     Anchored on the mouth — the generator in .context/stencil/unicode_art.py
     prints MSG_ROW and MSG_CENTER as [anchor]. Each message is centred on that
     column, so they need not be the same length. */
  /* Widest entry is 17 characters, which centred on column 30 spans 22-39 —
     inside row 33's own width. A longer one would pad the row out past the rest
     of the art and widen the whole block. */
  const MESSAGES = [
    "Stay curious",
    "That's the spirit",
    "Thank you...",
    "... for visiting",
    "Thanks again",
    "Insistent, huh?",
    "I'm leaving",
    "Goodbye",
    "I'm going in...",
    "Three",
    "Two",
    "One",
    "Zero",
    "Minus One",
    "Got you there",
    "Cycling to i=0", // and the modulo below does exactly that
  ];
  const MSG_ROW = 33;
  const MSG_CENTER = 30;
  const SWAP_MS = 1100; // scramble before a character settles into its new value
  const CHURN_MS = 55; // how often a scrambling character picks a new glyph;
  // re-rolling every frame reads as noise rather than as a mechanism turning over
  /* Screen-space px, so the falloff reads round. Held as a multiple of
     font-size rather than a fixed value: the graphic is now sized from the
     viewport, and a fixed radius would cover half the art on a small screen
     and a few characters on a large one. Ratio is the 44px the fixed version
     used at its md font-size, so the feel at that size is unchanged. */
  const RADIUS_EM = 6.8;
  let radius = 44; // replaced by fit() on mount, before any pointer event
  const ONSET = 0.35; // per-frame chance an uncovered cell takes a substitute
  const STRIDE = Math.max(...BASE.map((l) => l.length)) + 1;
  const ROWS = BASE.length;
  const COLS = STRIDE - 1;

  /* The art is a fixed grid, so its size is entirely a function of font-size:
     COLS glyph advances wide, and ROWS lines tall at line-height 1. Fill the
     width, unless doing so would make it taller than MAX_VH of the viewport.

     Rendered before hydration with an assumed 0.6em advance, which is close
     enough for every monospace in the stack that correcting it later is not a
     visible jump. fit() then substitutes the real measured advance. */
  const ASSUMED_ADVANCE = 0.6;
  const MAX_VH = 0.6;
  let sizeCss = `min(${(100 / (COLS * ASSUMED_ADVANCE)).toFixed(4)}vw, ${(
    (100 * MAX_VH) /
    ROWS
  ).toFixed(4)}vh)`;
  let advance = 0; // glyph advance as a fraction of font-size
  let fitTimeout;

  let el;
  /* Full-width wrapper around the <pre>, which is only as wide as the art. The
     available width has to be read off something other than the art itself:
     the art's own width is a function of the font-size fit() is deriving. */
  let box;
  // one entry per run of text; only the revealed message run is highlighted
  let parts = [{ t: BASE.join("\n"), hi: false }];
  let pointer = null;
  let lastClient = null; // last pointer position in client coords
  let raf = 0;
  let cellW = 0;
  let cellH = 0;
  let msgIndex = 0;
  let revealed = 0; // characters of the message currently within the radius
  let swap = null; // { settle: number[], end: number } while a swap animates
  let swapRaf = 0;
  /* cell key -> the glyph it is currently showing. Held across frames: a cell
     keeps whatever it was given until it leaves the radius. */
  let active = new Map();

  /* Character cells, measured off a detached probe rather than the <pre>
     itself, whose box is the full column width and says nothing about glyph
     advance. Re-measured on enter because the font-size steps at md. */
  function measure() {
    const cs = getComputedStyle(el);
    const probe = document.createElement("span");
    probe.style.cssText = `position:absolute;left:-9999px;top:0;white-space:pre;font-family:${cs.fontFamily};font-size:${cs.fontSize}`;
    probe.textContent = "0".repeat(64);
    document.body.appendChild(probe);
    cellW = probe.getBoundingClientRect().width / 64;
    probe.remove();
    cellH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize);
  }

  /* Redrawn only in response to movement — no repeating timer — so the glyphs
     under a stationary cursor hold still instead of shimmering.

     A cell that is already substituted and still inside the radius keeps the
     glyph it has; only cells entering pick a new one, and only cells leaving go
     back. Re-rolling everything in range each frame made the whole patch churn.

     The onset roll is deliberately not stored when it fails, so an undistorted
     cell gets another chance as the cursor closes in and intensity rises. That
     is what gives the patch a soft edge that fills in rather than a hard disc. */
  function redraw() {
    raf = 0;
    if (!pointer) return;
    trackCursor();
    paint(performance.now());
  }

  /* Split from paint() because the swap animation repaints on a timer. Rolling
     the onset again on those frames would let a stationary cursor slowly
     distort everything in range, which is exactly what movement-driven
     redrawing avoids. */
  function trackCursor() {
    const next = new Map();
    const r0 = Math.max(0, Math.floor((pointer.y - radius) / cellH));
    const r1 = Math.min(BASE.length - 1, Math.ceil((pointer.y + radius) / cellH));
    for (let r = r0; r <= r1; r++) {
      const line = BASE[r];
      const c0 = Math.max(0, Math.floor((pointer.x - radius) / cellW));
      const c1 = Math.min(line.length - 1, Math.ceil((pointer.x + radius) / cellW));
      for (let c = c0; c <= c1; c++) {
        // blanks keep the silhouette's shape; anything else off-alphabet is the
        // hidden message, which stays intact
        if (!ALPHABET.includes(line[c])) continue;
        const dx = (c + 0.5) * cellW - pointer.x;
        const dy = (r + 0.5) * cellH - pointer.y;
        const intensity = 1 - Math.hypot(dx, dy) / radius;
        if (intensity <= 0) continue; // outside: falls out of the map, reverts

        const key = r * STRIDE + c;
        const held = active.get(key);
        if (held !== undefined) {
          next.set(key, held);
        } else if (Math.random() < intensity * ONSET) {
          next.set(key, ALPHABET[(Math.random() * ALPHABET.length) | 0]);
        }
      }
    }
    active = next;
  }

  function paint(now) {
    const rows = new Map();
    for (const [key, ch] of active) {
      const r = (key / STRIDE) | 0;
      let chars = rows.get(r);
      if (!chars) rows.set(r, (chars = BASE[r].split("")));
      chars[key % STRIDE] = ch;
    }
    const out = BASE.slice();
    for (const [r, chars] of rows) out[r] = chars.join("");

    // mid-swap, a character shows a random glyph until its settle time passes
    const message = MESSAGES[msgIndex];
    if (swap && now - swap.tick >= CHURN_MS) {
      swap.tick = now;
      swap.noise = swap.noise.map(
        () => ALPHABET[(Math.random() * ALPHABET.length) | 0]
      );
    }
    const glyphs = message
      .split("")
      .map((ch, i) => (swap && now < swap.settle[i] ? swap.noise[i] : ch));
    const col = MSG_CENTER - (message.length >> 1);

    /* The message shows only where the radius reaches it. On a single row the
       intersection with a circle is one unbroken run, so the reveal is always a
       single highlighted slice. */
    let from = -1;
    let len = 0;
    const my = (MSG_ROW + 0.5) * cellH;
    for (let i = 0, first = -1; i < glyphs.length; i++) {
      const dx = (col + i + 0.5) * cellW - pointer.x;
      if (Math.hypot(dx, my - pointer.y) > radius) continue;
      if (first < 0) first = i;
      from = col + first;
      len = i - first + 1;
    }
    revealed = len;
    if (len) {
      const chars = out[MSG_ROW].padEnd(col + glyphs.length).split("");
      for (let i = 0; i < len; i++) chars[from + i] = glyphs[from - col + i];
      out[MSG_ROW] = chars.join("");
    }

    const text = out.join("\n");
    if (!len) {
      // Leaving the message's own region resets it, so it always opens on the
      // first line rather than on whatever it was last toggled to.
      msgIndex = 0;
      if (swapRaf) cancelAnimationFrame(swapRaf);
      swapRaf = 0;
      swap = null;
      parts = [{ t: text, hi: false }];
      return;
    }
    let at = from;
    for (let r = 0; r < MSG_ROW; r++) at += out[r].length + 1;
    parts = [
      { t: text.slice(0, at), hi: false },
      { t: text.slice(at, at + len), hi: true },
      { t: text.slice(at + len), hi: false },
    ];
  }

  /* Measured off a probe at a large size so rounding in the returned width is
     a negligible fraction of it. Font-independent, so it is only done once. */
  function measureAdvance() {
    const probe = document.createElement("span");
    probe.style.cssText = `position:absolute;left:-9999px;top:0;white-space:pre;font-family:${
      getComputedStyle(el).fontFamily
    };font-size:200px`;
    probe.textContent = "0".repeat(64);
    document.body.appendChild(probe);
    advance = probe.getBoundingClientRect().width / 64 / 200;
    probe.remove();
  }

  /* Safari on iOS grows and shrinks window.innerHeight as its bottom bar
     collapses and returns on scroll, so sizing the art off it would resize the
     portrait — and the loupe with it — mid-scroll. The large-viewport unit is
     defined against the bar-hidden layout and holds still through that, so the
     height comes off a probe measured in lvh instead. Fixed-positioned and zero
     width, so a full-viewport-tall box cannot extend the page's own scroll. */
  function viewportHeight() {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return h || window.innerHeight; // browsers predating lvh
  }

  /* Measured off the wrapper rather than 100vw, which on desktop includes the
     scrollbar and would push the art wider than the space it actually has.
     Floored so subpixel rounding cannot spill into a horizontal scrollbar. */
  function fit() {
    if (!el || !box) return;
    if (!advance) measureAdvance();
    const byWidth = box.getBoundingClientRect().width / COLS / advance;
    const byHeight = (viewportHeight() * MAX_VH) / ROWS;
    const size = Math.floor(Math.min(byWidth, byHeight) * 100) / 100;
    sizeCss = `${size}px`;
    radius = Math.round(size * RADIUS_EM);
  }

  /* Zoom fires this too, and changes everything the loupe depends on: the art
     resizes, so the radius and cell size change, and the element moves, so the
     stored element-local pointer position no longer points at the same place.
     Repainted here rather than waiting for the next pointermove — otherwise a
     reader zooming with the cursor held still sees the cursor's own ring resize
     around a patch of distortion that stayed the size it was. */
  function onResize() {
    clearTimeout(fitTimeout);
    fitTimeout = setTimeout(() => {
      // Only re-measured if it had been measured already, so a resize does not
      // switch the hover grid on for a reader who opted out of motion.
      const wasMeasured = cellW > 0;
      fit();
      if (wasMeasured) measure(); // font-size changed, so the cells did too
      if (pointer && lastClient) {
        const rect = el.getBoundingClientRect();
        pointer = { x: lastClient.x - rect.left, y: lastClient.y - rect.top };
        trackCursor();
        paint(performance.now());
      }
    }, 100);
  }

  onMount(() => {
    fit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  function onEnter() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    measure();
  }

  function onMove(e) {
    if (!cellW) return; // reduced motion, or entered before measuring
    // kept in client coords so the local position can be re-derived against a
    // new box after a resize or zoom, without waiting for another move
    lastClient = { x: e.clientX, y: e.clientY };
    const rect = el.getBoundingClientRect();
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    // coalesce bursts of pointermove into one redraw per frame
    if (!raf) raf = requestAnimationFrame(redraw);
  }

  /* Clicking swaps to the next message, but only while some of the current one
     is actually on screen — otherwise a click anywhere on the portrait would
     silently toggle something the reader cannot see. */
  function onClick() {
    if (!revealed) return;
    msgIndex = (msgIndex + 1) % MESSAGES.length;

    // stagger the settle times so the new text resolves left to right
    const now = performance.now();
    const n = MESSAGES[msgIndex].length;
    const settle = Array.from(
      { length: n },
      (_, i) => now + (i / n) * SWAP_MS * 0.6 + Math.random() * SWAP_MS * 0.4
    );
    swap = { settle, end: Math.max(...settle), noise: new Array(n).fill(" "), tick: 0 };
    if (!swapRaf) swapRaf = requestAnimationFrame(swapFrame);
  }

  function swapFrame(now) {
    swapRaf = 0;
    if (swap && now >= swap.end) swap = null;
    if (pointer) paint(now);
    if (swap) swapRaf = requestAnimationFrame(swapFrame);
  }

  function onLeave() {
    pointer = null;
    lastClient = null;
    msgIndex = 0;
    cancelAnimationFrame(raf);
    raf = 0;
    // let the swap finish in state, not on screen; msgIndex persists
    if (swapRaf) cancelAnimationFrame(swapRaf);
    swapRaf = 0;
    swap = null;
    revealed = 0;
    active = new Map();
    parts = [{ t: BASE.join("\n"), hi: false }];
  }

  // onDestroy also runs on the server, where cancelAnimationFrame is undefined.
  // These are only ever set from a browser event, so the guards cover both.
  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
    if (swapRaf) cancelAnimationFrame(swapRaf);
    clearTimeout(fitTimeout);
  });
</script>

<!-- Always stacked: the portrait closes the section, below the CTAs. -->
<div id="contact">
  <div>
    <h1 class="text-glacial-blue">
      <!-- Each line breaks at the width where it stops fitting: 374px, 409px -->
      <span class="flex flex-col gap-3.5 min-[410px]:gap-0">
        <span class="hidden min-[375px]:inline">Technology is neutral.</span>
        <span class="min-[375px]:hidden">Technology<br>is neutral.</span>
        <span class="hidden min-[410px]:inline">Let's use it for net good.</span>
        <span class="min-[410px]:hidden">Let's use it for<br>net good.</span>
      </span>
    </h1>
    <!-- Same card as /essays, so the two listings read as one thing -->
    <div class="my-9 md:my-11 lg:my-12">
      <div class="space-y-3 md:space-y-4">
        {#each recentEssays as essay}
          <a
            class="block group"
            href={`/essays/${essay.slug}`}
            data-sa-link-event="ctasection_recent_essay"
          >
            <div
              class="flex flex-col justify-between border border-white/10 rounded-3xl md:rounded-4xl px-5 py-4 md:px-6 md:py-5 xl:px-8 xl:py-7 hover:border-white/20 transition-colors"
            >
              <div class="flex-1 pr-0 md:pr-6">
                <h2
                  class="text-lg md:text-xl font-semibold text-white group-hover:text-glacial-blue transition-colors"
                >
                  {essay.title}
                </h2>
              </div>
              <div class="flex items-center gap-2 mt-1 md:mt-0.5">
                <p class="text-muted-text-grey text-xs md:text-sm shrink-0">
                  {essay.formattedDate}
                </p>
                {#if essay.publish === false}
                  <Icon name="lock" size="16px" class="shrink-0 text-muted-text-grey" />
                {/if}
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <PrimaryButton
        linkButtonContent={{
          label: "View all essays",
          destination: "/essays",
          mediaType: "read",
          eventName: "ctasection_essays_primary",
          openInNewTab: false,
        }}
        iconName="arrow-right"
        variant="glacial"
      />
      <PrimaryButton
        linkButtonContent={{
          label: "Book a 15 min call",
          destination: "https://cal.com/kevgug/intro",
          mediaType: "webpage",
          eventName: "ctasection_bookcall_secondary",
          openInNewTab: true,
        }}
      />
    </div>
  </div>
  <!-- No keyboard equivalent on purpose: the click only swaps one decorative
       message for another, and it is reachable solely by hovering a specific
       spot. Making the image focusable would put a stop in the tab order with
       nothing behind it. Screen readers get the aria-label either way. -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div bind:this={box} class="mt-20 md:mt-24">
    <pre
      bind:this={el}
      on:pointerenter={onEnter}
      on:pointermove={onMove}
      on:pointerleave={onLeave}
      on:click={onClick}
      data-cursor-field={radius}
      class="portrait"
      style="font-size: {sizeCss}"
      role="img"
      aria-label="Portrait of Kevin Gugelmann, drawn in text characters"
    >{#each parts as part}{#if part.hi}<span class="reveal">{part.t}</span>{:else}{part.t}{/if}{/each}</pre>
  </div>
</div>

<style lang="postcss">
  .portrait {
    /* The grid only holds if every glyph advances the same width, so the font
       stack must stay monospace all the way down to the generic keyword.
       Vertical margin comes from the my-* utilities, not from here. */
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    /* font-size is set inline: it is derived from the grid and the viewport. */
    line-height: 1;
    white-space: pre;
    /* The box would otherwise span the full column, and the hover region — the
       loupe cursor, and the pointer tracking behind it — would extend far past
       the artwork. Shrunk to the grid, so it ends where the art does. */
    width: fit-content;
    color: theme("colors.muted-text-grey");
    -webkit-user-select: none;
    user-select: none;
    cursor: default; /* not selectable, so an I-beam would be misleading */
  }

  .reveal {
    color: theme("colors.glacial-blue");
  }

  h1 {
    position: relative;
    font-size: 1.75rem;
  }
  @media (min-width: 360px) {
    h1 {
      font-size: calc(max(2rem, min(4rem, 7vw)));
    }
  }
  @media (min-width: 1536px) {
    h1 {
      font-size: 4rem;
    }
  }
</style>

