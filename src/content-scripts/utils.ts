import './rating-positions.css';

import VideoRatingsInject from './VideoRatingsInject.vue';
import { createApp } from 'vue';

type RatingInjectionContext = 'home' | 'search' | 'watch-main' | 'watch-sidebar';

interface VideoInfo {
	videoUrl: string;
	videoTitle: string;
	authorUrl: string | null;
	authorName: string;
}

export function injectRatings(el_injectInto: Element, type: RatingInjectionContext, videoInfo: VideoInfo): void {
	const el_root = document.createElement('div');
	el_root.className = `rating-root rating-root__${type}`;
	el_injectInto.appendChild(el_root);

	const app = createApp(VideoRatingsInject, { ...videoInfo });

	app.mount(el_root);
}
