<script lang="ts">
  import { gsap } from "gsap";
  import { onMount, onDestroy } from "svelte";
  import Image from "$lib/components/Image.svelte";
  import type { ImageOptions } from "$lib/util/image";

  export let imageOptions: ImageOptions | null = null;
  export let isVisible = false;
  export let mouseX = 0;
  export let mouseY = 0;
  export let projectId: string | null = null;

  let containerElement: HTMLDivElement;
  let screenHeight = 0;
  let previousProjectId: string | null = null;
  let floatingImageHeight = 220; // Default height
  let displayImageOptions: ImageOptions | null = null;

  $: if (imageOptions) {
    displayImageOptions = imageOptions;
  }

  // Calculate smart positioning based on cursor location
  $: isInTopHalf = mouseY < screenHeight / 2;
  $: cardOffsetX = -160; // Center the card horizontally on cursor
  $: cardOffsetY = isInTopHalf ? 60 : -(floatingImageHeight + 60); // Below cursor if top half, above if bottom half

  onMount(() => {
    // Hide it off-screen initially to prevent any flash at (0,0)
    gsap.set(containerElement, { x: -1000, y: -1000, opacity: 0 });
  });

  // Main reactive logic for animations and positioning
  $: {
    if (containerElement) {
      if (isVisible && imageOptions && mouseX > 0 && mouseY > 0 && projectId) {
        // --- Entrance / Change ---
        if (projectId !== previousProjectId) {
          previousProjectId = projectId;
          gsap.killTweensOf(containerElement);
          // Set the initial state for the entrance animation at the current cursor-calculated position
          gsap.set(containerElement, {
            x: mouseX + cardOffsetX,
            y: mouseY + cardOffsetY,
            scale: 0.7,
            opacity: 0,
            rotation: -2,
          });
          // Animate the properties for appearance
          gsap.to(containerElement, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: "expo.out",
          });
        }

        // --- Continuous Positioning ---
        // This tween always runs while visible to follow the mouse smoothly.
        // It won't cause a jump on entrance because we `set` the position just before.
        gsap.to(containerElement, {
          x: mouseX + cardOffsetX,
          y: mouseY + cardOffsetY,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        // --- Exit ---
        if (previousProjectId !== null) {
          previousProjectId = null;
          gsap.killTweensOf(containerElement);
          gsap.to(containerElement, {
            scale: 0.7,
            opacity: 0,
            rotation: 2,
            duration: 0.16,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(containerElement, { x: -1000, y: -1000 });
            },
          });
        }
      }
    }
  }

  onDestroy(() => {
    gsap.killTweensOf(containerElement);
  });
</script>

<svelte:window bind:innerHeight={screenHeight} />

{#if displayImageOptions}
  <div bind:this={containerElement} class="floating-project-image">
    <div class="image-wrapper">
      <Image imgOptions={displayImageOptions} class="project-preview-image" />
    </div>
  </div>
{/if}

<style>
  .floating-project-image {
    position: fixed;
    z-index: 1000;
    pointer-events: none;
    width: 320px;
    /* height is now auto to adapt to content */
    height: auto;
    will-change: transform, opacity;
    /* Use transform for positioning instead of left/top */
    top: 0;
    left: 0;
    /* Start with 0 opacity to prevent flash, onMount will move it off-screen */
    opacity: 0;
  }

  .image-wrapper {
    width: 100%;
    /* height is now auto to adapt to content */
    height: auto;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgb(46, 45, 48);
    position: relative;
  }

  .image-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  :global(.project-preview-image) {
    width: 100%;
    /* height is auto to maintain aspect ratio */
    height: auto;
    /* max-height ensures tall images are capped */
    max-height: 220px;
    object-fit: cover;
    position: relative;
    z-index: 0;
    display: block;
    background-color: #000;
  }

  /* Hover effects now enabled on all viewport sizes */
</style>
