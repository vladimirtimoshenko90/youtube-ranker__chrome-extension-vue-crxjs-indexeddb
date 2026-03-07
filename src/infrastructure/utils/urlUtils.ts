export const urlUtils = {
	queryParam(name: string): string | null {
		return new URLSearchParams(window.location.search).get(name);
	}
};
