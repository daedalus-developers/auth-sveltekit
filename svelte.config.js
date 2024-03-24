import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development' ? false : true;
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'@server': './src/lib/server',
			'@components': './src/lib/components',
			'@utils': './src/lib/utils',
			'@types': './src/lib/types',
			'@stores': './src/lib/stores',
			'@authActions': './src/routes/(public)/(auth)/actions/'
		},
		csrf: { checkOrigin: dev }
	}
};

export default config;
