import type { AuthorReview } from '../infrastructure/storage';

export type ServiceWorkerNotification<T> = {
	action: string;
	payload: T;
};

export const SERVICE_WORKER_NOTIFICATIONS = {
	AUTHOR_REVIEW_CHANGED: 'authorReviewChanged'
} as const;

export interface AuthorReviewChangedPayload {
	entity: AuthorReview | null;
	authorUrl: string;
}

/**
 * Broadcasts author review changes to all content scripts on YouTube tabs
 */
export async function broadcastAuthorReview(authorReview: AuthorReview | null, authorUrl: string): Promise<void> {
	// Get all YouTube tabs
	const tabs = await chrome.tabs.query({
		url: ['*://youtube.com/*', '*://www.youtube.com/*']
	});

	// Message format for content scripts to handle
	const message: ServiceWorkerNotification<AuthorReviewChangedPayload> = {
		action: SERVICE_WORKER_NOTIFICATIONS.AUTHOR_REVIEW_CHANGED,
		payload: {
			entity: authorReview,
			authorUrl: authorUrl
		}
	};

	// Send notification to each tab's content script
	for (const tab of tabs) {
		if (tab.id) {
			chrome.tabs.sendMessage(tab.id, message).catch(() => {
				// Silently ignore errors (e.g., tab doesn't have content script)
			});
		}
	}
}
