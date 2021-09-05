import preprocess from 'svelte-preprocess'
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},
	preprocess: preprocess()
};

export default config;
