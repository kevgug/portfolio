import { writable } from 'svelte/store';

// Store to track when the hero section layout has been calculated
// This prevents layout shift by hiding the entire UI until ready
export const layoutReady = writable(false);

