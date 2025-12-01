import type { PageLoad } from "./$types";
import { parseMarkdown } from "$lib/essays/parse";
import { error } from "@sveltejs/kit";
import {
  loadEssayIndex,
  loadEssayMarkdown,
  loadEssayAudioConfig,
  loadEssayCodeConfig,
} from "$lib/essays/load";
import "$lib/essays-reload"; // Import to trigger HMR when essays update

export const load: PageLoad = async ({ params, fetch }) => {
  // Note: fetch is still used for audio config from static/assets
  const { slug } = params;

  try {
    // Load essay metadata from index
    const essays = await loadEssayIndex(fetch);
    const essayMeta = essays.find((essay) => essay.slug === slug);

    if (!essayMeta) {
      throw error(404, "Essay not found");
    }

    // Load and parse markdown content
    const md = await loadEssayMarkdown(slug, fetch);

    // Load audio and code config only if the essay has a config file
    const [audioConfig, codeConfig] = essayMeta.hasConfig
      ? await Promise.all([
          loadEssayAudioConfig(slug, fetch),
          loadEssayCodeConfig(slug, fetch),
        ])
      : [{}, new Set<string>()];

    const post = parseMarkdown(
      md,
      essayMeta.title,
      essayMeta.date,
      audioConfig,
      codeConfig
    );
    return { slug, post, publish: essayMeta.publish };
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    throw error(404, "Essay not found");
  }
};
