import preprocess from 'svelte-preprocess'
// import { imagetools } from 'vite-imagetools';
import adapter from '@sveltejs/adapter-netlify';
import path from 'path';
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter(),
		vite: {
			define: {
				'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString())
			},
			// plugins: [imagetools({ force: true })],
			// assetsInclude: ['static/**/*']
		}
	},
	preprocess: [preprocess()]
};

export default config;
