export function openOverviewOnActionClick() {
	chrome.action.onClicked.addListener(() => {
		chrome.tabs.create({ url: 'src/pages/overview/overview.html' });
	});
}
