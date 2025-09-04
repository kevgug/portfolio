import type { PageLoad } from "./$types";

export interface BlogListItem {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch("/blog/index.json");
  if (!res.ok) {
    return { posts: [] as BlogListItem[] };
  }
  const posts = (await res.json()) as BlogListItem[];
  return { posts };
};

