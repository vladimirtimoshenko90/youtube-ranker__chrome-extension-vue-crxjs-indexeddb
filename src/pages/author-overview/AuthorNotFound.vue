<script setup lang="ts">
	defineProps<{ authorId?: string | null }>();
</script>

<template>
	<div class="not-found">
		<span class="not-found__emoji">📭</span>
		<p class="not-found__title">No reviews found</p>
		<p v-if="authorId" class="not-found__subtitle">
			There are no saved reviews for <b>{{ authorId }}</b
			>.
		</p>
	</div>
</template>

<style scoped lang="scss">
	.not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin-top: 60px;
		padding: 48px 40px;
		text-align: center;
		background: #f9f9f9;
		border: 1px solid #ebebeb;
		border-radius: 16px;

		&__emoji {
			font-size: 2.8rem;
			line-height: 1;
			user-select: none;
		}

		&__title {
			font-size: 1.1rem;
			font-weight: 600;
			color: #444;
			margin: 0;
		}

		&__subtitle {
			font-size: 0.875rem;
			color: #999;
			margin: 0;
			line-height: 1.6;
		}
	}
</style>
