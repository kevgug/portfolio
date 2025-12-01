<script lang="ts">
  import { onDestroy } from "svelte";
  import type { TransitionConfig } from "svelte/transition";
  import Icon from "./Icon.svelte";

  export let code: string;
  export let audio: string | undefined;
  export let slug: string;
  export let copyable: boolean = false;

  // Custom crossfade blur transition like Vercel
  function blurFade(
    _node: Element,
    { duration = 150, blur = 4 }: { duration?: number; blur?: number } = {}
  ): TransitionConfig {
    return {
      duration,
      css: (t: number) => {
        const eased = t;
        return `
          opacity: ${eased};
          filter: blur(${(1 - eased) * blur}px);
        `;
      },
    };
  }

  // Animation timing constants
  const FADE_OUT_DURATION_MS = 240;
  const EXTRA_ANIMATION_DURATION_MS = 550;
  const FADE_OUT_DELAY_MS = 90;

  // Copy timing constants
  const TOAST_DURATION_MS = 2000;
  const ICON_EXTRA_DURATION_MS = 100;

  let audioElement: HTMLAudioElement | null = null;
  let isPlaying = false;
  let progress = 0; // 0 to 100
  let audioDuration = 0;
  let fadeOutTimeout: number | null = null;
  let progressResetTimeout: number | null = null;

  // Copy functionality
  let showToast = false;
  let isCopied = false;
  let toastTimeout: ReturnType<typeof setTimeout> | null = null;
  let copyIconTimeout: ReturnType<typeof setTimeout> | null = null;
  let activeIcon: "copy" | "check" = "copy";
  let showIcon = true;
  let pendingIcon: "copy" | "check" | null = null;

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      // Clear any existing timeouts
      if (toastTimeout !== null) {
        clearTimeout(toastTimeout);
      }
      if (copyIconTimeout !== null) {
        clearTimeout(copyIconTimeout);
      }

      // Show copied state and toast
      isCopied = true;
      showToast = true;

      // Hide the toast after TOAST_DURATION_MS
      toastTimeout = setTimeout(() => {
        showToast = false;
        toastTimeout = null;
      }, TOAST_DURATION_MS);

      // Reset icon after toast disappears plus extra duration
      copyIconTimeout = setTimeout(() => {
        isCopied = false;
        copyIconTimeout = null;
      }, TOAST_DURATION_MS + ICON_EXTRA_DURATION_MS);
    }).catch((error) => {
      console.error("Failed to copy code:", error);
    });
  }

  $: {
    const targetIcon = isCopied ? "check" : "copy";
    if (targetIcon !== activeIcon) {
      pendingIcon = targetIcon;
      if (showIcon) {
        showIcon = false;
      }
    }
  }

  function handleIconOutroEnd() {
    if (pendingIcon) {
      activeIcon = pendingIcon;
      pendingIcon = null;
      showIcon = true;
    }
  }

  function handlePlay() {
    if (!audio || !slug) return;

    // Cleanup existing element if it exists to avoid Safari replay delays
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }

    // Clear any existing timeouts
    if (fadeOutTimeout !== null) {
      clearTimeout(fadeOutTimeout);
      fadeOutTimeout = null;
    }
    if (progressResetTimeout !== null) {
      clearTimeout(progressResetTimeout);
      progressResetTimeout = null;
    }
    
    // Always create a new audio element
    const currentAudio = new Audio(`/assets/essays/${slug}/audio/${audio}`);
    audioElement = currentAudio;
    
    currentAudio.addEventListener("error", () => {
      if (audioElement === currentAudio) {
        isPlaying = false;
        progress = 0;
        console.error(`Failed to load audio: /assets/essays/${slug}/audio/${audio}`);
      }
    });
    
    // Reset animation immediately
    progress = 0;
    isPlaying = false;
    
    // Force a reflow to ensure the reset is applied
    requestAnimationFrame(() => {
      // Start playback from beginning
      currentAudio.play()
        .then(() => {
          // Guard against race conditions if played again rapidly
          if (audioElement !== currentAudio) return;

          // Update duration just in case it wasn't ready before
          if (currentAudio.duration && !isNaN(currentAudio.duration)) {
            audioDuration = currentAudio.duration;
          }

          // Start animation on next frame to ensure scaleX(0) is rendered first
          requestAnimationFrame(() => {
            if (audioElement !== currentAudio) return;
            
            isPlaying = true;
            progress = 1; // Non-zero to trigger animating class
            
            // Schedule fade-out after: audioDuration + extra animation + delay
            if (audioDuration > 0) {
              const fadeOutDelay = (audioDuration * 1000) + EXTRA_ANIMATION_DURATION_MS + FADE_OUT_DELAY_MS;
              fadeOutTimeout = window.setTimeout(() => {
                isPlaying = false;
                fadeOutTimeout = null;
                
                // Reset progress bar width to 0 after fade-out completes
                progressResetTimeout = window.setTimeout(() => {
                  progress = 0;
                  progressResetTimeout = null;
                }, FADE_OUT_DURATION_MS);
              }, fadeOutDelay);
            }
          });
        })
        .catch((error) => {
          if (audioElement === currentAudio) {
            console.error("Error playing audio:", error);
            isPlaying = false;
            progress = 0;
          }
        });
    });
  }

  onDestroy(() => {
    if (fadeOutTimeout !== null) {
      clearTimeout(fadeOutTimeout);
      fadeOutTimeout = null;
    }
    if (progressResetTimeout !== null) {
      clearTimeout(progressResetTimeout);
      progressResetTimeout = null;
    }
    if (toastTimeout !== null) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }
    if (copyIconTimeout !== null) {
      clearTimeout(copyIconTimeout);
      copyIconTimeout = null;
    }
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
  });
