export interface EssayMetadata {
  slug: string;
  title: string;
  date: string;
  publish?: boolean;
  hasConfig?: boolean;
}

export async function loadEssayIndex(
  fetch?: typeof globalThis.fetch
): Promise<EssayMetadata[]> {
  if (!fetch) {
    throw new Error("fetch is required to load essay index");
  }
  const res = await fetch("/essays/index.json");
  if (!res.ok) {
    throw new Error("Essay index not found");
  }
  return await res.json();
}

export async function loadEssayMarkdown(
  slug: string,
  fetch?: typeof globalThis.fetch
): Promise<string> {
  if (!fetch) {
    throw new Error("fetch is required to load essay markdown");
  }
  const res = await fetch(`/essays/${slug}.md`);
  if (!res.ok) {
    throw new Error(`Essay "${slug}" not found`);
  }
  return await res.text();
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
