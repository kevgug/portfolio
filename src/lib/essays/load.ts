export interface EssayMetadata {
  slug: string;
  title: string;
  date: string;
  publish?: boolean;
  hasConfig?: boolean;
}

// Use Vite's import.meta.glob to load essays from content directory
const essayModules = import.meta.glob("/src/content/essays/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

// Load essay index from content directory
import essayIndexData from "$content/essays/index.json";

export async function loadEssayIndex(
  _fetch?: typeof globalThis.fetch
): Promise<EssayMetadata[]> {
  return essayIndexData as EssayMetadata[];
}

export async function loadEssayMarkdown(
  slug: string,
  _fetch?: typeof globalThis.fetch
): Promise<string> {
  const modulePath = `/src/content/essays/${slug}.md`;
  const loader = essayModules[modulePath];

  if (!loader) {
    throw new Error(`Essay "${slug}" not found`);
  }

  return await loader();
}

export async function loadEssayAudioConfig(
  slug: string,
  fetch?: typeof globalThis.fetch
): Promise<{ [code: string]: string }> {
  // Audio config is still in static/assets, so we need fetch to access it
  if (!fetch) {
    return {};
  }
  try {
    const configRes = await fetch(`/assets/essays/${slug}/config.json`, {
      // Don't throw on 404 - config is optional
      headers: { Accept: "application/json" },
    });
    if (configRes.ok) {
      const configData = await configRes.json();
      return configData.audio || {};
    }
    // Return empty config for 404 or any other non-ok status
    return {};
  } catch {
    // Config file doesn't exist or fetch failed, which is fine - audio is optional
    return {};
  }
}

export async function loadEssayCodeConfig(
  slug: string,
  fetch?: typeof globalThis.fetch
): Promise<Set<string>> {
  // Code config is in static/assets, so we need fetch to access it
  if (!fetch) {
    return new Set();
  }
  try {
    const configRes = await fetch(`/assets/essays/${slug}/config.json`, {
      // Don't throw on 404 - config is optional
      headers: { Accept: "application/json" },
    });
    if (configRes.ok) {
      const configData = await configRes.json();
      // Convert code array to Set for O(1) lookup
      const codeArray: string[] = configData.code || [];
      return new Set(codeArray);
    }
    // Return empty Set for 404 or any other non-ok status
    return new Set();
  } catch {
    // Config file doesn't exist or fetch failed, which is fine - code config is optional
    return new Set();
  }
}
