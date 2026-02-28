import type { VideoReview } from '../infrastructure/storage';
import { authorReviewsCache } from './author-reviews-cache';
import { authorReviewsStorage } from '../infrastructure/storage';
import { broadcastAuthorReview } from './broadcast-events';

// Storage message action constants
export const STORAGE_MESSAGE_ACTIONS = {
	GET_AUTHOR: 'getAuthor',
	DELETE_AUTHOR: 'deleteAuthor',
	UPSERT_VIDEO_REVIEW: 'upsertVideoReview',
	DELETE_VIDEO_REVIEW: 'deleteVideoReview',
	GET_VIDEO_REVIEW: 'getVideoReview'
} as const;

/**
 * Message handler for storage operations from content scripts
 * Returns false if message is not for this handler (allowing other listeners to process it)
 */
function handleStorageMessage(
	message: any,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void
): boolean {
	const { action, params = {} } = message;

	// Only handle known storage actions
	if (!action || !Object.values(STORAGE_MESSAGE_ACTIONS).includes(action)) {
		return false; // Let other listeners handle it
	}

	// Handle storage operations asynchronously
	(async () => {
		let result;

		switch (action) {
			// Author operations
			case STORAGE_MESSAGE_ACTIONS.GET_AUTHOR: {
				const cached = authorReviewsCache.get(params.authorUrl);
				if (cached !== undefined) {
					result = cached;
				} else {
					result = await authorReviewsStorage.getAuthor(params.authorUrl);
					authorReviewsCache.upsert(params.authorUrl, result);
				}
				break;
			}

			case STORAGE_MESSAGE_ACTIONS.DELETE_AUTHOR: {
				result = await authorReviewsStorage.deleteAuthor(params.authorUrl);
				authorReviewsCache.remove(params.authorUrl);
				broadcastAuthorReview(null, params.authorUrl);
				break;
			}

			// Video review operations
			case STORAGE_MESSAGE_ACTIONS.UPSERT_VIDEO_REVIEW: {
				await authorReviewsStorage.upsertVideoReview(
					params.authorUrl,
					params.authorName,
					params.videoReview as VideoReview
				);
				const updatedAuthor = await authorReviewsStorage.getAuthor(params.authorUrl);
				authorReviewsCache.upsert(params.authorUrl, updatedAuthor);
				broadcastAuthorReview(updatedAuthor, params.authorUrl);
				break;
			}

			case STORAGE_MESSAGE_ACTIONS.DELETE_VIDEO_REVIEW: {
				await authorReviewsStorage.deleteVideoReview(params.authorUrl, params.videoUrl);
				const updatedAuthor = await authorReviewsStorage.getAuthor(params.authorUrl);
				authorReviewsCache.upsert(params.authorUrl, updatedAuthor);
				broadcastAuthorReview(updatedAuthor, params.authorUrl);
				break;
			}

			case STORAGE_MESSAGE_ACTIONS.GET_VIDEO_REVIEW: {
				const cached = authorReviewsCache.get(params.authorUrl);
				let author: any;
				if (cached !== undefined) {
					author = cached;
				} else {
					author = await authorReviewsStorage.getAuthor(params.authorUrl);
					authorReviewsCache.upsert(params.authorUrl, author);
				}
				result = author?.reviews.find((v: any) => v.videoUrl === params.videoUrl) || null;
				break;
			}

			default:
				throw new Error(`Unknown action: ${action}`);
		}

		sendResponse(result);
	})();

	// Return true to indicate we will send response asynchronously
	return true;
}

/**
 * Register the message listener for storage operations
 */
export function registerStorageMessageHandlers(): void {
	chrome.runtime.onMessage.addListener(handleStorageMessage);
}
