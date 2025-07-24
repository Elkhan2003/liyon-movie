<script setup lang="ts">
import { useGetTradingsQuery } from '~/api/trending';

const dateSwitcher = ref<'day' | 'week'>('day');

const {
	data: trendingData,
	isLoading: isLoadingTrending,
	isError: isErrorTrending
} = useGetTradingsQuery(dateSwitcher);

const handleSwitchDate = async (date: 'day' | 'week') => {
	dateSwitcher.value = date;
};
</script>

<template>
	<section class="Trending">
		<div class="container">
			<div class="content">
				<h1>Trending</h1>
				<div class="actions">
					<button @click="handleSwitchDate('day')">Day</button>
					<button @click="handleSwitchDate('week')">Week</button>
				</div>
				<div class="items">
					<p v-if="isLoadingTrending">loading...</p>
					<p v-if="isErrorTrending">error in trending</p>
					<div
						class="item"
						v-for="(item, index) in trendingData?.results"
						:key="index"
					>
						<p>{{ item.title }}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.Trending {
	.content {
	}
}
</style>
