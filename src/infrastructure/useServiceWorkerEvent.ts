import { onMounted, onUnmounted } from 'vue';

import type { ServiceWorkerNotification } from '@/service-worker/broadcast-events/notification';

export function useServiceWorkerEvent<T>(action: string, handler: (payload: T) => void): void {
	function onMessage(message: ServiceWorkerNotification<unknown>) {
		if (message.action === action) {
			handler((message as ServiceWorkerNotification<T>).payload);
		}
	}

	onMounted(() => chrome.runtime.onMessage.addListener(onMessage));
	onUnmounted(() => chrome.runtime.onMessage.removeListener(onMessage));
}
