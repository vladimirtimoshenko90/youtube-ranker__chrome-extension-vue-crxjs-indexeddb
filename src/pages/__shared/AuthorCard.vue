<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';
	import ExpandToggle from '@/infrastructure/components/ExpandToggle.vue';
	import { Trash2 } from 'lucide-vue-next';
	import VideoReviewsTable from './VideoReviewsTable.vue';
	import { ref, computed } from 'vue';

	const props = defineProps<{ author: AuthorReview; alwaysExpanded?: boolean }>();
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
		<div
			class="author-card__header"
			:class="{ 'author-card__header--static': alwaysExpanded }"
			@click="!alwaysExpanded && (expanded = !expanded)"
		>
			<ExpandToggle v-if="!alwaysExpanded" :expanded="expanded" />

			<a class="author-card__name" :href="author.authorUrl" target="_blank" @click.stop>
				{{ author.authorName }}
			</a>
			<span class="secondary-url">{{ author.authorUrl }}</span>

			<div class="author-card__details">
				<span class="author-card__count">
					{{ author.reviews.length }} video{{ author.reviews.length !== 1 ? 's' : '' }}
				</span>
				<Rating v-if="avg !== null" :modelValue="avg!" :readonly="true" :starSize="20" />
				<button class="delete-btn" @click.stop="onDeleteAuthor">
					<Trash2 :size="14" />
				</button>
			</div>
		</div>

		<div v-if="alwaysExpanded || expanded" class="author-card__body">
			<hr class="author-card__divider" />
			<VideoReviewsTable
				:reviews="author.reviews"
				@delete-review="(videoUrl) => emit('delete-review', author.authorUrl, videoUrl)"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.author-card {
		background: #fff;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.04),
			0 4px 12px rgba(0, 0, 0, 0.03);
		overflow: hidden;
		transition: box-shadow 0.2s ease;

		&:hover {
			box-shadow:
				0 2px 4px rgba(0, 0, 0, 0.06),
				0 6px 16px rgba(0, 0, 0, 0.04);
		}

		&__header {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 16px 24px;
			cursor: pointer;
			user-select: none;
			transition: background 0.15s;

			&:hover {
				background: #f8f9fa;
			}

			&--static {
				cursor: default;
				&:hover {
					background: transparent;
				}
			}
		}

		&__name {
			font-weight: 600;
			font-size: 0.95rem;
			color: #2563eb;
			text-decoration: none;
			letter-spacing: -0.01em;

			&:hover {
				color: #1d4ed8;
				text-decoration: underline;
			}
		}

		&__details {
			margin-left: auto;
			display: flex;
			align-items: center;
			gap: 12px;
		}

		&__count {
			font-size: 0.8rem;
			color: #8b95a5;
			background: #f0f2f5;
			padding: 3px 10px;
			border-radius: 20px;
			white-space: nowrap;
			font-weight: 500;
		}

		&__body {
			padding: 0 24px;
		}

		&__divider {
			border: none;
			border-top: 1px solid #f0f1f3;
			margin: 0 0 4px;
		}
	}
</style>
