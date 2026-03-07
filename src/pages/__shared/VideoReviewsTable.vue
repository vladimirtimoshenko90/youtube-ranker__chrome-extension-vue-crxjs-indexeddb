<script setup lang="ts">
	import type { VideoReview } from '@/infrastructure/storage';
	import VideoReviewRow from './VideoReviewRow.vue';

	defineProps<{ reviews: VideoReview[] }>();
	const emit = defineEmits<{ 'delete-review': [videoUrl: string] }>();
</script>

<template>
	<div class="review-list">
		<VideoReviewRow
			v-for="review in reviews"
			:key="review.videoUrl"
			:review="review"
			@delete="emit('delete-review', review.videoUrl)"
		/>
	</div>
</template>

<style scoped lang="scss">
	.review-list {
		display: flex;
		flex-direction: column;
	}
</style>
