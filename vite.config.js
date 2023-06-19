import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config = {
	plugins: [sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			devOptions: {
			  enabled: true
			},
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
			manifest: {
			  name: 'Highlighter',
			  short_name: 'Highlighter',
			  description: 'Your data. Highlighted',
			  theme_color: '#ffffff',
			  icons: [
				{
				  src: 'pwa-192x192.png',
				  sizes: '192x192',
				  type: 'image/png'
				},
				{
				  src: 'pwa-512x512.png',
				  sizes: '512x512',
				  type: 'image/png'
				},
				{
				  src: 'pwa-512x512.png',
				  sizes: '512x512',
				  type: 'image/png',
				  purpose: 'any'
				},
				{
				  src: 'pwa-512x512.png',
				  sizes: '512x512',
				  type: 'image/png',
				  purpose: 'maskable'
				}
			  ]
			}
		  })],
	optimizeDeps: {
		exclude: ['bytemd']
	}
};

export default config;
