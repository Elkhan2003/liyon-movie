<script setup lang="ts">
const counterStore = useCounterStore();
</script>

<template>
	<section class="Test">
		<div class="container">
			<div class="content">
				<h1>Count: {{ counterStore.count }}</h1>
				<button @click="counterStore.increment">+</button>
				<button @click="counterStore.decrement">-</button>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.Test {
	.content {
		button {
			padding: 10px 20px;
		}
	}
}
</style>
