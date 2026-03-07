<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import { serviceWorkerClient as swClient } from '@/infrastructure/serviceWorkerClient';
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

		author.value = await swClient.getAuthorByUrl(`https://www.youtube.com/${authorId.value}`);
		loading.value = false;
	});

	async function onDeleteAuthor(authorUrl: string) {
		await swClient.deleteAuthor(authorUrl);
		author.value = null;
	}

	async function onDeleteReview(authorUrl: string, videoUrl: string) {
		await swClient.deleteVideoReview(authorUrl, videoUrl);

		if (author.value) {
			author.value = {
				...author.value,
				reviews: author.value.reviews.filter((r) => r.videoUrl !== videoUrl)
			};
			if (!author.value.reviews.length) {
				author.value = null;
			}
		}
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
