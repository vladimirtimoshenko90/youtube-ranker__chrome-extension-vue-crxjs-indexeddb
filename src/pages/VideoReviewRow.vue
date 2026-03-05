<script setup lang="ts">
	import type { VideoReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';

	defineProps<{ review: VideoReview }>();

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<template>
	<tr>
		<td>
			<a :href="review.videoUrl" target="_blank" class="video-link">
				{{ review.videoTitle || review.videoUrl }}
			</a>
		</td>
		<td class="review-cell">
			<Rating v-if="review.rating" :modelValue="review.rating" :readonly="true" :starSize="16" />
			<span v-else-if="review.skipped" class="skipped-label">not relevant</span>
			<div v-if="review.comment" class="review-comment">{{ review.comment }}</div>
			<div v-if="review.lastUpdated" class="review-date">
				{{ formatDate(review.lastUpdated) }}
			</div>
		</td>
	</tr>
</template>

<style scoped lang="scss">
	.video-link {
		color: #1a73e8;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.review-cell {
		width: 260px;

		.skipped-label {
			font-style: italic;
			color: #999;
			font-size: 0.85rem;
		}

		.review-comment {
			margin-top: 4px;
			color: #444;
			font-size: 0.85rem;
		}

		.review-date {
			margin-top: 2px;
			color: #999;
			font-size: 0.8rem;
		}
	}
</style>
