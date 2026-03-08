import type { RatingData } from '../../infrastructure/common/rating-data';
import { authorReviewsCache } from './author-reviews-cache';
import { authorReviewsStorage } from '../../infrastructure/storage';
import { broadcastAuthorReview } from '../broadcast-events/broadcastAuthorReview';

// Storage message action constants
export const STORAGE_MESSAGE_ACTIONS = {
	LIST_AUTHORS: 'listAuthors',
	GET_AUTHOR_BY_URL: 'getAuthor',
	GET_AUTHOR_BY_NAME: 'getAuthorByName',
	DELETE_AUTHOR: 'deleteAuthor',
	RATE_VIDEO: 'rateVideo',
	DELETE_VIDEO_REVIEW: 'deleteVideoReview'
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
			case STORAGE_MESSAGE_ACTIONS.LIST_AUTHORS: {
				result = await authorReviewsStorage.getAllAuthors();
				break;
			}

			case STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_URL: {
				result = await authorReviewsCache.getOrAdd(params.authorUrl, () =>
					authorReviewsStorage.getAuthor(params.authorUrl)
				);
				break;
			}

			case STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_NAME: {
				result = await authorReviewsStorage.getAuthorByName(params.authorName);
				!!result && authorReviewsCache.upsert(result.authorUrl, result);
				break;
			}

			case STORAGE_MESSAGE_ACTIONS.DELETE_AUTHOR: {
				await authorReviewsStorage.deleteAuthor(params.authorUrl);
				authorReviewsCache.remove(params.authorUrl);
				broadcastAuthorReview(null, params.authorUrl);
				break;
			}

			// Video review operations
			case STORAGE_MESSAGE_ACTIONS.RATE_VIDEO: {
				const ratingData = params.ratingData as RatingData;
				await authorReviewsStorage.upsertVideoReview(params.authorUrl, params.authorName, {
					...ratingData,
					rating: ratingData.rating!,
					videoUrl: params.videoUrl,
					videoTitle: params.videoTitle,
					lastUpdated: Date.now()
				});

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
