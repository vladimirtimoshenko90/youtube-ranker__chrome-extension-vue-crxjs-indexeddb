<script setup lang="ts">
	import { ref, computed, watch } from 'vue';
	import Modal from './Modal.vue';
	import Rating from './Rating.vue';
	import type { RatingData } from '../common/rating-data';

	const props = withDefaults(
		defineProps<{
			isOpen: boolean;
			title: string;
			data?: RatingData;
		}>(),
		{
			data: () => ({
				rating: null,
				skipped: false,
				comment: ''
			})
		}
	);

	const emit = defineEmits<{
		close: [];
		save: [data: RatingData];
	}>();

	const formData = ref<RatingData>({ ...props.data });

	const isDataValid = computed(() => {
		return formData.value.rating !== null || formData.value.skipped;
	});

	const handleSave = () => {
		emit('save', {
			...formData.value,
			rating: formData.value.skipped ? null : formData.value.rating
		});
		emit('close');
	};

	const handleClose = () => {
		emit('close');
	};

	watch(
		() => props.data,
		(data) => {
			formData.value = { ...data };
		},
		{ deep: true }
	);
</script>

<template>
	<Modal :is-open="isOpen" :title="title" @close="handleClose">
		<div v-if="!formData.skipped" class="rating-section">
			<Rating v-model="formData.rating" :star-size="28" />
		</div>

		<label class="skip-label">
			<input v-model="formData.skipped" type="checkbox" />
			Not relevant for me
		</label>

		<textarea v-model="formData.comment" class="comment-input" placeholder="Add a comment..." rows="3"></textarea>

		<template #footer>
			<button class="btn-cancel" @click="handleClose">Cancel</button>
			<button class="btn-save" :disabled="!isDataValid" @click="handleSave">Save</button>
		</template>
	</Modal>
</template>

<style scoped lang="scss">
	.skip-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;

		input {
			cursor: pointer;
		}
	}

	.comment-input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-family: inherit;
		font-size: 13px;
		box-sizing: border-box;
		resize: vertical;

		&:focus {
			outline: none;
			border-color: #ffc107;
		}
	}

	button {
		padding: 6px 14px;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		font-size: 13px;
		font-weight: 500;

		&:hover {
			background-color: #f5f5f5;
		}

		&.btn-save {
			background-color: #10b981;
			border-color: #10b981;
			color: #fff;

			&:hover:not(:disabled) {
				background-color: #059669;
				border-color: #059669;
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}
</style>
