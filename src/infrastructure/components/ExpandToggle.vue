<script setup lang="ts">
	import { ChevronRight } from 'lucide-vue-next';

	defineProps<{ expanded: boolean }>();
</script>

<template>
	<span class="expand-toggle" :class="{ 'expand-toggle--open': expanded }">
		<ChevronRight :size="16" />
	</span>
</template>

<style scoped>
	.expand-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		color: #999;
		transition: transform 0.2s ease;
	}

	.expand-toggle--open {
		transform: rotate(90deg);
	}
</style>
