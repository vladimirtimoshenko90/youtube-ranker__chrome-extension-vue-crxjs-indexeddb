<script setup lang="ts">
	import type { AuthorReview } from '@/infrastructure/storage';
	import type { VideoReview } from '@/infrastructure/storage';
	import Rating from '@/infrastructure/components/Rating.vue';
	import { STORAGE_MESSAGE_ACTIONS } from '@/service-worker/storage-messages/registerStorageMessageHandlers';
	import { ref, computed, onMounted } from 'vue';

	const authors = ref<AuthorReview[]>([]);
	const expandedAuthors = ref<Set<string>>(new Set());
	const loading = ref(true);

	const sortedAuthors = computed(() => [...authors.value].sort((a, b) => b.lastUpdated - a.lastUpdated));

	function toggleAuthor(authorUrl: string) {
		if (expandedAuthors.value.has(authorUrl)) {
			expandedAuthors.value.delete(authorUrl);
		} else {
			expandedAuthors.value.add(authorUrl);
		}
	}

	function isExpanded(authorUrl: string) {
		return expandedAuthors.value.has(authorUrl);
	}

	function averageRating(reviews: VideoReview[]): number | null {
		const rated = reviews.filter((r) => !r.skipped && !!r.rating);
		if (!rated.length) return null;
		return rated.reduce((sum, r) => sum + r.rating, 0) / rated.length;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	onMounted(async () => {
		try {
			authors.value = await chrome.runtime.sendMessage({
				action: STORAGE_MESSAGE_ACTIONS.LIST_AUTHORS
			});
		} catch (e) {
			console.error('Failed to load authors:', e);
		} finally {
			loading.value = false;
		}
	});
</script>

<template>
	<div class="overview">
		<h1>YouTube Ranker — Overview</h1>

		<p v-if="loading" class="status">Loading…</p>
		<p v-else-if="!sortedAuthors.length" class="status">No reviews yet.</p>

		<div v-else class="author-list">
			<div v-for="author in sortedAuthors" :key="author.authorUrl" class="author-card">
				<div class="author-header" @click="toggleAuthor(author.authorUrl)">
					<span class="toggle-icon">{{ isExpanded(author.authorUrl) ? '▼' : '▶' }}</span>
					<a class="author-name" :href="author.authorUrl" target="_blank" @click.stop>
						{{ author.authorName }}
					</a>
					<span class="author-meta">
						{{ author.reviews.length }} video{{ author.reviews.length !== 1 ? 's' : '' }}
						<Rating
							v-if="averageRating(author.reviews) !== null"
							:modelValue="averageRating(author.reviews)!"
							:readonly="true"
							:starSize="16"
						/>
					</span>
				</div>

				<div v-if="isExpanded(author.authorUrl)" class="reviews-table">
					<table>
						<thead>
							<tr>
								<th>Video</th>
								<th>Rating</th>
								<th>Comment</th>
								<th>Skipped</th>
								<th>Updated</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="review in author.reviews" :key="review.videoUrl">
								<td>
									<a :href="review.videoUrl" target="_blank" class="video-link">
										{{ review.videoTitle || review.videoUrl }}
									</a>
								</td>
								<td class="rating-cell">
									<Rating
										v-if="review.rating"
										:modelValue="review.rating"
										:readonly="true"
										:starSize="16"
									/>
									<span v-else class="no-rating">—</span>
								</td>
								<td class="comment-cell">{{ review.comment || '' }}</td>
								<td class="skipped-cell">{{ review.skipped ? 'Yes' : '' }}</td>
								<td class="date-cell">
									{{ review.lastUpdated ? formatDate(review.lastUpdated) : '' }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
