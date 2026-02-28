import type { VideoReview } from '../infrastructure/storage';
import { authorReviewsStorage } from '../infrastructure/storage';

/**
 * Message handler for storage operations from content scripts
 */
function handleStorageMessage(
	message: any,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void
): boolean {
	const { action, params = {} } = message;

	// Handle storage operations asynchronously
	(async () => {
		try {
			let result;

			switch (action) {
				// Author operations
				case 'getAuthor':
					result = await authorReviewsStorage.getAuthor(params.authorUrl);
					break;

				case 'deleteAuthor':
					result = await authorReviewsStorage.deleteAuthor(params.authorUrl);
					break;

				// Video review operations
				case 'upsertVideoReview':
					result = await authorReviewsStorage.upsertVideoReview(
						params.authorUrl,
						params.authorName,
						params.videoReview as VideoReview
					);
					break;

				case 'deleteVideoReview':
					result = await authorReviewsStorage.deleteVideoReview(params.authorUrl, params.videoUrl);
					break;

				case 'getVideoReview':
					const author = await authorReviewsStorage.getAuthor(params.authorUrl);
					result = author?.reviews.find((v) => v.videoUrl === params.videoUrl) || null;
					break;
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
