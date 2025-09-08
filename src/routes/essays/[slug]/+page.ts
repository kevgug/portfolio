import type { PageLoad } from "./$types";
import { parseMarkdown } from "$lib/essays/parse";
import { error } from "@sveltejs/kit";

export const prerender = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const { slug } = params;

  // Fetch essay metadata from index
  const indexRes = await fetch("/essays/index.json");
  if (!indexRes.ok) {
    throw error(404, "Essay not found");
  }
  const essays = await indexRes.json();
  const essayMeta = essays.find((essay: any) => essay.slug === slug);

  if (!essayMeta) {
    throw error(404, "Essay not found");
  }

  // Fetch and parse markdown content
  const mdRes = await fetch(`/essays/${slug}.md`);
  if (!mdRes.ok) {
    throw error(404, "Essay not found");
  }
  const md = await mdRes.text();
  const post = parseMarkdown(md, essayMeta.title, essayMeta.date);
  return { slug, post };
};
