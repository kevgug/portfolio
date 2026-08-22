/**
 * Svelte action that reports an element's layout width and keeps reporting it
 * as the element resizes.
 *
 * Use this instead of `bind:clientWidth` on anything sized by an image. Svelte 3
 * implements that binding with a hidden iframe whose load is asynchronous, so an
 * image that finishes decoding before the iframe attaches its listener is
 * measured at 0 and never measured again — leaving an arbitrary, per-page-load
 * handful of elements stuck at a width of zero. ResizeObserver reports the
 * current size as soon as it starts observing, so there is nothing to race.
 */
export const observeWidth = (
  node: HTMLElement,
  onWidth: (width: number) => void
) => {
  const measure = () => onWidth(node.clientWidth);
  measure();

  // `load` doesn't bubble, but a capture listener on the container still sees
  // the image's. Covers browsers without ResizeObserver.
  node.addEventListener("load", measure, true);

  let observer: ResizeObserver | undefined;
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(measure);
    observer.observe(node);
  } else {
    window.addEventListener("resize", measure);
  }

  return {
    destroy() {
      node.removeEventListener("load", measure, true);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    },
  };
};
