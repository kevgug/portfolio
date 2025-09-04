import type { PageLoad } from "./$types";
import { parseMarkdown } from "$lib/blog/parse";

export const load: PageLoad = async ({ params, fetch }) => {
  const { slug } = params;
  const res = await fetch(`/blog/${slug}.md`);
  if (!res.ok) {
    return { post: null };
  }
  const md = await res.text();
  const post = parseMarkdown(md);
  return { slug, post };
};

