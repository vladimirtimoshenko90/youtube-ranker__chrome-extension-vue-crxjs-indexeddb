import { injectRatings } from '../utils';

function handleWatchMain() {
	const el_primaryInner = document.querySelector('#primary-inner');
	if (!!el_primaryInner && window.location.pathname === '/watch') {
		// Check if already initialized
		if (el_primaryInner.querySelector('.rating-root')) return;

		// Identify injection point and required elements
		const el_injectInto = el_primaryInner.querySelector('ytd-player');

		const el_videoTitle = el_primaryInner.querySelector('ytd-watch-metadata h1.ytd-watch-metadata');
		const el_authorLink = el_primaryInner.querySelector('.ytd-channel-name a.yt-simple-endpoint');
		if (!el_injectInto || !el_videoTitle || !el_authorLink) {
			return;
		}

		// Inject ratings
		injectRatings(el_injectInto, 'watch-main', {
			videoUrl: window.location.href,
			videoTitle: el_videoTitle.textContent,
			authorUrl: `https://www.youtube.com${el_authorLink.getAttribute('href')}`,
			authorName: el_authorLink.textContent
		});
	}
}

setInterval(handleWatchMain, 1000);
