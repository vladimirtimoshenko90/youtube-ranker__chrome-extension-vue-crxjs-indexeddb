import { injectRatings } from '../utils';

function handleSearchVideos() {
	document.querySelectorAll('ytd-video-renderer').forEach((el_video) => {
		// Check if already initialized
		if (el_video?.querySelector('.rating-root')) return;

		// Identify injection point and required elements
		const el_injectInto = el_video;

		const el_videoLink = el_video.querySelector('a#video-title yt-formatted-string');
		const el_authorLink = el_video.querySelector('ytd-channel-name a.yt-simple-endpoint');
		if (!el_injectInto || !el_videoLink || !el_authorLink) {
			return;
		}

		// Inject ratings
		injectRatings(el_injectInto, 'search', {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')}`,
			videoTitle: el_videoLink.textContent,
			authorUrl: `https://www.youtube.com${el_authorLink.getAttribute('href')}`,
			authorName: el_authorLink.textContent
		});
	});
}

setInterval(handleSearchVideos, 1000);
