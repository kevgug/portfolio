import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
const dev = process.argv.includes('dev');
 
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: dev ? '' : '/portfolio',
    },
    appDir: 'internal',
  },
  preprocess: vitePreprocess() // to enable processing <style> blocks as PostCSS
};

export default config;