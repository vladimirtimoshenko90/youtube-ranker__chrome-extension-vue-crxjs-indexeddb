<script setup lang="ts">
	import { ref } from 'vue';
	import RatingModal from './RatingModal.vue';
	import Rating from './Rating.vue';
	import type { RatingData } from '../common/rating-data';

	const props = defineProps<{
		videoRating: RatingData | undefined;
		authorRating: number | undefined;
	}>();

	const emit = defineEmits<{
		updateRating: [data: RatingData];
	}>();

	const isModalOpen = ref(false);

	const handleSaveRating = (data: RatingData) => {
		emit('updateRating', data);
	};
</script>

<template>
	<div class="video-metrics" @click="videoRating && (isModalOpen = true)">
		<div class="rating-item">
			<span>Video</span>
			<Rating
				v-if="videoRating && !videoRating.skipped && !!videoRating.rating"
				:model-value="videoRating.rating"
				:star-size="24"
				readonly
			/>
			<span v-else-if="videoRating?.skipped" class="skipped">Skipped</span>
			<span v-else>N/A</span>
		</div>

		<div class="rating-item">
			<span>Author</span>
			<Rating v-if="!!authorRating" :model-value="authorRating" :star-size="24" readonly />
			<span v-else>N/A</span>
		</div>
	</div>

	<RatingModal
		:is-open="isModalOpen"
		title="Update Rating"
		:data="videoRating"
		@close="isModalOpen = false"
		@save="handleSaveRating"
	/>
</template>

<style scoped lang="scss">
	.video-metrics {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 8px 12px;
		font-size: 14px;
		font-weight: bold;
		color: #333;
		cursor: pointer;

		.rating-item {
			display: flex;
			align-items: center;
			gap: 6px;
		}
	}
</style>
