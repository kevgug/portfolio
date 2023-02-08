import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
const dev = process.argv.includes('dev');
 
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      // INSTRUCTION: only include below if not using custom domain
      // base: dev ? '' : '/portfolio',
    },
    appDir: 'internal',
  },
  preprocess: vitePreprocess() // to enable processing <style> blocks as PostCSS
};

export default config;