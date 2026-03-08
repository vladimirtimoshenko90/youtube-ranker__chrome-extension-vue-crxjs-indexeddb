// Other message action constants
export const OTHER_MESSAGE_ACTIONS = {
	OPEN_AUTHOR_OVERVIEW: 'openAuthorOverview'
} as const;

/**
 * Message handler for other (non-storage) operations from content scripts
 * Returns false if message is not for this handler (allowing other listeners to process it)
 * Returns true to keep the message channel open for async sendResponse
 */
function handleOtherMessage(
	message: any,
	_sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void
): boolean {
	const { action, params = {} } = message;

	// Only handle known other actions
	if (!action || !Object.values(OTHER_MESSAGE_ACTIONS).includes(action)) {
		return false; // Let other listeners handle it
	}

	// Handle operations asynchronously
	(async () => {
		let result;

		switch (action) {
			case OTHER_MESSAGE_ACTIONS.OPEN_AUTHOR_OVERVIEW: {
				const url = chrome.runtime.getURL(
					`src/pages/author-overview/author-overview.html?authorId=${params.authorId}`
				);
				await chrome.tabs.create({ url });
				break;
			}

			default:
				throw new Error(`Unknown action: ${action}`);
		}

		sendResponse(result);
	})();

	// Return true to indicate we will send a response asynchronously
	return true;
}

export function registerOtherMessageHandlers() {
	chrome.runtime.onMessage.addListener(handleOtherMessage);
}
