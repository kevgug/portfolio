import type { PageServerLoad } from "./$types";
import { parseMarkdown } from "$lib/essays/parse";
import { error } from "@sveltejs/kit";
import {
  loadEssayIndex,
  loadEssayMarkdown,
  loadEssayAudioConfig,
  loadEssayCodeConfig,
} from "$lib/essays/load";
import "$lib/essays-reload"; // Import to trigger HMR when essays update

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { slug } = params;

  try {
    const essays = await loadEssayIndex(fetch);
    const essayMeta = essays.find((essay) => essay.slug === slug);

    if (!essayMeta) {
      throw error(404, "Essay not found");
    }

    const md = await loadEssayMarkdown(slug, fetch);

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
