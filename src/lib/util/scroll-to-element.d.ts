declare module "scroll-to-element" {
  interface ScrollToOptions {
    ease?: string;
    align?: "top" | "middle" | "bottom";
    duration?: number;
    offset?: number;
  }

  function scrollTo(
    elem: HTMLElement | string,
    options?: ScrollToOptions
  ): void;

  export default scrollTo;
}
