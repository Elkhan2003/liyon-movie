<script setup lang="ts">
import Popular from './sections/Popular.vue';
import Trending from './sections/Trending.vue';
</script>

<template>
	<NuxtLayout name="site">
		<Trending />
		<Popular />
	</NuxtLayout>
</template>

<style lang="scss" scoped></style>
