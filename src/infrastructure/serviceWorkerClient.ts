import type { AuthorReview, VideoReview } from './storage';

import { STORAGE_MESSAGE_ACTIONS } from '@/service-worker/storage-messages/registerStorageMessageHandlers';

export const serviceWorkerClient = {
	listAuthors(): Promise<AuthorReview[]> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.LIST_AUTHORS
		});
	},

	getAuthorByUrl(authorUrl: string): Promise<AuthorReview | null> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_URL,
			params: { authorUrl }
		});
	},

	getAuthorByName(authorName: string): Promise<AuthorReview | null> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_NAME,
			params: { authorName }
		});
	},

	deleteAuthor(authorUrl: string): Promise<void> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.DELETE_AUTHOR,
			params: { authorUrl }
		});
	},

	getVideoReview(videoUrl: string): Promise<VideoReview | null> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.GET_VIDEO_REVIEW,
			params: { videoUrl }
		});
	},

	upsertVideoReview(authorUrl: string | null, authorName: string, videoReview: VideoReview): Promise<void> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.UPSERT_VIDEO_REVIEW,
			params: { authorUrl, authorName, videoReview }
		});
	},

	deleteVideoReview(authorUrl: string, videoUrl: string): Promise<void> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.DELETE_VIDEO_REVIEW,
			params: { authorUrl, videoUrl }
		});
	}
};
