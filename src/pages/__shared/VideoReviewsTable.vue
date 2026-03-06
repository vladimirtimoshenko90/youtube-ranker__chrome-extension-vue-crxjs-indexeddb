<script setup lang="ts">
	import type { VideoReview } from '@/infrastructure/storage';
	import VideoReviewRow from './VideoReviewRow.vue';

	defineProps<{ reviews: VideoReview[] }>();
	const emit = defineEmits<{ 'delete-review': [videoUrl: string] }>();
</script>

<template>
	<table>
		<thead>
			<tr>
				<th>Video</th>
				<th>Review</th>
				<th class="action-col"></th>
			</tr>
		</thead>
		<tbody>
			<VideoReviewRow
				v-for="review in reviews"
				:key="review.videoUrl"
				:review="review"
				@delete="emit('delete-review', review.videoUrl)"
			/>
		</tbody>
	</table>
</template>

<style scoped lang="scss">
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

	.action-col {
		width: 32px;
	}
</style>
