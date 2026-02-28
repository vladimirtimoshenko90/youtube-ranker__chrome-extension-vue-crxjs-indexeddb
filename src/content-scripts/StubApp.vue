<script setup lang="ts">
	import { ref } from 'vue';

	defineProps<{ title: string }>();

	const show = ref(false);
	const toggle = () => (show.value = !show.value);
</script>

<template>
	<div class="popup-container">
		<div v-show="show">
			<h1>HELLO CRXJS</h1>
		</div>
		<button @click="toggle()">{{ title }}</button>
	</div>
</template>

<style scoped lang="scss">
	.popup-container {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 100;

		img {
			width: 100px;
			height: 100px;
		}
	}
</style>
