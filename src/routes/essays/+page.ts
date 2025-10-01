import type { PageLoad } from "./$types";

export interface EssayListItem {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
}

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch("/essays/index.json");
  if (!res.ok) {
    return { posts: [] as EssayListItem[] };
  }
  const posts = (await res.json()) as EssayListItem[];
  posts.forEach((post) => {
    post.formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  });
  return { posts };
};