</script>

{#if audio || copyable}
  <span class="inline-code-wrapper">
    <span 
      class="progress-bar" 
      style="--audio-duration: {audioDuration + (EXTRA_ANIMATION_DURATION_MS / 1000)}s; --fade-out-duration: {FADE_OUT_DURATION_MS}ms;"
      class:visible={isPlaying}
      class:animating={progress > 0 && audioDuration > 0}
    />
    <code class="inline-code">{code}</code>
    {#if audio}
      <button
        class="play-button"
        on:click={handlePlay}
        aria-label="Play audio"
        type="button"
      >
        <Icon name="play" size="10px" />
      </button>
    {:else}
      <button
        class="copy-button"
        class:copied={isCopied}
        on:click={handleCopy}
        aria-label={isCopied ? "Copied" : "Copy code"}
        type="button"
      >
        {#if showIcon}
          <span
            class="icon-transition"
            on:outroend={handleIconOutroEnd}
            out:blurFade={{ duration: 120, blur: 4 }}
            in:blurFade={{ duration: 120, blur: 4 }}
          >
            <Icon name={activeIcon} size="14px" />
          </span>
        {/if}
      </button>
    {/if}
  </span>

  {#if showToast}
    <div
      class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#3D3D3D]/80 backdrop-blur-md text-white py-3 px-6 rounded-xl text-sm font-medium z-50 shadow-lg toast-animate"
    >
      Code copied
    </div>
  {/if}
{:else}
  <code class="plain-inline-code">{code}</code>
{/if}

<style lang="postcss">
  .inline-code-wrapper {
    @apply inline-flex items-center gap-1.5 rounded-full;
    position: relative;
    background-color: rgba(203, 213, 225, 0.05);
    padding: calc(0.2rem - 1px) 0.4rem;
    @apply border border-glacial-blue/20;
    transition: border-color 200ms ease-in-out;
    isolation: isolate;
    overflow: hidden;
  }

  .inline-code-wrapper:has(.play-button:hover),
  .inline-code-wrapper:has(.copy-button:hover) {
    @apply border-glacial-blue;
  }

  /* Override border colors in footnotes section */
  :global(#section-notes) .inline-code-wrapper {
    @apply border-white/20;
  }

  :global(#section-notes) .inline-code-wrapper:has(.play-button:hover),
  :global(#section-notes) .inline-code-wrapper:has(.copy-button:hover) {
    @apply border-white/70;
  }

  .progress-bar {
    @apply rounded-full;
    position: absolute;
    inset: 0;
    width: 100%;
    background-color: rgba(169, 244, 233, 0.16);
    opacity: 0;
    transform: scaleX(0) translateZ(0);
    transform-origin: left;
    transition: opacity var(--fade-out-duration, 180ms) ease-in-out,
      transform 50ms cubic-bezier(0.42, 0, 1, 1);
    pointer-events: none;
    will-change: transform;
    z-index: 0;
  }

  /* Override progress bar color in footnotes section */
  :global(#section-notes) .progress-bar {
    background-color: rgba(255, 255, 255, 0.16);
  }

  .progress-bar.visible {
    opacity: 1;
  }

  .progress-bar.animating {
    transform: scaleX(1) translateZ(0);
    transition: opacity var(--fade-out-duration, 50ms) ease-in-out,
      transform var(--audio-duration, 1s) cubic-bezier(0.3,0.36,0.25,1);
  }

  .inline-code {
    @apply text-white;
    font-size: 0.9em;
    padding-left: 1px;
    position: relative;
    transform: translateZ(0);
    z-index: 1;
    transition: color 100ms ease-in-out;
  }

  /* Animate inline-code to white when play or copy button is hovered */
  .inline-code-wrapper:has(.play-button:hover) .inline-code,
  .inline-code-wrapper:has(.copy-button:hover) .inline-code {
    @apply text-white !important;
  }

  /* Override color in footnotes section */
  :global(#section-notes) .inline-code {
    @apply text-muted-text-grey;
  }

  .play-button {
    @apply inline-flex items-center justify-center;
    @apply border-none p-0 cursor-pointer;
    @apply text-glacial-blue/90;
    background-color: transparent;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    padding-right: 2px;
    margin-left: 1px;
    margin-right: 1px;
    transition: color 100ms ease-in-out;
    position: relative;
    transform: translateZ(0);
    z-index: 2;
  }

  .play-button:hover {
    @apply text-glacial-blue;
  }

  /* Override play button color in footnotes section */
  :global(#section-notes) .play-button {
    @apply text-white/90;
  }

  :global(#section-notes) .play-button:hover {
    @apply text-white;
  }

  .play-button :global(svg) {
    @apply w-full h-full;
  }

  .copy-button {
    @apply inline-flex items-center justify-center;
    @apply border-none p-0 cursor-pointer;
    @apply text-glacial-blue/90;
    background-color: transparent;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    padding-right: 2px;
    margin-left: 1px;
    margin-right: 1px;
    transition: color 100ms ease-in-out;
    position: relative;
    transform: translateZ(0);
    z-index: 2;
  }

  .copy-button:hover {
    @apply text-glacial-blue;
  }

  .copy-button.copied {
    @apply text-white !important;
  }

  /* Override copy button color in footnotes section */
  :global(#section-notes) .copy-button {
    @apply text-white/90;
  }

  :global(#section-notes) .copy-button:hover {
    @apply text-white;
  }

  .copy-button :global(svg) {
    @apply w-full h-full;
  }

  .icon-transition {
    @apply inline-flex items-center justify-center;
  }

  /* Plain inline code without any button - default styling */
  .plain-inline-code {
    @apply text-glacial-blue;
    background-color: rgba(203, 213, 225, 0.05);
    padding: 0.2rem 0.4rem;
    border-radius: 0.5rem;
    font-size: 0.9em;
  }

  /* Override plain inline code color in footnotes section */
  :global(#section-notes) .plain-inline-code {
    @apply text-white;
  }

  .toast-animate {
    animation: toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards,
      toast-out 0.3s cubic-bezier(0.9, 0, 0.51, 1) 1.7s forwards;
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  @keyframes toast-out {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px) scale(0.95);
    }
  }
</style>

