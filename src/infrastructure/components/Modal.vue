<script setup lang="ts">
	import { onMounted, onUnmounted } from 'vue';

	const props = defineProps<{
		isOpen: boolean;
		title: string;
	}>();

	const emit = defineEmits<{
		close: [];
	}>();

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && props.isOpen) {
			emit('close');
		}
	};

	onMounted(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onUnmounted(() => {
		window.removeEventListener('keydown', handleKeydown);
	});
</script>

<template>
	<Teleport to="body">
		<div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
			<div class="modal-content">
				<div class="modal-header">
					<h2>{{ title }}</h2>
					<button class="close-btn" @click="$emit('close')">×</button>
				</div>

				<div class="modal-body">
					<slot></slot>
				</div>

				<div v-if="$slots.footer" class="modal-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<style scoped lang="scss">
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}

	.modal-content {
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		width: 90%;
		max-width: 480px;
		display: flex;
		flex-direction: column;

		.modal-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16px 20px;
			border-bottom: 1px solid #e0e0e0;

			h2 {
				margin: 0;
				font-size: 16px;
			}

			.close-btn {
				background: none;
				border: none;
				font-size: 24px;
				cursor: pointer;
				color: #999;
				padding: 0;
				width: 24px;
				height: 24px;

				&:hover {
					color: #333;
				}
			}
		}

		.modal-body {
			padding: 24px;
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 20px;
		}

		.modal-footer {
			display: flex;
			gap: 8px;
			justify-content: flex-end;
			padding: 12px 20px;
			border-top: 1px solid #e0e0e0;

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

					&:hover {
						background-color: #059669;
						border-color: #059669;
					}
				}
			}
		}
	}
</style>
