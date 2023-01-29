import { tailwindTheme } from "$lib/tailwindTheme";
import { BreakpointSizes, getCurrentBreakpoint } from "./breakpoints";

export enum SmFontSize {
	xs, sm, base, lg, xl, '2xl'
}

export function responsiveIconSize(smFontSize: SmFontSize, screenWidth: number) {
	const breakpoint: BreakpointSizes = getCurrentBreakpoint(screenWidth);
    switch (smFontSize) {
		case SmFontSize.xs:
			switch (breakpoint) {
				case BreakpointSizes.sm:
					return tailwindTheme.fontSize.xs;
				default:
					return tailwindTheme.fontSize.sm;
			}
        case SmFontSize.sm:
			switch (breakpoint) {
				case BreakpointSizes.sm:
					return tailwindTheme.fontSize.sm;
				case BreakpointSizes.md:
					return tailwindTheme.fontSize.base;
				default:
					return tailwindTheme.fontSize.lg;
			}
        case SmFontSize.base:
            switch (breakpoint) {
				case BreakpointSizes.sm:
					return tailwindTheme.fontSize.base;
				default:
					return tailwindTheme.fontSize.lg;
			}
        case SmFontSize.lg:
            switch (breakpoint) {
				case BreakpointSizes.sm:
					return tailwindTheme.fontSize.lg;
				default:
					return tailwindTheme.fontSize.xl;
			}
        case SmFontSize.xl:
            switch (breakpoint) {
				case BreakpointSizes.sm:
					return tailwindTheme.fontSize.xl;
				default:
					return tailwindTheme.fontSize["2xl"];
			}
        case SmFontSize["2xl"]:
            switch (breakpoint) {
				case BreakpointSizes.sm:
					return tailwindTheme.fontSize["2xl"];
				case BreakpointSizes.md:
					return tailwindTheme.fontSize["3xl"];
				default:
					return tailwindTheme.fontSize["4xl"];
			}
        default:
            return '1rem';
    }
}