<script setup lang="ts">
	import { RatingData } from '@/infrastructure/common/rating-data';
	import VideoRatings from '@/infrastructure/components/VideoRatings.vue';
	import { useServiceWorkerEvent } from '@/infrastructure/useServiceWorkerEvent';
	import { serviceWorkerClient as swClient } from '@/infrastructure/serviceWorkerClient';
	import { AuthorReview, VideoReview } from '@/infrastructure/storage';
	import { SERVICE_WORKER_NOTIFICATION_TYPES } from '@/service-worker/broadcast-events/notification-types';
	import type { AuthorReviewChangedPayload } from '@/service-worker/broadcast-events/notification-types';
	import { ref, onMounted } from 'vue';

	export type RatingsInjectContext = 'home' | 'search' | 'watch-main' | 'watch-sidebar' | 'channel';

	const props = defineProps<{
		context: RatingsInjectContext;
		videoUrl: string;
		videoTitle: string;
		authorUrl: string | null;
		authorName: string;
	}>();

	const videoRating = ref<RatingData>();
	const authorRating = ref<number>();

	const handleUpdateRating = async (updatedRating: RatingData) => {
		await swClient.rateVideo(props.authorUrl, props.authorName, props.videoUrl, props.videoTitle, updatedRating);
	};

	onMounted(async () => {
		let author: AuthorReview | null = null;
		let video: VideoReview | null = null;

		if (props.authorUrl) {
			author = await swClient.getAuthorByUrl(props.authorUrl);
			video = author?.reviews.find((r) => r.videoUrl === props.videoUrl) || null;
		} else {
			[video, author] = await Promise.all([
				swClient.getVideoReview(props.videoUrl),
				swClient.getAuthorByName(props.authorName)
			]);
		}

		if (author) {
			const ratings = author.reviews.filter((r) => !r.skipped && !!r.rating);
			if (ratings.length) {
				authorRating.value = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
			}
		}

		if (video) {
			videoRating.value = { ...video };
		}
	});

	useServiceWorkerEvent<AuthorReviewChangedPayload>(
		SERVICE_WORKER_NOTIFICATION_TYPES.AUTHOR_REVIEW_CHANGED,
		({ entity, authorUrl }) => {
			if (authorUrl !== props.authorUrl) return;

			if (!entity) {
				videoRating.value = undefined;
				authorRating.value = undefined;
				return;
			}

			const ratings = entity.reviews.filter((r) => !r.skipped && !!r.rating);
			authorRating.value = ratings.length
				? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
				: undefined;

			const video = entity.reviews.find((r) => r.videoUrl === props.videoUrl) ?? null;
			videoRating.value = video ? { ...video } : undefined;
		}
	);
</script>

<template>
	<div :class="`rating-root rating-root__${props.context}`" @click.stop.prevent="() => {}">
		<VideoRatings :videoRating="videoRating" :authorRating="authorRating" @updateRating="handleUpdateRating" />
	</div>
</template>

<style scoped lang="scss">
	.rating-root {
		position: absolute;
		top: 0;
		z-index: 1100;
		background: rgba(255, 255, 255, 0.5);

		&.rating-root__home {
			right: 0;
		}
		&.rating-root__search {
			left: 0;
		}
		&.rating-root__watch-main {
			right: 0;
		}
		&.rating-root__watch-sidebar {
			right: 0;
		}
		&.rating-root__channel {
			left: 0;
		}
	}
</style>
