import type { PageLoad } from "./$types";
import { parseMarkdown } from "$lib/essays/parse";

export const load: PageLoad = async ({ params, fetch }) => {
  const { slug } = params;
  const res = await fetch(`/essays/${slug}.md`);
  if (!res.ok) {
    return { post: null };
  }
  const md = await res.text();
  const post = parseMarkdown(md);
  return { slug, post };
};
