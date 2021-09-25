import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-netlify';
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter()
	},
	preprocess: preprocess()
};

export default config;
