<script setup lang="ts">
	import type { VideoReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';
	import { Trash2 } from 'lucide-vue-next';

	const props = defineProps<{ review: VideoReview }>();
	const emit = defineEmits<{ delete: [] }>();

	function onDelete() {
		const title = props.review.videoTitle || props.review.videoUrl;
		if (confirm(`Remove review for "${title}"?\nThis cannot be undone.`)) {
			emit('delete');
		}
	}

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
		<td class="action-cell">
			<button class="delete-btn" title="Remove this review" @click="onDelete">
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

	.delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: #bbb;
		padding: 4px;
		border-radius: 4px;
		cursor: pointer;
		transition:
			color 0.15s,
			background 0.15s;

		&:hover {
			color: #e53e3e;
			background: #fff0f0;
		}
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
