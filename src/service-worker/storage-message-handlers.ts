import type { VideoReview } from '../infrastructure/storage';
import { authorReviewsStorage } from '../infrastructure/storage';

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
		try {
			let result;

			switch (action) {
				// Author operations
				case STORAGE_MESSAGE_ACTIONS.GET_AUTHOR:
					result = await authorReviewsStorage.getAuthor(params.authorUrl);
					break;

				case STORAGE_MESSAGE_ACTIONS.DELETE_AUTHOR:
					result = await authorReviewsStorage.deleteAuthor(params.authorUrl);
					break;

				// Video review operations
				case STORAGE_MESSAGE_ACTIONS.UPSERT_VIDEO_REVIEW:
					result = await authorReviewsStorage.upsertVideoReview(
						params.authorUrl,
						params.authorName,
						params.videoReview as VideoReview
					);
					break;

				case STORAGE_MESSAGE_ACTIONS.DELETE_VIDEO_REVIEW:
					result = await authorReviewsStorage.deleteVideoReview(params.authorUrl, params.videoUrl);
					break;

				case STORAGE_MESSAGE_ACTIONS.GET_VIDEO_REVIEW:
					const author = await authorReviewsStorage.getAuthor(params.authorUrl);
					result = author?.reviews.find((v) => v.videoUrl === params.videoUrl) || null;
					break;

				default:
					throw new Error(`Unknown action: ${action}`);
			}

			sendResponse({ success: true, data: result });
		} catch (error) {
			console.error(`Storage operation failed: ${action}`, error);
			sendResponse({
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
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
