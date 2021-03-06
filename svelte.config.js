import preprocess from 'svelte-preprocess';
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
	preprocess: [preprocess()],
};

export default config;
