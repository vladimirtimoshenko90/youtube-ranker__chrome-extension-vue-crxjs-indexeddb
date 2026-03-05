import '../rating-positions.css';

import VideoRatingInject from '../VideoRatingsInject.vue';
import { createApp } from 'vue';

function handleWatchMain() {
	if (window.location.pathname === '/watch') {
		const el_primaryInner = document.querySelector('#primary-inner');
		if (!el_primaryInner) return;

		// Check if already initialized
		if (el_primaryInner.querySelector('.rating-root')) return;

		// Identify injection point and required elements
		const el_injectInto = el_primaryInner.querySelector('ytd-player');

		const el_videoTitle = el_primaryInner.querySelector('ytd-watch-metadata h1.ytd-watch-metadata');
		const el_authorLink = el_primaryInner.querySelector('.ytd-channel-name a.yt-simple-endpoint');
		if (!el_injectInto || !el_videoTitle || !el_authorLink) {
			return;
		}

		// Extract video information
		const videoUrl = window.location.href;
		const videoTitle = el_videoTitle.textContent;
		const authorUrl = `https://www.youtube.com${el_authorLink.getAttribute('href')}`;
		const authorName = el_authorLink.textContent;

		// Create container, mount VideoRatingInject
		const el_root = document.createElement('div');
		el_root.className = 'rating-root rating-root__watch-main';
		el_injectInto.appendChild(el_root);

		const app = createApp(VideoRatingInject, {
			videoUrl,
			videoTitle,
			authorUrl,
			authorName
		});

		app.mount(el_root);
	}
}

setInterval(handleWatchMain, 1000);
