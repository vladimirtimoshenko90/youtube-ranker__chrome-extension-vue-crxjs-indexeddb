<script setup lang="ts">
	defineProps<{ expanded: boolean }>();
</script>

<template>
	<span class="expand-toggle">{{ expanded ? '▼' : '▶' }}</span>
</template>

<style scoped>
	.expand-toggle {
		font-size: 0.75rem;
		width: 16px;
		text-align: center;
		flex-shrink: 0;
	}
</style>
