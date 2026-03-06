<script setup lang="ts">
	import { RatingData } from '@/infrastructure/common/rating-data';
	import VideoRatings from '@/infrastructure/components/VideoRatings.vue';
	import { AuthorReview, VideoReview } from '@/infrastructure/storage';
	import { STORAGE_MESSAGE_ACTIONS } from '@/service-worker/storage-messages/registerStorageMessageHandlers';
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
		await chrome.runtime.sendMessage({
			action: STORAGE_MESSAGE_ACTIONS.UPSERT_VIDEO_REVIEW,
			params: {
				authorUrl: props.authorUrl,
				authorName: props.authorName,
				videoReview: {
					videoUrl: props.videoUrl,
					videoTitle: props.videoTitle,
					...updatedRating
				}
			}
		});
	};

	onMounted(async () => {
		let author: AuthorReview | null = null;
		let video: VideoReview | null = null;

		if (props.authorUrl) {
			author = await chrome.runtime.sendMessage({
				action: STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_URL,
				params: { authorUrl: props.authorUrl }
			});
			video = author?.reviews.find((r) => r.videoUrl === props.videoUrl) || null;
		} else {
			[video, author] = await Promise.all([
				chrome.runtime.sendMessage({
					action: STORAGE_MESSAGE_ACTIONS.GET_VIDEO_REVIEW,
					params: { videoUrl: props.videoUrl }
				}),
				chrome.runtime.sendMessage({
					action: STORAGE_MESSAGE_ACTIONS.GET_AUTHOR_BY_NAME,
					params: { authorName: props.authorName }
				})
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
