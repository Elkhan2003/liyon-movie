<script setup lang="ts">
import Welcome from './sections/Welcome.vue';
import Trending from './sections/Trending.vue';
import Popular from './sections/Popular.vue';
import TopRated from './sections/TopRated.vue';
</script>

<template>
	<NuxtLayout name="site">
		<Welcome />
		<Trending />
		<Popular />
		<TopRated />
	</NuxtLayout>
</template>

<style lang="scss" scoped></style>
