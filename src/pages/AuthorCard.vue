<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';
	import VideoReviewRow from './VideoReviewRow.vue';
	import { ref, computed } from 'vue';

	const props = defineProps<{ author: AuthorReview }>();

	const expanded = ref(false);

	const avg = computed(() => {
		const rated = props.author.reviews.filter((r) => !r.skipped && !!r.rating);
		if (!rated.length) return null;
		return rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;
	});
</script>

<template>
	<div class="author-card">
		<div class="author-header" :aria-expanded="expanded" @click="expanded = !expanded">
			<a class="author-name" :href="author.authorUrl" target="_blank" @click.stop>
				{{ author.authorName }}
			</a>
			<span class="author-meta">
				{{ author.reviews.length }} video{{ author.reviews.length !== 1 ? 's' : '' }}
				<Rating v-if="avg !== null" :modelValue="avg!" :readonly="true" :starSize="16" />
			</span>
		</div>

		<div v-if="expanded" class="reviews-table">
			<table>
				<thead>
					<tr>
						<th>Video</th>
						<th>Review</th>
					</tr>
				</thead>
				<tbody>
					<VideoReviewRow v-for="review in author.reviews" :key="review.videoUrl" :review="review" />
				</tbody>
			</table>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.author-card {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		margin-bottom: 12px;
		overflow: hidden;

		.author-header {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 12px 16px;
			cursor: pointer;
			background: #f8f8f8;
			user-select: none;

			&::before {
				content: '▶';
				font-size: 0.75rem;
				width: 16px;
				text-align: center;
				flex-shrink: 0;
			}
			&[aria-expanded='true']::before {
				content: '▼';
			}
			&:hover {
				background: #f0f0f0;
			}

			.author-name {
				font-weight: 600;
				color: #1a73e8;
				text-decoration: none;
				&:hover {
					text-decoration: underline;
				}
			}

			.author-meta {
				margin-left: auto;
				display: flex;
				align-items: center;
				gap: 8px;
				font-size: 0.85rem;
				color: #666;
				white-space: nowrap;
			}
		}

		.reviews-table {
			padding: 0 16px 16px;

			table {
				width: 100%;
				border-collapse: collapse;
				font-size: 0.9rem;
			}

			th {
				text-align: left;
				padding: 8px 10px;
				border-bottom: 2px solid #e0e0e0;
				font-weight: 600;
				font-size: 0.8rem;
				text-transform: uppercase;
				color: #666;
			}

			td {
				padding: 8px 10px;
				border-bottom: 1px solid #f0f0f0;
				vertical-align: top;
			}
			tr:last-child td {
				border-bottom: none;
			}
		}
	}
</style>
