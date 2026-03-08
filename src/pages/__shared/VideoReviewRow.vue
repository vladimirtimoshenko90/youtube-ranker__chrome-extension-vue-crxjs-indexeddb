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
	<div class="review-row">
		<div class="review-row__video">
			<a :href="review.videoUrl" target="_blank" class="review-row__link">
				{{ review.videoTitle || review.videoUrl }}
			</a>
			<span v-if="review.videoTitle" class="secondary-url">{{ review.videoUrl }}</span>
		</div>

		<div class="review-row__info">
			<div class="review-row__rating">
				<Rating v-if="review.rating" :modelValue="review.rating" :readonly="true" :starSize="15" />
				<span v-else-if="review.skipped" class="review-row__skipped">
					<XCircle :size="13" />
					not relevant
				</span>
			</div>
			<p v-if="review.comment" class="review-row__comment">{{ review.comment }}</p>
			<span v-if="review.lastUpdated" class="review-row__date">
				{{ formatDate(review.lastUpdated) }}
			</span>
		</div>

		<button class="delete-btn" @click="onDelete">
			<Trash2 :size="14" />
		</button>
	</div>
</template>

<style scoped lang="scss">
	.review-row {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding: 14px 0;
		border-bottom: 1px solid #f0f1f3;
		transition: background 0.12s;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background: #fafbfc;
			margin: 0 -8px;
			padding-left: 8px;
			padding-right: 8px;
			border-radius: 8px;
		}

		&__video {
			flex: 1;
			min-width: 0;
		}

		&__link {
			color: #2563eb;
			text-decoration: none;
			font-size: 0.86rem;
			line-height: 1.5;
			word-break: break-word;

			&:hover {
				color: #1d4ed8;
				text-decoration: underline;
			}
		}

		&__info {
			flex-shrink: 0;
			width: 180px;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 4px;
		}

		&__rating {
			display: flex;
			align-items: center;
		}

		&__skipped {
			display: inline-flex;
			align-items: center;
			gap: 5px;
			color: #ef4444;
			font-size: 0.78rem;
			font-weight: 500;
			background: rgba(239, 68, 68, 0.06);
			padding: 2px 9px;
			border-radius: 20px;
		}

		&__comment {
			margin: 0;
			color: #4b5563;
			font-size: 0.8rem;
			line-height: 1.45;
		}

		&__date {
			color: #b0b7c3;
			font-size: 0.72rem;
		}

		.delete-btn {
			flex-shrink: 0;
			align-self: center;
		}
	}
</style>
