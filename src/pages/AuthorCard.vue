<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';
	import ExpandToggle from '@/infrastructure/components/ExpandToggle.vue';
	import { Trash2 } from 'lucide-vue-next';
	import VideoReviewsTable from './VideoReviewsTable.vue';
	import { ref, computed } from 'vue';

	const props = defineProps<{ author: AuthorReview }>();
	const emit = defineEmits<{
		'delete-author': [authorUrl: string];
		'delete-review': [authorUrl: string, videoUrl: string];
	}>();

	const expanded = ref(false);

	function onDeleteAuthor() {
		const count = props.author.reviews.length;
		if (confirm(`Remove "${props.author.authorName}" and all ${count} review(s)?\nThis cannot be undone.`)) {
			emit('delete-author', props.author.authorUrl);
		}
	}

	const avg = computed(() => {
		const rated = props.author.reviews.filter((r) => !r.skipped && !!r.rating);
		if (!rated.length) return null;
		return rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;
	});
</script>

<template>
	<div class="author-card">
		<div class="author-header" @click="expanded = !expanded">
			<ExpandToggle :expanded="expanded" />
			<a class="author-name" :href="author.authorUrl" target="_blank" @click.stop>
				{{ author.authorName }}
			</a>
			<span class="author-meta">
				{{ author.reviews.length }} video{{ author.reviews.length !== 1 ? 's' : '' }}
				<Rating v-if="avg !== null" :modelValue="avg!" :readonly="true" :starSize="16" />
			</span>
			<button class="delete-author-btn" title="Remove author and all reviews" @click.stop="onDeleteAuthor">
				<Trash2 :size="15" />
			</button>
		</div>

		<div v-if="expanded" class="reviews-table">
			<VideoReviewsTable
				:reviews="author.reviews"
				@delete-review="(videoUrl) => emit('delete-review', author.authorUrl, videoUrl)"
			/>
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

			.delete-author-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				background: transparent;
				border: none;
				color: #ccc;
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
		}

		.reviews-table {
			padding: 0 16px 16px;
		}
	}
</style>
