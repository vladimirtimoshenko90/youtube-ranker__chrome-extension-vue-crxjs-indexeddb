<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import { STORAGE_MESSAGE_ACTIONS } from '@/service-worker/storage-messages/registerStorageMessageHandlers';
	import { ref, onMounted } from 'vue';
	import AuthorCard from '../__shared/AuthorCard.vue';

	const author = ref<AuthorReview | null>(null);
	const loading = ref(true);
	const notFound = ref(false);
	const authorId = ref('');

	onMounted(async () => {
		const params = new URLSearchParams(window.location.search);
		const rawId = params.get('authorId');

		if (!rawId) {
			notFound.value = true;
			loading.value = false;
			return;
		}

		authorId.value = rawId;
		const authorUrl = `https://www.youtube.com/${rawId}`;

		const result: AuthorReview | null = await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_URL,
			params: { authorUrl }
		});

		if (!result) {
			notFound.value = true;
		} else {
			author.value = result;
		}

		loading.value = false;
	});

	async function onDeleteAuthor(authorUrl: string) {
		await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.DELETE_AUTHOR,
			params: { authorUrl }
		});
		author.value = null;
		notFound.value = true;
	}

	async function onDeleteReview(authorUrl: string, videoUrl: string) {
		await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.DELETE_VIDEO_REVIEW,
			params: { authorUrl, videoUrl }
		});
		if (!author.value) return;
		author.value = {
			...author.value,
			reviews: author.value.reviews.filter((r) => r.videoUrl !== videoUrl)
		};
	}
</script>

<template>
	<div class="author-overview">
		<p v-if="loading" class="status">Loading…</p>

		<p v-else-if="notFound" class="status">
			No reviews for <b>{{ authorId }}</b>
		</p>

		<template v-else-if="author">
			<h2 class="page-title">Reviews for {{ author.authorName }}</h2>
			<AuthorCard :author="author" @delete-author="onDeleteAuthor" @delete-review="onDeleteReview" />
		</template>
	</div>
</template>

<style scoped lang="scss">
	.author-overview {
		font-family:
			'Segoe UI',
			system-ui,
			-apple-system,
			sans-serif;
		max-width: 960px;
		margin: 0 auto;
		padding: 24px;
		color: #1a1a1a;

		.page-title {
			font-size: 1.4rem;
			font-weight: 600;
			margin-bottom: 20px;
		}

		.status {
			color: #666;
			font-size: 0.95rem;
		}
	}
</style>
