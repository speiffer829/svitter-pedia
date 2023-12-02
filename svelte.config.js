import { vitePreprocess } from '@sveltejs/kit/vite';
// import { imagetools } from 'vite-imagetools';
import adapter from '@sveltejs/adapter-netlify';
// import adapter from '@sveltejs/adapter-static';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter(),
	},

	preprocess: [vitePreprocess({})],
};

export default config;
