<script setup lang="ts">
import { useGetUpcomingQuery } from '~/api/upcoming';

const { data: upcomingData } = useGetUpcomingQuery();
</script>

<template>
	<section class="Welcome">
		<div class="container">
			<h1>Welcome</h1>
		</div>
	</section>
</template>

<style lang="scss" scoped></style>
