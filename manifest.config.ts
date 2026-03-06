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
			js: ['src/content-scripts/main.ts'],
			matches: ['https://www.youtube.com/*']
		}
	],
	background: {
		service_worker: 'src/service-worker/sw.ts',
		type: 'module'
	}
});
