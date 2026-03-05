<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import AuthorCard from './AuthorCard.vue';
	import { STORAGE_MESSAGE_ACTIONS } from '@/service-worker/storage-messages/registerStorageMessageHandlers';
	import { ref, computed, onMounted } from 'vue';

	const authors = ref<AuthorReview[]>([]);
	const loading = ref(true);

	const sortedAuthors = computed(() =>
		[...authors.value].sort((a, b) => {
			const aMax = Math.max(...a.reviews.map((r) => r.lastUpdated ?? 0));
			const bMax = Math.max(...b.reviews.map((r) => r.lastUpdated ?? 0));
			return bMax - aMax;
		})
	);

	onMounted(async () => {
		authors.value = await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.LIST_AUTHORS
		});
		loading.value = false;
	});
</script>

<template>
	<div class="overview">
		<h1>YouTube Ranker — Overview</h1>

		<p v-if="loading" class="status">Loading…</p>

		<p v-else-if="!sortedAuthors.length" class="status">No reviews yet.</p>

		<div v-else class="author-list">
			<AuthorCard v-for="author in sortedAuthors" :key="author.authorUrl" :author="author" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.overview {
		font-family:
			'Segoe UI',
			system-ui,
			-apple-system,
			sans-serif;
		max-width: 960px;
		margin: 0 auto;
		padding: 24px;
		color: #1a1a1a;

		h1 {
			font-size: 1.6rem;
			margin-bottom: 24px;
		}

		.status {
			color: #666;
			font-size: 0.95rem;
		}
	}
</style>
