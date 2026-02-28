import { registerStorageMessageHandlers } from './storage-message-handlers';

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: 'src/pages/overview.html' });
});

registerStorageMessageHandlers();
