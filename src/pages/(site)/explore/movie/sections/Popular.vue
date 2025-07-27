<script setup lang="ts">
import { ref } from 'vue';

const counter = ref(0);

const handlePlus = (event: MouseEvent) => {
	console.log(event);
	counter.value += 1;
};

const handleMinus = (event: MouseEvent) => {
	console.log(event);
	counter.value -= 1;
};
</script>

<template>
	<section class="Popular">
		<div class="container">
			<div class="content">
				<h1>Popular</h1>
				<div class="counter">
					<p>{{ counter }}</p>
					<div class="actions">
						<button @click="handleMinus">-</button>
						<button @click="handlePlus">+</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.Popular {
	.content {
		.counter {
			.actions {
				display: flex;
				gap: 10px;
				align-items: center;
				button {
					padding: 10px 20px;
				}
			}
		}
	}
}
</style>
