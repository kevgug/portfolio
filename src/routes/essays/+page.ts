import type { PageLoad } from "./$types";

export interface EssayListItem {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch("/essays/index.json");
  if (!res.ok) {
    return { posts: [] as EssayListItem[] };
  }
  const posts = (await res.json()) as EssayListItem[];
  return { posts };
};
