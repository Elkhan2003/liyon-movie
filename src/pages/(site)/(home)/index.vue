<script setup lang="ts">
import Welcome from './sections/Welcome.vue';
import Trending from './sections/Trending.vue';
import About from './sections/About.vue';
</script>

<template>
	<NuxtLayout name="site">
		<Welcome />
		<Trending />
		<About />
	</NuxtLayout>
</template>

<style lang="scss" scoped></style>
