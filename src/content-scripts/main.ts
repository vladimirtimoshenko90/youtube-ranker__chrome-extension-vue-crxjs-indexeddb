import VideoRatingsInject, { RatingsInjectContext } from './VideoRatingsInject.vue';

import { createApp } from 'vue';

function handleHomeVideos() {
	if (window.location.pathname !== '/') return;
	document.querySelectorAll('yt-lockup-view-model').forEach((el_video) => {
		if (el_video?.querySelector('.rating-root')) return;

		const el_injectInto = el_video;
		const el_videoLink = el_video.querySelector('a.yt-lockup-metadata-view-model__title');
		const el_authorLink = el_video.querySelector('a.yt-core-attributed-string__link');
		if (!el_videoLink || !el_authorLink) return;

		injectRatings(el_injectInto, 'home', true, {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')!.trim()}`,
			videoTitle: el_videoLink.textContent!.trim(),
			authorUrl: `https://www.youtube.com${el_authorLink.getAttribute('href')!.trim()}`,
			authorName: el_authorLink.textContent!.trim()
		});
	});
}

function handleSearchVideos() {
	if (!window.location.pathname.startsWith('/results')) return;
	document.querySelectorAll('ytd-video-renderer').forEach((el_video) => {
		if (el_video?.querySelector('.rating-root')) return;

		const el_injectInto = el_video;
		const el_videoLink = el_video.querySelector('a#video-title yt-formatted-string');
		const el_authorLink = el_video.querySelector('ytd-channel-name a.yt-simple-endpoint');
		if (!el_injectInto || !el_videoLink || !el_authorLink) return;

		injectRatings(el_injectInto, 'search', true, {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')!.trim()}`,
			videoTitle: el_videoLink.textContent!.trim(),
			authorUrl: `https://www.youtube.com${el_authorLink.getAttribute('href')!.trim()}`,
			authorName: el_authorLink.textContent!.trim()
		});
	});
}

function handleWatchMain() {
	if (window.location.pathname !== '/watch') return;
	const el_primaryInner = document.querySelector('#primary-inner');
	if (!el_primaryInner) return;

	if (el_primaryInner.querySelector('.rating-root')) return;

	const el_injectInto = el_primaryInner.querySelector('ytd-player');
	const el_videoTitle = el_primaryInner.querySelector('ytd-watch-metadata h1.ytd-watch-metadata');
	const el_authorLink = el_primaryInner.querySelector('.ytd-channel-name a.yt-simple-endpoint');
	if (!el_injectInto || !el_videoTitle || !el_authorLink) return;

	injectRatings(el_injectInto, 'watch-main', false, {
		videoUrl: window.location.href.trim(),
		videoTitle: el_videoTitle.textContent!.trim(),
		authorUrl: `https://www.youtube.com${el_authorLink.getAttribute('href')!.trim()}`,
		authorName: el_authorLink.textContent!.trim()
	});
}

function handleWatchSidebar() {
	if (!window.location.pathname.startsWith('/watch')) return;
	document.querySelectorAll('yt-lockup-view-model').forEach((el_video) => {
		if (el_video?.querySelector('.rating-root')) return;

		const el_injectInto = el_video.querySelector('yt-thumbnail-view-model');
		const el_videoLink = el_video.querySelector('a.yt-lockup-metadata-view-model__title');
		const el_authorName = el_video.querySelector(
			'.yt-lockup-metadata-view-model__metadata .yt-content-metadata-view-model__metadata-row'
		);
		if (!el_injectInto || !el_videoLink || !el_authorName) return;

		injectRatings(el_injectInto, 'watch-sidebar', true, {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')!.trim()}`,
			videoTitle: el_videoLink.textContent!.trim(),
			authorUrl: null,
			authorName: el_authorName.textContent!.trim()
		});
	});
}

function handleChannelVideos() {
	if (!window.location.pathname.startsWith('/@')) return;
	document.querySelectorAll('#scroll-container ytd-grid-video-renderer').forEach((el_video) => {
		if (el_video?.querySelector('.rating-root')) return;

		const el_injectInto = el_video.querySelector('ytd-thumbnail');
		const el_videoLink = el_video.querySelector('a#video-title');
		const el_authorName = document.querySelector(
			'.yt-page-header-view-model__page-header-headline-info .dynamicTextViewModelH1'
		);
		const el_authorId = document.querySelector(
			'.yt-page-header-view-model__page-header-headline-info .yt-content-metadata-view-model__metadata-text'
		);
		if (!el_injectInto || !el_videoLink || !el_authorName || !el_authorId) return;

		injectRatings(el_injectInto, 'channel', true, {
			videoUrl: `https://www.youtube.com${el_videoLink.getAttribute('href')!.trim()}`,
			videoTitle: el_videoLink.textContent!.trim(),
			authorUrl: `https://www.youtube.com/${el_authorId.textContent!.trim()}`,
			authorName: el_authorName.textContent!.trim()
		});
	});
}

setInterval(() => {
	handleHomeVideos();
	handleSearchVideos();
	handleWatchMain();
	handleWatchSidebar();
	handleChannelVideos();
}, 1000);

function injectRatings(
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

	const app = createApp(VideoRatingsInject, { ...videoInfo, context, readOnly });

	app.mount(el_root);
}
