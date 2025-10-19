<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;
  let isPointer = false;
  let isText = false;
  let mounted = false;

  // Smooth interpolation with extrapolation for ultra-smooth movement
  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  onMount(() => {
    if (!browser) return;

    mounted = true;
    let animationFrameId: number;
    let lastTime = performance.now();

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Detect when cursor is over clickable elements or text
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      
      // Check if it's a clickable element
      const isClickable = computedStyle.cursor === 'pointer' || 
                          target.tagName === 'A' || 
                          target.tagName === 'BUTTON' ||
                          target.closest('a, button') !== null;
      
      // Check if it's selectable text or an input element
      const hasTextContent = Boolean(target.textContent);
      const isInputElement = target.tagName === 'INPUT' || 
                            target.tagName === 'TEXTAREA';
      
      const isSelectableText = !isClickable && 
                              (isInputElement || (hasTextContent && computedStyle.cursor !== 'default'));
      
      isPointer = isClickable;
      isText = isSelectableText && !isClickable;
    };

    // Animation loop with extrapolation
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Smooth factor - higher = faster following (adjusted for 60fps baseline)
      const smoothFactor = Math.min(deltaTime / 10, 1);
      
      // Extrapolation - predict slightly ahead for ultra-smooth feel
      const velocityX = (targetX - cursorX) * 0.15;
      const velocityY = (targetY - cursorY) * 0.15;
      const extrapolatedX = targetX + velocityX;
      const extrapolatedY = targetY + velocityY;

      // Smooth interpolation towards extrapolated position
      cursorX = lerp(cursorX, extrapolatedX, smoothFactor);
      cursorY = lerp(cursorY, extrapolatedY, smoothFactor);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize cursor position
    const initCursor = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      targetX = e.clientX;
      targetY = e.clientY;
      window.removeEventListener('mousemove', initCursor);
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', initCursor, { once: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });
</script>

<svelte:head>
  <style>
    * {
      cursor: none !important;
    }
  </style>
</svelte:head>

{#if mounted}
  <div
    class="custom-cursor"
    class:is-text={isText}
    style="
      left: {cursorX}px;
      top: {cursorY}px;
      width: {isPointer ? '40px' : isText ? '2px' : '12px'};
      height: {isPointer ? '40px' : isText ? '22px' : '12px'};
      opacity: {isPointer ? '0.3' : '1'};
      border-radius: {isText ? '2px' : '50%'};
      background-color: {isText ? 'black' : 'white'};
      border: {isText ? '1px solid white' : '1px solid none'};
      mix-blend-mode: {isText ? 'normal' : 'difference'};
      box-shadow: {isText ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0), 0 0 0 1px rgba(255, 255, 255, 0)'};
    "
  />
{/if}

<style>
  .custom-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-sizing: content-box;
    will-change: transform, width, height, opacity, border-radius;
    transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1),
                height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1),
                opacity 0.3s ease-out,
                border-radius 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1),
                background-color 0.3s ease-out,
                border 0.3s ease-out,
                box-shadow 0.3s ease-out;
  }
</style>

