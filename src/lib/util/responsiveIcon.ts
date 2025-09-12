import { tailwindTheme } from "$lib/tailwindTheme";
import { BreakpointSizes, getCurrentBreakpoint } from "./breakpoints";

export enum SmFontSize {
  xs,
  sm,
  base,
  lg,
  xl,
  "2xl",
}

const pxPerRem = 16;
const remToPx = (remStr: string) => {
  const rem = remStr.split("rem")[0];
  return `${parseFloat(rem) * pxPerRem}px`;
};

export function responsiveIconSize(
  smFontSize: SmFontSize,
  screenWidth: number
) {
  const breakpoint: BreakpointSizes = getCurrentBreakpoint(screenWidth);
  switch (smFontSize) {
    case SmFontSize.xs:
      switch (breakpoint) {
        case BreakpointSizes.sm:
          return remToPx(tailwindTheme.fontSize.xs);
        default:
          return remToPx(tailwindTheme.fontSize.sm);
      }
    case SmFontSize.sm:
      switch (breakpoint) {
        case BreakpointSizes.sm:
          return remToPx(tailwindTheme.fontSize.sm);
        default:
          return remToPx(tailwindTheme.fontSize.base);
      }
    case SmFontSize.base:
      switch (breakpoint) {
        case BreakpointSizes.sm:
          return remToPx(tailwindTheme.fontSize.base);
        default:
          return remToPx(tailwindTheme.fontSize.lg);
      }
    case SmFontSize.lg:
      switch (breakpoint) {
        case BreakpointSizes.sm:
          return remToPx(tailwindTheme.fontSize.lg);
        default:
          return remToPx(tailwindTheme.fontSize.xl);
      }
    case SmFontSize.xl:
      switch (breakpoint) {
        case BreakpointSizes.sm:
          return remToPx(tailwindTheme.fontSize.xl);
        default:
          return remToPx(tailwindTheme.fontSize["2xl"]);
      }
    case SmFontSize["2xl"]:
      switch (breakpoint) {
        case BreakpointSizes.sm:
          return remToPx(tailwindTheme.fontSize["2xl"]);
        case BreakpointSizes.md:
          return remToPx(tailwindTheme.fontSize["3xl"]);
        default:
          return remToPx(tailwindTheme.fontSize["4xl"]);
      }
    default:
      return remToPx("1rem");
  }
}
