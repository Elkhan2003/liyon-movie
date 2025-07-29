<script setup lang="ts">
import Header from '~/components/layout/Header.vue';
import Footer from '~/components/layout/Footer.vue';

const route = useRoute();
</script>

<template>
	<div class="LayoutSite">
		<Header />
		<main class="main" :class="route.path === '/' && 'active'">
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
	.main {
		&.active {
			position: relative;
			top: -80px;
			/* padding-top: 80px; */
		}
	}
	footer {
		margin-top: auto;
	}
}
</style>
