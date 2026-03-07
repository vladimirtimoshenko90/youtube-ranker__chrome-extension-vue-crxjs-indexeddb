<script setup lang="ts">
	import type { VideoReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';
	import { Trash2, XCircle } from 'lucide-vue-next';
	import { formatDate } from '@/infrastructure/utils/dateUtils';

	const props = defineProps<{ review: VideoReview }>();
	const emit = defineEmits<{ delete: [] }>();

	function onDelete() {
		const title = props.review.videoTitle || props.review.videoUrl;
		if (confirm(`Remove review for "${title}"?\nThis cannot be undone.`)) {
			emit('delete');
		}
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
			<span v-else-if="review.skipped" class="skipped-label">
				<XCircle :size="20" class="skipped-label__icon" />
				not relevant
			</span>
			<div v-if="review.comment" class="review-comment">{{ review.comment }}</div>
			<div v-if="review.lastUpdated" class="review-date">
				{{ formatDate(review.lastUpdated) }}
			</div>
		</td>
		<td class="action-cell">
			<button class="delete-btn" @click="onDelete">
				<Trash2 :size="14" />
			</button>
		</td>
	</tr>
</template>

<style scoped lang="scss">
	.action-cell {
		width: 32px;
		text-align: center;
		padding: 0 4px;
	}

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
			display: inline-flex;
			align-items: center;
			gap: 4px;
			font-style: italic;
			color: #999;
			font-size: 0.85rem;

			&__icon {
				flex-shrink: 0;
				color: #e53e3e;
			}
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
