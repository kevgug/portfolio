<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "./Icon.svelte";
  import ChevronMorph from "./ChevronMorph.svelte";
  import { expoIn, expoOut } from "svelte/easing";
  import type { EasingFunction } from "svelte/transition";

  export let variant: "default" | "glacial" = "glacial";
  export let avatarSrc: string | undefined = undefined;

  let open = false;
  let rootEl: HTMLDivElement | null = null;
  let menuEl: HTMLDivElement | null = null;

  function toggleOpen() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function onDocumentClick(event: MouseEvent) {
    if (rootEl && !rootEl.contains(event.target as Node)) close();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (open && event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  function smoothTransition(
    node: Element,
    { duration, easing, y = 8, startScale = 0.96 }: { duration: number; easing: EasingFunction; y?: number; startScale?: number }
  ) {
    return {
      delay: 0,
      duration,
      easing,
      css: (t: number, u: number) => {
        const translateU = Math.pow(u, 4);
        const scaleT = Math.min(1, Math.max(0, t * 1.2 - 0.2));
        return `transform: translateY(${translateU * y}px) scale(${startScale + (1 - startScale) * scaleT}); opacity: ${t};`;
      },
    };
  }

  onMount(() => {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="contact-button-root" bind:this={rootEl}>
  <button
    type="button"
    class="contact-button"
    class:contact-button--glacial={variant === "glacial"}
    class:is-open={open}
    aria-haspopup="true"
    aria-expanded={open}
    on:click={toggleOpen}
  >
    {#if avatarSrc}
      <img src={avatarSrc} alt="" class="avatar" />
    {/if}
    <span>Contact me</span>
    <span class="chevron-wrapper">
      <ChevronMorph {open} size="0.75em" />
    </span>
  </button>

  {#if open}
    <div
      class="contact-menu"
      bind:this={menuEl}
      in:smoothTransition={{ duration: 250, easing: expoOut }}
      out:smoothTransition={{ duration: 180, easing: expoIn }}
    >
      <a
        href="https://cal.com/kevgug/intro"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-option"
        data-sa-link-event="contact_ext_cal"
        on:click={close}
      >
        <span class="option-icon">
          <Icon name="phone" size="16px" />
        </span>
        <span class="option-label">Schedule a call</span>
      </a>
      <a
        href="mailto:kevin@kevingugelmann.com"
        class="contact-option"
        data-sa-link-event="contact_email"
        on:click={close}
      >
        <span class="option-icon">
          <Icon name="email" size="16px" />
        </span>
        <span class="option-label">Send email</span>
      </a>
    </div>
  {/if}
</div>

<style lang="postcss">
  .contact-button-root {
    @apply relative inline-block;
  }

  .contact-button {
    @apply flex flex-row items-center;
    background: transparent;
    border: 1px solid #5a5a5a;
    @apply text-white;
    @apply rounded-full;
    @apply pl-1.5 pr-4 md:pl-2 md:pr-6;
    @apply py-1.5 md:py-2;
    @apply transition-all duration-200 ease-outro;
    @apply cursor-pointer;
  }

  .avatar {
    @apply w-7 h-7 md:w-8 md:h-8;
    @apply rounded-full object-cover;
    @apply mr-2 md:mr-2.5;
    border: 1px solid rgba(30, 58, 95, 0.3);
  }

  .contact-button--glacial {
    @apply text-black bg-glacial-blue;
    @apply border-solid border-[1px] border-white/40;
  }

  .contact-button:hover {
    box-shadow: rgba(213, 219, 218, 0.15) 0 8px 28px;
    @apply border-[#a7a7a7];
  }

  .contact-button--glacial:hover {
    @apply opacity-90;
    @apply border-white/70;
  }

  .contact-button:active {
    @apply opacity-75;
  }

  .contact-button.is-open {
    @apply opacity-90;
  }

  .chevron-wrapper {
    @apply pl-[0.52rem] md:pl-[0.6rem] pr-[0.04rem] md:pr-[0.1rem];
    @apply inline-flex items-center pointer-events-none;
  }

  .contact-menu {
    @apply absolute left-0 top-full mt-2 z-50;
    @apply min-w-[180px];
    @apply rounded-xl;
    @apply border border-white/10;
    @apply p-1.5;
    @apply shadow-xl;
    background: rgb(20, 21, 24);
    transform-origin: top left;
  }

  .contact-option {
    @apply flex items-center gap-3;
    @apply w-full px-3.5 py-2.5;
    @apply rounded-lg;
    @apply text-white/90;
    @apply transition-colors duration-150;
    @apply no-underline;
  }

  .contact-option:hover {
    @apply bg-white/10 text-white;
  }

  .option-icon {
    @apply flex items-center justify-center;
    @apply w-5 h-5;
    @apply text-white/60;
  }

  .contact-option:hover .option-icon {
    @apply text-white;
  }

  .option-label {
    @apply text-sm md:text-base;
  }
</style>

