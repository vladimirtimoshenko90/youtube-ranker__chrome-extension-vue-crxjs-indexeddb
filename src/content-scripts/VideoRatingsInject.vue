<script setup lang="ts">
	import { RatingData } from '@/infrastructure/common/rating-data';
	import VideoRatings from '@/infrastructure/components/VideoRatings.vue';
	import { useServiceWorkerEvent } from '@/infrastructure/useServiceWorkerEvent';
	import { serviceWorkerClient as swClient } from '@/infrastructure/serviceWorkerClient';
	import { AuthorReview, VideoReview } from '@/infrastructure/storage';
	import { SERVICE_WORKER_NOTIFICATION_TYPES } from '@/service-worker/broadcast-events/notification-types';
	import type { AuthorReviewChangedPayload } from '@/service-worker/broadcast-events/notification-types';
	import { ref, onMounted, computed } from 'vue';

	export type RatingsInjectContext = 'home' | 'search' | 'watch-main' | 'watch-sidebar' | 'channel';

	const props = defineProps<{
		context: RatingsInjectContext;
		videoUrl: string;
		videoTitle: string;
		authorUrl: string | null;
		authorName: string;
	}>();

	const author = ref<AuthorReview | null>(null);
	const video = ref<VideoReview | null>(null);

	const authorRating = computed(() => {
		const ratings = author.value?.reviews.filter((r) => !r.skipped && !!r.rating) || [];
		return !ratings.length ? null : ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
	});

	const videoRating = computed(() => {
		return !!video.value ? { ...video.value } : null;
	});

	const handleUpdateRating = async (updatedRating: RatingData) => {
		await swClient.rateVideo(props.authorUrl, props.authorName, props.videoUrl, props.videoTitle, updatedRating);
	};

	onMounted(async () => {
		if (props.authorUrl) {
			author.value = await swClient.getAuthorByUrl(props.authorUrl);
			video.value = author.value?.reviews.find((r) => r.videoUrl === props.videoUrl) || null;
		} else {
			author.value = await swClient.getAuthorByName(props.authorName);
			video.value = await swClient.getVideoReview(props.videoUrl);
		}
	});

	useServiceWorkerEvent<AuthorReviewChangedPayload>(
		SERVICE_WORKER_NOTIFICATION_TYPES.AUTHOR_REVIEW_CHANGED,
		({ entity, authorUrl }) => {
			if (authorUrl === props.authorUrl) {
				author.value = entity;
				video.value = author.value?.reviews.find((r) => r.videoUrl === props.videoUrl) || null;
			}
		}
	);
</script>

<template>
	<div :class="`rating-root rating-root__${props.context}`" @click.stop.prevent="() => {}">
		<VideoRatings
			:videoRating="videoRating"
			:authorRating="authorRating"
			:authorUrl="props.authorUrl"
			@updateRating="handleUpdateRating"
		/>
	</div>
</template>

<style scoped lang="scss">
	.rating-root {
		position: absolute;
		top: 0;
		z-index: 1100;
		background: rgba(255, 255, 255, 0.75);

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
