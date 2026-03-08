import type { AuthorReview } from './storage';

import type { RatingData } from './common/rating-data';
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

	rateVideo(
		authorUrl: string | null,
		authorName: string,
		videoUrl: string,
		videoTitle: string,
		ratingData: RatingData
	): Promise<void> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.RATE_VIDEO,
			params: { authorUrl, authorName, videoUrl, videoTitle, ratingData }
		});
	},

	deleteVideoReview(authorUrl: string, videoUrl: string): Promise<void> {
		return chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.DELETE_VIDEO_REVIEW,
			params: { authorUrl, videoUrl }
		});
	}
};
