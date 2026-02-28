import { Component, createApp } from 'vue';

export function mountMyApp(root: Component, props?: any) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const app = createApp(root, props);
	app.mount(container);
}
