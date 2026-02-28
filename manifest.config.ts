import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json';

export default defineManifest({
	manifest_version: 3,
	name: pkg.name,
	version: pkg.version,
	permissions: ['tabs'],
	host_permissions: ['https://www.youtube.com/*'],
	icons: {
		48: 'public/logo.png'
	},
	action: {
		default_icon: {
			48: 'public/logo.png'
		}
	},
	content_scripts: [
		{
			js: ['src/content-scripts/home/main.ts'],
			matches: ['https://www.youtube.com/']
		},
		{
			js: ['src/content-scripts/search/main.ts'],
			matches: ['https://www.youtube.com/results*']
		},
		{
			js: ['src/content-scripts/watch-main/main.ts'],
			matches: ['https://www.youtube.com/watch*']
		},
		{
			js: ['src/content-scripts/watch-sidebar/main.ts'],
			matches: ['https://www.youtube.com/watch*']
		}
	],
	background: {
		service_worker: 'src/service-worker/sw.ts',
		type: 'module'
	}
});
