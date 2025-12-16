import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

// Disable prerendering - this route only handles runtime redirects
export const prerender = false;

export const load: PageLoad = async ({ params }) => {
  // Redirect /essays/meritocracy.md → /essays/meritocracy
  throw redirect(301, `/essays/${params.slug}`);
};
