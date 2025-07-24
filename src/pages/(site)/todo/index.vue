<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGetTodosQuery } from '~/api/todo';

// Reactive state
const currentPage = ref(1);
const itemsPerPage = ref(10);

// API queries and mutations
const { data: todosData, isLoading: isLoadingTodo } = useGetTodosQuery({
	page: currentPage.value,
	limit: itemsPerPage.value
});
</script>

<template>
	<NuxtLayout name="site">
		<section class="todo">
			<div class="container">
				<h1 class="todo__title">Todo List</h1>

				<!-- Loading state -->
				<div v-if="isLoadingTodo" class="todo__loading">Загрузка...</div>

				<!-- Todo list -->
				<div v-else class="todo__list">
					<div v-if="todosData?.items.length === 0" class="todo__empty">
						Нет задач. Добавьте первую задачу!
					</div>

					<div
						v-for="(item, index) in todosData?.items"
						:key="index"
						class="todo__item"
					>
						<div class="todo__view">
							<span class="todo__text">{{ item.title }}</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	</NuxtLayout>
</template>

<style lang="scss" scoped></style>
