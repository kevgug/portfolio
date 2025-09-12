import { quadIn, quadOut } from "svelte/easing";
import type { EasingFunction, TransitionConfig } from "svelte/transition";

interface ScaleFadeParams {
  delay?: number;
  duration?: number;
  start?: number;
  opacity?: number;
  scaleEasing?: EasingFunction;
  fadeEasing?: EasingFunction;
}

export function scaleFade(
  node: Element,
  {
    delay = 0,
    duration = 400,
    start = 0,
    opacity = 0,
    scaleEasing = quadIn,
    fadeEasing = quadOut,
  }: ScaleFadeParams = {}
): TransitionConfig {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;

  const od = target_opacity - opacity;
  const sd = 1 - start;

  return {
    delay,
    duration,
    css: (t, u) => {
      const scale_t = scaleEasing(t);
      const fade_t = fadeEasing(t);
      const scale_u = 1 - scale_t;
      const fade_u = 1 - fade_t;

      return `
        transform: ${transform} scale(${1 - sd * scale_u});
        opacity: ${target_opacity - od * fade_u}
      `;
    },
  };
}
