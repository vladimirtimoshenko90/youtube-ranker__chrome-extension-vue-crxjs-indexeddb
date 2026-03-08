import VideoRatingsInject, { RatingsInjectContext } from './VideoRatingsInject.vue';

import { createApp } from 'vue';

function sanitizeVideoUrl(url: string): string {
	try {
		const parsed = new URL(url);
		const v = parsed.searchParams.get('v');
		const clean = new URL(parsed.origin + parsed.pathname);
		if (v) clean.searchParams.set('v', v);
		return clean.toString();
	} catch {
		return url;
	}
}

export function injectRatings(
	el_injectInto: Element,
	context: RatingsInjectContext,
	readOnly: boolean,
	videoInfo: {
		videoUrl: string;
		videoTitle: string;
		authorUrl: string | null;
		authorName: string;
	}
): void {
	const el_root = document.createElement('div');
	el_injectInto.appendChild(el_root);

	const app = createApp(VideoRatingsInject, {
		...videoInfo,
		videoUrl: sanitizeVideoUrl(videoInfo.videoUrl),
		context,
		readOnly
	});

	app.mount(el_root);
}
