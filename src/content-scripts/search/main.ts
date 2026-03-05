import '../rating-positions.css';

import VideoRatingInject from '../VideoRatingsInject.vue';
import { createApp } from 'vue';

function handleSearchVideos() {
	document.querySelectorAll('ytd-video-renderer').forEach((el_video) => {
		// Check if already initialized
		if (el_video?.querySelector('.rating-root')) return;

		// Identify injection point and required elements
		const el_injectInto = el_video;

		const el_videoLink = el_video.querySelector('a#video-title');
		const el_authorLink = el_video.querySelector('ytd-channel-name a.yt-simple-endpoint');
		if (!el_injectInto || !el_videoLink || !el_authorLink) {
			return;
		}

		// Extract video information
		const videoUrl = `https://www.youtube.com${el_videoLink.getAttribute('href')}`;
		const videoTitle = el_videoLink.getAttribute('title') || el_videoLink.textContent;
		const authorUrl = `https://www.youtube.com${el_authorLink.getAttribute('href')}`;
		const authorName = el_authorLink.textContent;

		// Create container, mount VideoRatingInject
		const el_root = document.createElement('div');
		el_root.className = 'rating-root rating-root__search';
		el_injectInto.appendChild(el_root);

		const app = createApp(VideoRatingInject, {
			videoUrl,
			videoTitle,
			authorUrl,
			authorName
		});

		app.mount(el_root);
	});
}

setInterval(handleSearchVideos, 1000);
