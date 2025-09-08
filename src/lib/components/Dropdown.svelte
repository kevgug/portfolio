<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import ChevronMorph from "$lib/components/ChevronMorph.svelte";
  import { expoIn, expoOut } from "svelte/easing";
  import type { EasingFunction } from "svelte/transition";

  interface DropdownItem {
    label: string;
  }

  export let items: DropdownItem[] = [];
  export let selectedIndex: number = 0;
  export let placeholder: string = "Select";
  export let variant: "default" | "subtle" = "default";

  const dispatch = createEventDispatcher<{ select: { index: number } }>();

  let open = false;
  let rootEl: HTMLDivElement | null = null;
  let menuEl: HTMLDivElement | null = null;
  let menuTop = 0;
  let menuRight = 0;

  function updateMenuPosition() {
    if (!rootEl) return;
    const rect = rootEl.getBoundingClientRect();
    // Space the menu a bit below the trigger and align its right edge
    menuTop = rect.bottom + 8;
    menuRight = Math.max(window.innerWidth - rect.right, 8);
  }

  function toggleOpen() {
    open = !open;
    if (open) updateMenuPosition();
  }

  function close() {
    open = false;
  }

  function handleSelect(index: number) {
    selectedIndex = index;
    dispatch("select", { index });
    close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (
      !open &&
      (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")
    ) {
      event.preventDefault();
      open = true;
      return;
    }
    if (open) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = Math.min(selectedIndex + 1, items.length - 1);
        handleSelect(next);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prev = Math.max(selectedIndex - 1, 0);
        handleSelect(prev);
      }
    }
  }

  function onDocumentClick(event: MouseEvent) {
    if (!rootEl) return;
    const target = event.target as Node;
    if (!rootEl.contains(target)) close();
  }

  function smoothTransition(
    node: Element,
    {
      duration,
      easing,
      y = 10,
      startScale = 0.98,
    }: {
      duration: number;
      easing: EasingFunction;
      y?: number;
      startScale?: number;
    }
  ) {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    return {
      delay: 0,
      duration,
      easing,
      css: (t: number, u: number) => {
        // Use a steeper, custom curve for translation independent of the main easing
        const translateU = Math.pow(u, 5);
        // Stagger the scale animation to feel distinct from the fade/translate
        const scaleT = Math.min(1, Math.max(0, t * 1.2 - 0.2));

        return `
          transform: ${transform} translateY(${translateU * y}px) scale(${
          startScale + (1 - startScale) * scaleT
        });
          opacity: ${t};
        `;
      },
    };
  }

  onMount(() => {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", updateMenuPosition);
    // capture scrolls from any scrollable ancestor/window
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  });
</script>

<div
  class="dropdown-root {variant === 'subtle' ? 'is-subtle' : ''}"
  bind:this={rootEl}
>
  <button
    type="button"
    class="dropdown-trigger"
    aria-haspopup="listbox"
    aria-expanded={open}
    on:click={toggleOpen}
  >
    <span class="dropdown-label"
      >{items[selectedIndex]?.label ?? placeholder}</span
    >
    <span class="chevron-wrapper">
      <ChevronMorph {open} size="18px" />
    </span>
  </button>

  {#if open}
    <div
      class="dropdown-menu"
      role="listbox"
      bind:this={menuEl}
      on:wheel|preventDefault
      on:touchmove|preventDefault
      style={`top:${menuTop}px; right:${menuRight}px;`}
      in:smoothTransition={{ duration: 300, easing: expoOut }}
      out:smoothTransition={{ duration: 200, easing: expoIn }}
    >
      {#each items as item, i}
        <button
          role="option"
          aria-selected={i === selectedIndex}
          class={`dropdown-option ${i === selectedIndex ? "is-active" : ""}`}
          on:click={() => handleSelect(i)}
        >
          <span
            class={`option-dot ${
              i === selectedIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-hidden="true"
          />
          <span class="option-label">{item.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .dropdown-root {
    @apply relative;
  }

  .dropdown-trigger {
    @apply inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 backdrop-blur-md transition-colors;
    background: color-mix(in oklab, rgb(255 255 255 / 22%), transparent);
  }

  .dropdown-trigger:hover {
    background: color-mix(in oklab, rgb(255 255 255 / 28%), transparent);
  }

  .dropdown-label {
    @apply text-sm md:text-base whitespace-nowrap max-w-[60vw] md:max-w-none truncate;
  }

  .chevron-wrapper {
    @apply inline-flex items-center text-white/80;
  }

  .dropdown-menu {
    @apply fixed z-50 min-w-[min(90vw,28rem)] max-w-[90vw] max-h-[60vh] overflow-auto rounded-2xl border border-white/10 shadow-xl p-1;
    background: rgb(20, 21, 24);
  }

  .dropdown-option {
    @apply w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 focus:outline-none transition-colors;
  }

  .dropdown-option.is-active {
    @apply text-white bg-white/10;
  }

  .option-dot {
    @apply w-1.5 h-1.5 rounded-full;
  }

  .option-label {
    @apply text-sm md:text-base truncate;
  }

  /* Subtle variant for low-prominence trigger (e.g., essay reader) */
  .dropdown-root.is-subtle .dropdown-trigger {
    @apply border-white/5 px-3 py-1.5 text-white/70 backdrop-blur-md;
    background: color-mix(in oklab, rgb(255 255 255 / 10%), transparent);
  }
  .dropdown-root.is-subtle .dropdown-trigger:hover {
    background: color-mix(in oklab, rgb(255 255 255 / 16%), transparent);
    @apply text-white;
  }
  .dropdown-root.is-subtle .dropdown-label {
    @apply text-xs md:text-sm;
  }
  .dropdown-root.is-subtle .chevron-wrapper {
    @apply text-white/70;
  }
</style>
