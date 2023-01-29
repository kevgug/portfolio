import { tailwindTheme } from "$lib/tailwindTheme";

export enum BreakpointSizes {
	sm, md, lg, xl, '2xl'
}

interface Breakpoints {
	[key: string]: string;
}
  
const breakpoints: Breakpoints = tailwindTheme.screens;

export const getCurrentBreakpoint = (width: number): BreakpointSizes => {
	let largestBreakpoint: keyof Breakpoints = 'sm';
	let largestBreakpointWidth: number = 0;
	for (let key in breakpoints) {
		let breakpointWidth = parseInt(breakpoints[key].slice(0, -2));
		if (breakpointWidth > largestBreakpointWidth && breakpointWidth <= width) {
		largestBreakpoint = key as keyof Breakpoints;
		largestBreakpointWidth = breakpointWidth;
		}
	}
	return BreakpointSizes[largestBreakpoint as keyof typeof BreakpointSizes];
}