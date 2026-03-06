import { injectRatings } from '../utils';

function handleHomeVideos() {
	document.querySelectorAll('yt-lockup-view-model').forEach((el_video) => {
		// Check if already initialized
		if (el_video?.querySelector('.rating-root')) return;

		// Identify injection point and required elements
		const el_injectInto = el_video;

		const el_videoLink = el_video.querySelector('a.yt-lockup-metadata-view-model__title');
		const el_authorLink = el_video.querySelector('a.yt-core-attributed-string__link');
		if (!el_videoLink || !el_authorLink) {
			return;
		}

		// Inject ratings
		injectRatings(el_injectInto, 'home', {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')}`,
			videoTitle: el_videoLink.textContent,
			authorUrl: `https://www.youtube.com${el_authorLink.getAttribute('href')}`,
			authorName: el_authorLink.textContent
		});
	});
}

setInterval(handleHomeVideos, 1000);
