<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { MinusCircle, Trash2 } from 'lucide-vue-next';
	import RatingModal from './RatingModal.vue';
	import Rating from './Rating.vue';
	import type { RatingData } from '../common/rating-data';

	const props = defineProps<{
		videoRating: RatingData | null;
		authorRating: number | null;
		authorUrl: string | null;
		readOnly?: boolean;
	}>();

	const emit = defineEmits<{
		updateRating: [data: RatingData];
		deleteRating: [];
	}>();

	const isModalOpen = ref(false);

	const handleSaveRating = (data: RatingData) => {
		emit('updateRating', data);
	};

	const authorOverviewHref = computed(() => {
		if (!props.authorUrl) return null;
		const authorId = new URL(props.authorUrl).pathname.slice(1);
		return chrome.runtime.getURL(`src/pages/author-overview/author-overview.html?authorId=${authorId}`);
	});
</script>

<template>
	<div class="video-metrics" @click="!props.readOnly && (isModalOpen = true)">
		<span v-if="!videoRating" class="rate-prompt">{{ props.readOnly ? 'not rated yet' : 'Rate video?' }}</span>
		<span class="skipped" v-else-if="videoRating.skipped">
			<MinusCircle :size="14" />
			<span class="skipped__text">not relevant</span>
			<button v-if="!props.readOnly" class="delete-btn" @click.stop.prevent="emit('deleteRating')">
				<Trash2 :size="18" />
			</button>
		</span>
		<span v-else class="rating-row">
			<Rating :model-value="videoRating.rating" :star-size="24" readonly />
			<button v-if="!props.readOnly" class="delete-btn" @click.stop.prevent="emit('deleteRating')">
				<Trash2 :size="18" />
			</button>
		</span>

		<p v-if="videoRating?.comment" class="comment">{{ videoRating.comment }}</p>

		<div v-if="authorRating" class="author-rating">
			<Rating :model-value="authorRating" :star-size="15" readonly />
			<a v-if="authorOverviewHref" :href="authorOverviewHref" target="_blank" class="author-link" @click.stop>
				Author
			</a>
			<span v-else>Author</span>
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
		align-items: center;
		gap: 8px;
		padding: 6px 10px;
		font-size: 15px;
		color: #222;
		cursor: pointer;

		.rating-row {
			display: inline-flex;
			align-items: center;
			gap: 6px;
		}

		.delete-btn {
			display: flex;
			background: none;
			border: none;
			padding: 2px;
			cursor: pointer;
			color: #7e0707;
			&:hover {
				color: #dc2626;
			}
		}

		.rate-prompt {
			font-size: 18px;
		}

		.skipped {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			color: #dc2626;
			font-weight: 700;
			border: 2px solid rgba(220, 38, 38, 0.4);
			padding: 2px 7px 2px 5px;
			border-radius: 20px;

			&__text {
				font-size: 14px;
			}
		}

		.comment {
			margin: 0;
			color: #333;
			font-size: 13px;
			font-weight: 400;
			line-height: 1.4;
			max-width: 200px;
			max-height: 50px;
			overflow: hidden;
			word-break: break-word;
			text-align: center;
		}

		.author-rating {
			display: flex;
			align-items: center;
			gap: 5px;
		}

		.author-link {
			color: #2563eb;
			text-decoration: underline;
			&:hover {
				color: #1d4ed8;
				text-decoration: none;
			}
		}
	}
</style>
