<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import { STORAGE_MESSAGE_ACTIONS } from '@/service-worker/storage-messages/registerStorageMessageHandlers';
	import { urlUtils } from '@/infrastructure/utils/urlUtils';
	import { ref, onMounted } from 'vue';
	import AuthorCard from '../__shared/AuthorCard.vue';
	import AuthorNotFound from './AuthorNotFound.vue';
	import LoadingState from '../__shared/LoadingState.vue';

	const authorId = ref<string | null>();
	const author = ref<AuthorReview | null>(null);
	const loading = ref(true);

	onMounted(async () => {
		authorId.value = urlUtils.queryParam('authorId');

		if (!authorId.value) {
			loading.value = false;
			return;
		}

		author.value = await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_URL,
			params: { authorUrl: `https://www.youtube.com/${authorId.value}` }
		});
		loading.value = false;
	});

	async function onDeleteAuthor(authorUrl: string) {
		await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.DELETE_AUTHOR,
			params: { authorUrl }
		});
		author.value = null;
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
	<div class="page">
		<LoadingState v-if="loading" />

		<AuthorNotFound v-else-if="!author" :author-id="authorId" />

		<AuthorCard
			v-else
			:author="author"
			:always-expanded="true"
			@delete-author="onDeleteAuthor"
			@delete-review="onDeleteReview"
		/>
	</div>
</template>

<style scoped lang="scss"></style>
