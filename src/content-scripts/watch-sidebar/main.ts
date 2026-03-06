import { injectRatings } from '../utils';

function handleWatchSidebar() {
	document.querySelectorAll('yt-lockup-view-model').forEach((el_video) => {
		// Check if already initialized
		if (el_video?.querySelector('.rating-root')) return;

		// Identify injection point and required elements
		const el_injectInto = el_video.querySelector('yt-thumbnail-view-model');

		const el_videoLink = el_video.querySelector('a.yt-lockup-metadata-view-model__title');
		const el_authorName = el_video.querySelector(
			'.yt-lockup-metadata-view-model__metadata .yt-content-metadata-view-model__metadata-row'
		);
		if (!el_injectInto || !el_videoLink || !el_authorName) {
			return;
		}

		// Inject ratings
		injectRatings(el_injectInto, 'watch-sidebar', {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')}`,
			videoTitle: el_videoLink.textContent,
			authorUrl: null,
			authorName: el_authorName.textContent
		});
	});
}

setInterval(handleWatchSidebar, 1000);
