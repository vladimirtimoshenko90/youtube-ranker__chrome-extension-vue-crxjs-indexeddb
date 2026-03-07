<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import { serviceWorkerClient as swClient } from '@/infrastructure/serviceWorkerClient';
	import { ref, computed, onMounted } from 'vue';
	import AuthorCard from '../__shared/AuthorCard.vue';
	import LoadingState from '../__shared/LoadingState.vue';
	import NoReviewsYet from './NoReviewsYet.vue';

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
		authors.value = await swClient.listAuthors();
		loading.value = false;
	});

	async function onDeleteAuthor(authorUrl: string) {
		await swClient.deleteAuthor(authorUrl);
		authors.value = authors.value.filter((a) => a.authorUrl !== authorUrl);
	}

	async function onDeleteReview(authorUrl: string, videoUrl: string) {
		await swClient.deleteVideoReview(authorUrl, videoUrl);

		const author = authors.value.find((a) => a.authorUrl === authorUrl);
		if (author) {
			author.reviews = author.reviews.filter((r) => r.videoUrl !== videoUrl);
			if (!author.reviews.length) {
				authors.value = authors.value.filter((a) => a.authorUrl !== authorUrl);
			}
		}
	}
</script>

<template>
	<div class="page">
		<LoadingState v-if="loading" />

		<NoReviewsYet v-else-if="!sortedAuthors.length" />

		<div v-else class="author-list">
			<AuthorCard
				v-for="author in sortedAuthors"
				:key="author.authorUrl"
				:author="author"
				@delete-author="onDeleteAuthor"
				@delete-review="onDeleteReview"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.author-card + .author-card {
		margin-top: 12px;
	}
</style>
