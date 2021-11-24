import preprocess from 'svelte-preprocess'
// import { imagetools } from 'vite-imagetools';
import adapter from '@sveltejs/adapter-netlify';
import path from 'path';
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter(),
	},
	preprocess: [preprocess()]
}

export default config;
