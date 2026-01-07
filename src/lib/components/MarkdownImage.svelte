<script lang="ts">
  import { marked } from "$lib/util/marked";
  import { onMount } from "svelte";

  export let slug: string;
  export let path: string;
  export let alt: string;
  export let caption: string | undefined = undefined;

  // Parse query parameters from path (e.g., image.png?bg=white or image.png?bg=ff0000)
  $: [cleanPath, queryString] = path.includes('?') ? path.split('?') : [path, ''];
  $: params = new URLSearchParams(queryString);
  $: bgParam = params.get('bg');
  $: mainColorParam = params.get('mainColor');
  
  // Helper: parse hex to RGB
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const match = hex.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (!match) return null;
    let h = match[1];
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    const num = parseInt(h, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  
  // Helper: RGB to HSL
  function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h, s, l };
  }
  
  // Helper: HSL to RGB
  function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
  
  // Helper: RGB to hex (with optional alpha for RGBA)
  function rgbToHex(r: number, g: number, b: number, a?: number): string {
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    if (a !== undefined) {
      const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
      return hex + alphaHex;
    }
    return hex;
  }
  
  // Parse background color - supports "white" keyword or hex colors (with or without #)
  // mainColor derives a dark saturated bg from the hue
  // Also derives a matching border color
  $: ({ bgColor: customBgColor, borderColor: customBorderColor } = (() => {
    // Error if both params are specified
    if (mainColorParam && bgParam) {
      throw new Error(`Image "${path}": Cannot specify both 'mainColor' and 'bg' parameters. Use one or the other.`);
    }
    
    // mainColor: derive bg with L=0.05, S=0.8 from the given color's hue
    // Border uses same hue but L=0.2, S=0.2 (subtle, similar to separator-grey)
    if (mainColorParam) {
      const rgb = hexToRgb(mainColorParam);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        // If original saturation is very low (grayscale), keep it gray
        const isGray = hsl.s < 0.1;
        const bgRgb = hslToRgb(hsl.h, isGray ? 0 : 0.8, 0.05);
        const borderRgb = hslToRgb(hsl.h, isGray ? 0 : 0.1, 0.2);
        return {
          bgColor: rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b),
          borderColor: rgbToHex(borderRgb.r, borderRgb.g, borderRgb.b, 0.7)
        };
      }
    }
    
    // bg param
    if (!bgParam) return { bgColor: null, borderColor: null };
    if (bgParam === 'white') {
      return { bgColor: '#ffffff', borderColor: '#e5e5e5b3' };
    }
    // Check if it's a valid hex color (3 or 6 chars, with or without #)
    const hexMatch = bgParam.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      const bgHex = `#${hexMatch[1]}`;
      const rgb = hexToRgb(bgHex);
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        // Derive border with same hue, L=0.2, low saturation, 70% opacity
        const borderS = hsl.s < 0.1 ? 0 : 0.1;
        const borderRgb = hslToRgb(hsl.h, borderS, 0.2);
        return {
          bgColor: bgHex,
          borderColor: rgbToHex(borderRgb.r, borderRgb.g, borderRgb.b, 0.7)
        };
      }
      return { bgColor: bgHex, borderColor: null };
    }
    return { bgColor: null, borderColor: null };
  })());

  // Ensure path starts with / for proper static asset resolution
  $: imageSrc = cleanPath.startsWith('/') ? cleanPath : `/assets/essays/${slug}/images/${cleanPath}`;
  
  // Check if the image is an SVG
  $: isSvg = cleanPath.toLowerCase().endsWith('.svg');
  
  // SVG content for inline rendering
  let svgContent: string | null = null;
  let svgError = false;
  
  // Track if image is height-constrained
  let isHeightConstrained = false;
  let imgElement: HTMLImageElement;
  
  function checkHeightConstraint() {
    if (!imgElement) return;
    
    const naturalAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const renderedAspect = imgElement.clientWidth / imgElement.clientHeight;
    
    // If rendered aspect ratio is wider than natural, image is height-constrained
    isHeightConstrained = renderedAspect > naturalAspect * 1.01;
  }
  
  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      checkHeightConstraint();
    });
    
    if (imgElement) {
      resizeObserver.observe(imgElement);
    }
    
    return () => resizeObserver.disconnect();
  });
  
  // Fetch SVG content when path changes
  $: if (isSvg && imageSrc) {
    fetchSvgContent(imageSrc);
  }
  
  async function fetchSvgContent(src: string) {
    try {
      svgError = false;
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status}`);
      }
      const text = await response.text();
      // Basic validation that it's actually SVG content
      if (text.includes('<svg')) {
        svgContent = text;
      } else {
        throw new Error('Invalid SVG content');
      }
    } catch (e) {
      console.error('Error loading SVG:', e);
      svgError = true;
      svgContent = null;
    }
  }
  
  // Parse caption as inline markdown
  $: parsedCaption = caption ? (marked.parseInline(caption) as string) : undefined;
</script>

<figure class="w-full max-w-screen-md mx-auto my-8">
  {#if isSvg && svgContent}
    <div 
      class="svg-container rounded-lg border border-separator-grey/50 overflow-hidden max-h-[calc(60vh+2rem)] p-4" 
      style:background-color={customBgColor}
      style:border-color={customBorderColor}
      role="img" 
      aria-label={alt}
    >
      {@html svgContent}
    </div>
  {:else}
    <div 
      class="image-wrapper rounded-lg border border-separator-grey/50 overflow-hidden"
      class:height-constrained={isHeightConstrained}
      style:background-color={customBgColor}
      style:border-color={customBorderColor}
    >
      <img
        bind:this={imgElement}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        on:load={checkHeightConstraint}
        class="w-full h-auto max-h-[60vh] object-contain"
        class:mx-auto={isHeightConstrained}
      />
    </div>
  {/if}
  {#if parsedCaption}
    <figcaption class="mt-3 text-center">
      <p class="text-sm text-muted-text-grey font-serif">
        {@html parsedCaption}
      </p>
    </figcaption>
  {/if}
</figure>

<style lang="postcss">
  .svg-container {
    @apply w-full h-auto bg-[#111015];
  }
  
  .svg-container :global(svg) {
    @apply w-full h-auto max-h-[60vh] block;
  }
  
  .image-wrapper {
    @apply w-full;
  }
  
  .image-wrapper.height-constrained {
    @apply max-h-[60vh] bg-[#111015];
  }
  
  figcaption :global(a) {
    @apply text-muted-text-grey text-sm;
    background-image: linear-gradient(to right, #C1C1C1, #C1C1C1);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 100% 1px;
    text-decoration: none;
    transition: background-size 0.2s ease, background-image 0.2s ease, color 0.2s ease;
  }

  figcaption :global(a:hover) {
    color: black;
    background-image: linear-gradient(to right, #ffffff, #ffffff);
    background-size: 100% 100%;
  }
</style>
