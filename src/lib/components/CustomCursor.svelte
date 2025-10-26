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
  let isMobile = false;
  let isOutsideWindow = false;

  // Detect if device is mobile/touch device
  function detectMobile(): boolean {
    if (!browser) return false;
    
    // Check for touch support
    const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     (navigator as any).msMaxTouchPoints > 0;
    
    // Check user agent for mobile keywords
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);
    
    return hasTouch || isMobileUA;
  }

  // Smooth interpolation with extrapolation for ultra-smooth movement
  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  onMount(() => {
    if (!browser) return;

    // Check if device is mobile
    isMobile = detectMobile();
    
    // Don't initialize custom cursor on mobile devices
    if (isMobile) {
      mounted = false;
      return;
    }

    // Add custom cursor style to hide default cursor
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = 'body, html, * { cursor: none !important; }';
    document.head.appendChild(style);

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
      
      // Check if it's a clickable element
      const isClickable = 
                          (target.tagName === 'A' && target.getAttribute('href') !== null) || 
                          target.tagName === 'BUTTON' ||
                          target.closest('a[href], button') !== null;
      
      // Check if it's selectable text or an input element
      const hasTextContent = Boolean(target.textContent);
      const isTextElement = target.tagName === 'P' ||
                            target.tagName === 'SPAN' ||
                            target.tagName === 'H1' ||
                            target.tagName === 'H2' ||
                            target.tagName === 'H3' ||
                            target.tagName === 'H4' ||
                            target.tagName === 'H5' ||
                            target.tagName === 'H6' ||
                            target.tagName === 'STRONG' ||
                            target.tagName === 'EM' ||
                            target.tagName === 'B' ||
                            target.tagName === 'I' ||
                            target.tagName === 'U' ||
                            target.tagName === 'MARK' ||
                            target.tagName === 'SMALL' ||
                            target.tagName === 'DEL' ||
                            target.tagName === 'INS' ||
                            target.tagName === 'SUB' ||
                            target.tagName === 'SUP' ||
                            target.tagName === 'ABBR' ||
                            target.tagName === 'CITE' ||
                            target.tagName === 'CODE' ||
                            target.tagName === 'KBD' ||
                            target.tagName === 'SAMP' ||
                            target.tagName === 'VAR' ||
                            target.tagName === 'TIME' ||
                            target.tagName === 'Q' ||
                            target.tagName === 'BLOCKQUOTE' ||
                            target.tagName === 'PRE' ||
                            target.tagName === 'DT' ||
                            target.tagName === 'LABEL';
      const isInputElement = target.tagName === 'INPUT' || 
                            target.tagName === 'TEXTAREA';
      const isSelectableText = !isClickable && 
                              (isTextElement || isInputElement)
                              && hasTextContent;
      
      isPointer = isClickable;
      isText = isSelectableText && !isClickable;
    };

    // Handle when cursor leaves the window
    const handleMouseLeave = () => {
      isOutsideWindow = true;
    };

    // Handle when cursor enters the window
    const handleMouseEnter = () => {
      isOutsideWindow = false;
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
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Remove custom cursor style on cleanup
      const style = document.getElementById('custom-cursor-style');
      if (style) {
        style.remove();
      }
    };
  });
</script>

{#if mounted && !isMobile}
  <div
    class="custom-cursor"
    class:is-text={isText}
    class:is-outside={isOutsideWindow}
    style="
      left: {cursorX}px;
      top: {cursorY}px;
      width: {isPointer ? '40px' : isText ? '2px' : '12px'};
      height: {isPointer ? '40px' : isText ? '22px' : '12px'};
      opacity: {isOutsideWindow ? '0' : isPointer ? '0.3' : '1'};
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
    transform: translate(-50%, -50%) scale(1);
    box-sizing: content-box;
    will-change: transform, width, height, opacity, border-radius;
    transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1),
                height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1),
                opacity 0s,
                border-radius 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1),
                background-color 0.3s ease-out,
                border 0.3s ease-out,
                box-shadow 0.3s ease-out,
                transform 0s;
  }

  .custom-cursor.is-outside {
    transform: translate(-50%, -50%) scale(0);
  }
</style>

