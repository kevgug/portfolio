import type { PageLoad } from "./$types";
import "$lib/essays-reload"; // Import to trigger HMR when essays update
import { loadEssayIndex } from "$lib/essays/load";

export interface EssayListItem {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  publish?: boolean;
}

export const load: PageLoad = async () => {
  const posts = (await loadEssayIndex()) as EssayListItem[];
  posts.forEach((post) => {
    post.formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  });
  return { posts };
};
