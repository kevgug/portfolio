import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";
// const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(), // to enable processing <style> blocks as PostCSS
  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    paths: {
      // INSTRUCTION: only include below if not using custom domain
      // base: dev ? '' : '/portfolio',
    },
    appDir: "internal",
  },
};

export default config;
