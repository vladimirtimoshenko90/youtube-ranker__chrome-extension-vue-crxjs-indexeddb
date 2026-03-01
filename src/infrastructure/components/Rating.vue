<script setup lang="ts">
	import { computed } from 'vue';
	import StarRating from 'vue3-star-ratings';

	const props = withDefaults(
		defineProps<{
			modelValue: number | null;
			readonly?: boolean;
			starSize?: number;
		}>(),
		{
			modelValue: null,
			readonly: false,
			starSize: 20
		}
	);

	const emit = defineEmits<{
		'update:modelValue': [value: number];
	}>();

	const rating = computed({
		get: () => props.modelValue ?? 0,
		set: (value: number) => {
			const rounded = props.readonly ? value : Math.ceil(value);
			emit('update:modelValue', rounded);
		}
	});
</script>

<template>
	<StarRating
		v-model="rating"
		:disable-click="readonly"
		:number-of-stars="5"
		:star-size="starSize"
		activeColor="#ffc107"
	/>
</template>
