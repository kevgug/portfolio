<script lang="ts">
  import { onDestroy } from "svelte";
  import Icon from "./Icon.svelte";

  export let code: string;
  export let audio: string | undefined;
  export let slug: string;

  // Animation timing constants
  const FADE_OUT_DURATION_MS = 250;
  const EXTRA_ANIMATION_DURATION_MS = 550;
  const FADE_OUT_EARLY_START_MS = 100;
  const PROGRESS_BAR_FIRST_PLAY_DELAY_MS = 200;
  const PROGRESS_BAR_START_DELAY_MS = 650;

  // Copy timing constants
  const TOAST_DURATION_MS = 2000;
  const ICON_EXTRA_DURATION_MS = 100;

  let audioElement: HTMLAudioElement | null = null;
  let isPlaying = false;
  let progress = 0; // 0 to 100
  let audioDuration = 0;
  let fadeOutTimeout: number | null = null;
  let progressBarDelayTimeout: number | null = null;
  let hasPlayedOnce = false;

  // Copy functionality
  let showToast = false;
  let isCopied = false;
  let toastTimeout: ReturnType<typeof setTimeout> | null = null;
  let copyIconTimeout: ReturnType<typeof setTimeout> | null = null;

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

  function handlePlay() {
    if (!audio || !slug) return;

    // Create audio element if it doesn't exist
    if (!audioElement) {
      audioElement = new Audio(`/assets/essays/${slug}/audio/${audio}`);
      
      audioElement.addEventListener("loadedmetadata", () => {
        if (audioElement) {
          audioDuration = audioElement.duration;
        }
      });
      
      audioElement.addEventListener("error", () => {
        isPlaying = false;
        progress = 0;
        console.error(`Failed to load audio: /assets/essays/${slug}/audio/${audio}`);
      });
    }

    // Clear any existing timeouts
    if (fadeOutTimeout !== null) {
      clearTimeout(fadeOutTimeout);
      fadeOutTimeout = null;
    }
    if (progressBarDelayTimeout !== null) {
      clearTimeout(progressBarDelayTimeout);
      progressBarDelayTimeout = null;
    }
    
    // Reset animation immediately
    progress = 0;
    isPlaying = false;
    
    // Force a reflow to ensure the reset is applied
    requestAnimationFrame(() => {
      // Start playback
      audioElement!.currentTime = 0;
      audioElement!.play().catch((error) => {
        console.error("Error playing audio:", error);
        isPlaying = false;
        progress = 0;
      });
      
      // Delay progress bar animation - shorter delay on first play, longer on subsequent plays
      const delay = hasPlayedOnce ? PROGRESS_BAR_START_DELAY_MS : PROGRESS_BAR_FIRST_PLAY_DELAY_MS;
      progressBarDelayTimeout = window.setTimeout(() => {
        // Start animation on next frame to ensure scaleX(0) is rendered first
        requestAnimationFrame(() => {
          isPlaying = true;
          progress = 1; // Non-zero to trigger animating class
          progressBarDelayTimeout = null;
          hasPlayedOnce = true;
          
          // Schedule fade-out after: audioDuration + extra animation - early start
          if (audioDuration > 0) {
            const fadeOutDelay = (audioDuration * 1000) + EXTRA_ANIMATION_DURATION_MS - FADE_OUT_EARLY_START_MS;
            fadeOutTimeout = window.setTimeout(() => {
              isPlaying = false;
              fadeOutTimeout = null;
            }, fadeOutDelay);
          }
        });
      }, delay);
    });
  }

  onDestroy(() => {
    if (fadeOutTimeout !== null) {
      clearTimeout(fadeOutTimeout);
      fadeOutTimeout = null;
    }
    if (progressBarDelayTimeout !== null) {
      clearTimeout(progressBarDelayTimeout);
      progressBarDelayTimeout = null;
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
      {#key isCopied}
        <Icon name={isCopied ? "check" : "copy"} size="14px" />
      {/key}
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
      transform var(--audio-duration, 1s) cubic-bezier(0.38, 0.81, 0.25, 1);
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

