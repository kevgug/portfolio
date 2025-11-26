<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import ChevronMorph from "$lib/components/ChevronMorph.svelte";
  import Icon, { type IconName } from "$lib/components/Icon.svelte";
  import { expoIn, expoOut, cubicOut, cubicIn } from "svelte/easing";
  import type { EasingFunction } from "svelte/transition";

  interface DropdownItem {
    label: string;
    icon?: IconName;
    iconOffsetY?: string;
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
  
  // === ANIMATION STATE ===
  // Compute the current item reactively - this ensures values are resolved before template renders
  $: currentItem = items.length > 0 && selectedIndex >= 0 && selectedIndex < items.length 
    ? items[selectedIndex] 
    : null;
  
  // Pre-compute display values for use in the animated block
  $: displayLabel = currentItem?.label ?? placeholder;
  $: displayIcon = currentItem?.icon ?? null;
  $: displayIconOffsetY = currentItem?.iconOffsetY ?? '0px';
  
  // Track items count to detect when items change (new essay loaded)
  let lastItemsLength = 0;
  let shouldAnimate = false;
  
  // Track direction for slide animation, and detect items changes
  let lastIndex = 0;
  let slideDirection: 'left' | 'right' = 'left';
  
  $: {
    // If items length changed, don't animate (new essay loading)
    if (items.length !== lastItemsLength) {
      lastItemsLength = items.length;
      lastIndex = selectedIndex;
      shouldAnimate = false;
    } else if (selectedIndex !== lastIndex && items.length > 0) {
      slideDirection = selectedIndex > lastIndex ? 'left' : 'right';
      lastIndex = selectedIndex;
      shouldAnimate = true;
    }
  }
  
  // Width animation for smooth resizing
  let labelContainerEl: HTMLDivElement | null = null;
  let measuredWidth: number | null = null;
  
  function measureWidth(node: Element) {
    requestAnimationFrame(() => {
      const width = node.getBoundingClientRect().width + 26; // +26 for chevron space
      if (measuredWidth !== null && labelContainerEl) {
        labelContainerEl.style.width = `${measuredWidth}px`;
        requestAnimationFrame(() => {
          if (labelContainerEl) labelContainerEl.style.width = `${width}px`;
        });
      } else if (labelContainerEl) {
        labelContainerEl.style.width = `${width}px`;
      }
      measuredWidth = width;
    });
  }

  // Blur slide transitions
  function blurIn(node: Element, { duration = 220, direction = 'left' }: { duration?: number; direction?: 'left' | 'right' } = {}) {
    const x = direction === 'left' ? 10 : -10;
    return {
      duration,
      css: (t: number) => {
        const e = cubicOut(t);
        return `opacity:${e}; filter:blur(${(1-e)*3}px); transform:translateX(${(1-e)*x}px);`;
      }
    };
  }

  function blurOut(node: Element, { duration = 180, direction = 'left' }: { duration?: number; direction?: 'left' | 'right' } = {}) {
    const x = direction === 'left' ? -10 : 10;
    return {
      duration,
      css: (t: number) => {
        const e = cubicIn(1-t);
        return `position:absolute; left:0; opacity:${t}; filter:blur(${e*3}px); transform:translateX(${e*x}px);`;
      }
    };
  }

  function updateMenuPosition() {
    if (!rootEl) return;
    const rect = rootEl.getBoundingClientRect();
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
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
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
        handleSelect(Math.min(selectedIndex + 1, items.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        handleSelect(Math.max(selectedIndex - 1, 0));
      }
    }
  }

  function onDocumentClick(event: MouseEvent) {
    if (rootEl && !rootEl.contains(event.target as Node)) close();
  }

  function handleWheel(event: WheelEvent) {
    if (!menuEl) return;
    const { scrollTop, scrollHeight, clientHeight } = menuEl;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight;
    if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) return;
    event.preventDefault();
  }

  function handleTouchMove(event: TouchEvent) {
    if (!menuEl) return;
    const { scrollHeight, clientHeight } = menuEl;
    if (scrollHeight > clientHeight) return;
    event.preventDefault();
  }

  function smoothTransition(
    node: Element,
    { duration, easing, y = 10, startScale = 0.98 }: { duration: number; easing: EasingFunction; y?: number; startScale?: number }
  ) {
    const transform = getComputedStyle(node).transform;
    const base = transform === "none" ? "" : transform;
    return {
      delay: 0,
      duration,
      easing,
      css: (t: number, u: number) => {
        const translateU = Math.pow(u, 5);
        const scaleT = Math.min(1, Math.max(0, t * 1.2 - 0.2));
        return `transform:${base} translateY(${translateU * y}px) scale(${startScale + (1 - startScale) * scaleT}); opacity:${t};`;
      },
    };
  }

  onMount(() => {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", updateMenuPosition);
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
    <div class="dropdown-label-container" bind:this={labelContainerEl}>
      {#if items.length > 0 && shouldAnimate}
        {#key selectedIndex}
          <div 
            class="dropdown-label-wrapper"
            use:measureWidth
            in:blurIn|local={{ duration: 220, direction: slideDirection }}
            out:blurOut|local={{ duration: 180, direction: slideDirection }}
          >
            {#if displayIcon}
              <span class="dropdown-icon" style="transform: translateY({displayIconOffsetY});">
                <Icon name={displayIcon} size="14px" class="shrink-0" />
              </span>
            {/if}
            <span class="dropdown-label">{displayLabel}</span>
          </div>
        {/key}
      {:else}
        <div class="dropdown-label-wrapper">
          {#if displayIcon}
            <span class="dropdown-icon" style="transform: translateY({displayIconOffsetY});">
              <Icon name={displayIcon} size="14px" class="shrink-0" />
            </span>
          {/if}
          <span class="dropdown-label">{displayLabel}</span>
        </div>
      {/if}
    </div>
    <span class="chevron-wrapper">
      <ChevronMorph {open} size="18px" />
    </span>
  </button>

  {#if open}
    <div
      class="dropdown-menu"
      role="listbox"
      bind:this={menuEl}
      on:wheel={handleWheel}
      on:touchmove={handleTouchMove}
      style="top:{menuTop}px; right:{menuRight}px;"
      in:smoothTransition={{ duration: 300, easing: expoOut }}
      out:smoothTransition={{ duration: 200, easing: expoIn }}
    >
      {#each items as item, i}
        <button
          role="option"
          aria-selected={i === selectedIndex}
          class="dropdown-option {i === selectedIndex ? 'is-active' : ''}"
          on:click={() => handleSelect(i)}
        >
          <span class="option-dot {i === selectedIndex ? 'bg-white' : 'bg-white/40'}" aria-hidden="true" />
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
    @apply relative inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 backdrop-blur-md transition-colors;
    background: color-mix(in oklab, rgb(255 255 255 / 22%), transparent);
  }

  .dropdown-trigger:hover {
    background: color-mix(in oklab, rgb(255 255 255 / 28%), transparent);
  }

  .dropdown-label-container {
    @apply relative flex items-center overflow-hidden pr-[26px];
    transition: width 220ms cubic-bezier(0.33, 1, 0.68, 1);
    mask-image: linear-gradient(to right, black calc(100% - 26px), transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black calc(100% - 26px), transparent 100%);
  }

  .dropdown-label-wrapper {
    @apply flex items-center gap-1.5 will-change-transform;
  }

  .dropdown-icon {
    @apply ml-0.5;
    color: #BDBDBE;
  }

  .dropdown-trigger:hover .dropdown-icon {
    @apply text-white;
  }

  .dropdown-label {
    @apply text-sm md:text-base whitespace-nowrap max-w-[60vw] md:max-w-none truncate;
  }

  .chevron-wrapper {
    @apply absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center text-white/80 pointer-events-none;
  }

  .dropdown-menu {
    @apply fixed z-50 min-w-[min(90vw,28rem)] max-w-[90vw] max-h-[60vh] overflow-auto rounded-2xl border border-white/10 shadow-xl p-1;
    background: rgb(20, 21, 24);
  }

  .dropdown-option {
    @apply w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 focus:outline-none transition-colors;
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

  /* Subtle variant */
  .dropdown-root.is-subtle .dropdown-trigger {
    @apply border-white/5 px-3 py-1.5 text-white/70 backdrop-blur-md;
    background: color-mix(in oklab, rgb(255 255 255 / 10%), transparent);
  }
  .dropdown-root.is-subtle .dropdown-trigger:hover {
    background: color-mix(in oklab, rgb(255 255 255 / 16%), transparent);
    @apply text-white;
  }
  .dropdown-root.is-subtle .dropdown-icon {
    color: #BDBDBE;
  }
  .dropdown-root.is-subtle .dropdown-trigger:hover .dropdown-icon {
    @apply text-white;
  }
  .dropdown-root.is-subtle .dropdown-label {
    @apply text-sm;
  }
  .dropdown-root.is-subtle .chevron-wrapper {
    @apply text-white/70 right-3;
  }
</style>
