<script setup lang="ts">
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
</script>

<template>
	<div class="LayoutSite">
		<Header />
		<main>
			<slot />
		</main>
		<Footer />
	</div>
</template>

<style lang="scss" scoped>
.LayoutSite {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: 100vh;
	footer {
		margin-top: auto;
	}
}
</style>
