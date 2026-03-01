import '../rating-positions.css';

import VideoRatingInject from '../VideoRatingsInject.vue';
import { createApp } from 'vue';

function mountVideoMetrics() {
	document.querySelectorAll('yt-lockup-view-model').forEach((el_video) => {
		// Check if already initialized
		if (el_video.hasAttribute('data-video-metrics')) {
			return;
		} else {
			el_video.setAttribute('data-video-metrics', 'true');
		}

		// Extract video information
		const el_videoLink = el_video.querySelector('a.yt-lockup-metadata-view-model__title');
		const el_authorLink = el_video.querySelector('a.yt-core-attributed-string__link');
		if (!el_videoLink || !el_authorLink) {
			return;
		}

		const videoUrl = `https://www.youtube.com${el_videoLink.getAttribute('href')}`;
		const videoTitle = el_videoLink.getAttribute('title') || el_videoLink.textContent;
		const authorUrl = `https://www.youtube.com${el_authorLink.getAttribute('href')}`;
		const authorName = el_authorLink.textContent;

		// Create container, mount VideoRatingInject
		const el_root = document.createElement('div');
		el_root.className = 'rating-root rating-root__home';
		el_video.appendChild(el_root);

		const app = createApp(VideoRatingInject, {
			videoUrl,
			videoTitle,
			authorUrl,
			authorName
		});

		app.mount(el_root);
	});
}

// Wait for DOM to be ready and mount
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mountVideoMetrics);
} else {
	mountVideoMetrics();
}

// Optionally re-run when new lockups are added dynamically
const observer = new MutationObserver(() => {
	mountVideoMetrics();
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});
