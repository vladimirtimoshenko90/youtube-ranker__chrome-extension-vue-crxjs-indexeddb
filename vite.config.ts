import { name, version } from './package.json';

import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import manifest from './manifest.config.ts';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import zip from 'vite-plugin-zip-pack';

export default defineConfig({
	resolve: {
		alias: {
			'@': `${path.resolve(__dirname, 'src')}`
		}
	},
	plugins: [vue(), crx({ manifest }), zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` })],
	build: {
		rollupOptions: {
			input: {
				overview: 'src/pages/overview/overview.html',
				'author-overview': 'src/pages/author-overview/author-overview.html'
			}
		}
	},
	server: {
		cors: {
			origin: [/chrome-extension:\/\//]
		}
	}
});
