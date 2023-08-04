import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			strategies: 'generateSW',
		})
	],
	optimizeDeps: {
	}
};

export default config;
