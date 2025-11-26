import { writable, type Writable } from "svelte/store";

export interface EssaySubheader {
  id: string; // element id to scroll to
  label: string; // display label
  icon?: string;
  iconOffsetY?: string;
}

export const subheaders: Writable<EssaySubheader[]> = writable([]);
export const selectedIndex: Writable<number> = writable(0);
export const scrollLock: Writable<boolean> = writable(false);

export function setSubheaders(list: EssaySubheader[]): void {
  console.log('[STORE] setSubheaders called with', list.length, 'items:', list.map(s => s.label));
  subheaders.set(list);
  console.log('[STORE] Setting selectedIndex to 0');
  selectedIndex.set(0);
}

export function selectIndex(index: number): void {
  selectedIndex.update((current) => {
    return index < 0 ? 0 : index;
  });
}

export async function withScrollLock<T>(
  action: () => Promise<T> | T,
  extraReleaseDelayMs: number = 180
): Promise<T> {
  scrollLock.set(true);
  try {
    const result = await action();
    // Allow inertial scroll/paint to settle before re-enabling
    await new Promise((resolve) => setTimeout(resolve, extraReleaseDelayMs));
    return result;
  } finally {
    scrollLock.set(false);
  }
}
