import '../rating-positions.css';

import VideoRatingInject from '../VideoRatingsInject.vue';
import { createApp } from 'vue';

function mountVideoMetrics() {
	if (window.location.pathname === '/watch') {
		const el_primaryInner = document.querySelector('#primary-inner');
		const el_player = el_primaryInner?.querySelector('ytd-player');
		const el_metadata = el_primaryInner?.querySelector('ytd-watch-metadata');
		if (!el_player || !el_metadata) {
			return;
		}

		// Check if already initialized
		if (el_player?.querySelector('.rating-root')) return;

		// Extract video information
		const el_videoTitle = el_metadata.querySelector('h1.ytd-watch-metadata');
		const el_authorLink = el_metadata.querySelector('ytd-watch-metadata .ytd-channel-name a.yt-simple-endpoint');
		if (!el_videoTitle || !el_authorLink) {
			return;
		}

		const videoUrl = window.location.href;
		const videoTitle = el_videoTitle.textContent;
		const authorUrl = `https://www.youtube.com${el_authorLink.getAttribute('href')}`;
		const authorName = el_authorLink.textContent;

		// Create container, mount VideoRatingInject
		const el_root = document.createElement('div');
		el_root.className = 'rating-root rating-root__watch-main';
		el_player.appendChild(el_root);

		const app = createApp(VideoRatingInject, {
			videoUrl,
			videoTitle,
			authorUrl,
			authorName
		});

		app.mount(el_root);
	}
}

setInterval(mountVideoMetrics, 1000);
