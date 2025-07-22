<script setup lang="ts">
import { ref, computed } from 'vue';
import {
	useCreateTodoMutation,
	useDeleteTodoMutation,
	useGetTodosQuery,
	useUpdateTodoMutation
} from '~/api/todo';

// Reactive state
const newTodoTitle = ref('');
const editingTodo = ref<{ id: number; title: string } | null>(null);
const editTitleInput = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// API queries and mutations
const {
	data: todosData,
	isLoading,
	error
} = useGetTodosQuery({
	page: currentPage.value,
	limit: itemsPerPage.value
});

const createTodoMutation = useCreateTodoMutation();
const updateTodoMutation = useUpdateTodoMutation();
const deleteTodoMutation = useDeleteTodoMutation();

// Computed properties
const todos = computed(() => todosData.value?.items || []);
const totalPages = computed(() => todosData.value?.meta.total_pages || 1);
const totalItems = computed(() => todosData.value?.meta.total_items || 0);

// Methods
const addTodo = async () => {
	if (!newTodoTitle.value.trim()) return;

	try {
		await createTodoMutation.mutateAsync({
			title: newTodoTitle.value.trim()
		});
		newTodoTitle.value = '';
	} catch (error) {
		console.error('Error creating todo:', error);
	}
};

const startEditing = (todo: ITodoData) => {
	editingTodo.value = { id: todo.id, title: todo.title };
	editTitleInput.value = todo.title;
};

const cancelEditing = () => {
	editingTodo.value = null;
	editTitleInput.value = '';
};

const saveTodo = async () => {
	if (!editingTodo.value || !editTitleInput.value.trim()) return;

	try {
		await updateTodoMutation.mutateAsync({
			id: editingTodo.value.id,
			data: { title: editTitleInput.value.trim() }
		});
		cancelEditing();
	} catch (error) {
		console.error('Error updating todo:', error);
	}
};

const deleteTodo = async (id: number) => {
	if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;

	try {
		await deleteTodoMutation.mutateAsync(id);
	} catch (error) {
		console.error('Error deleting todo:', error);
	}
};

const goToPage = (page: number) => {
	if (page >= 1 && page <= totalPages.value) {
		currentPage.value = page;
	}
};

// Handle keyboard events
const handleKeyPress = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		addTodo();
	}
};

const handleEditKeyPress = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		saveTodo();
	} else if (event.key === 'Escape') {
		cancelEditing();
	}
};
</script>

<template>
	<NuxtLayout name="site">
		<section class="todo">
			<div class="container">
				<h1 class="todo__title">Todo List</h1>

				<!-- Add new todo -->
				<div class="todo__add">
					<input
						v-model="newTodoTitle"
						type="text"
						placeholder="Добавить новую задачу..."
						class="todo__input"
						@keypress="handleKeyPress"
						:disabled="createTodoMutation.isPending.value"
					/>
					<button
						@click="addTodo"
						class="todo__button todo__button--primary"
						:disabled="
							!newTodoTitle.trim() || createTodoMutation.isPending.value
						"
					>
						<span v-if="createTodoMutation.isPending.value">Добавление...</span>
						<span v-else>Добавить</span>
					</button>
				</div>

				<!-- Loading state -->
				<div v-if="isLoading" class="todo__loading">Загрузка...</div>

				<!-- Error state -->
				<div v-else-if="error" class="todo__error">
					Ошибка: {{ error.message }}
				</div>

				<!-- Todo list -->
				<div v-else class="todo__list">
					<div v-if="todos.length === 0" class="todo__empty">
						Нет задач. Добавьте первую задачу!
					</div>

					<div v-for="todo in todos" :key="todo.id" class="todo__item">
						<!-- Edit mode -->
						<div v-if="editingTodo?.id === todo.id" class="todo__edit">
							<input
								v-model="editTitleInput"
								type="text"
								class="todo__edit-input"
								@keydown="handleEditKeyPress"
								@blur="saveTodo"
								ref="editInput"
							/>
							<div class="todo__edit-actions">
								<button
									@click="saveTodo"
									class="todo__button todo__button--small todo__button--success"
									:disabled="updateTodoMutation.isPending.value"
								>
									✓
								</button>
								<button
									@click="cancelEditing"
									class="todo__button todo__button--small todo__button--secondary"
								>
									✕
								</button>
							</div>
						</div>

						<!-- View mode -->
						<div v-else class="todo__view">
							<span class="todo__text">{{ todo.title }}</span>
							<div class="todo__actions">
								<button
									@click="startEditing(todo)"
									class="todo__button todo__button--small"
									title="Редактировать"
								>
									✏️
								</button>
								<button
									@click="deleteTodo(todo.id)"
									class="todo__button todo__button--small todo__button--danger"
									title="Удалить"
									:disabled="deleteTodoMutation.isPending.value"
								>
									🗑️
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Pagination -->
				<div v-if="totalPages > 1" class="todo__pagination">
					<button
						@click="goToPage(currentPage - 1)"
						:disabled="currentPage === 1"
						class="todo__button todo__button--small"
					>
						‹ Предыдущая
					</button>

					<span class="todo__page-info">
						Страница {{ currentPage }} из {{ totalPages }} ({{ totalItems }}
						задач всего)
					</span>

					<button
						@click="goToPage(currentPage + 1)"
						:disabled="currentPage === totalPages"
						class="todo__button todo__button--small"
					>
						Следующая ›
					</button>
				</div>
			</div>
		</section>
	</NuxtLayout>
</template>

<style lang="scss" scoped>
.todo {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20px 0;

	&__title {
		text-align: center;
		color: white;
		font-size: 2.5rem;
		margin-bottom: 2rem;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	&__add {
		background: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		margin-bottom: 30px;
		display: flex;
		gap: 12px;
	}

	&__input {
		flex: 1;
		padding: 12px 16px;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.2s, box-shadow 0.2s;

		&:focus {
			outline: none;
			border-color: #667eea;
			box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
		}

		&:disabled {
			background: #f8f9fa;
			cursor: not-allowed;
		}
	}

	&__button {
		padding: 12px 24px;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 14px;

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		&--primary {
			background: #667eea;
			color: white;

			&:hover:not(:disabled) {
				background: #5a67d8;
				transform: translateY(-1px);
			}
		}

		&--secondary {
			background: #e2e8f0;
			color: #4a5568;

			&:hover:not(:disabled) {
				background: #cbd5e0;
			}
		}

		&--success {
			background: #48bb78;
			color: white;

			&:hover:not(:disabled) {
				background: #38a169;
			}
		}

		&--danger {
			background: #f56565;
			color: white;

			&:hover:not(:disabled) {
				background: #e53e3e;
			}
		}

		&--small {
			padding: 8px 12px;
			font-size: 12px;
		}
	}

	&__loading,
	&__error {
		text-align: center;
		padding: 40px;
		background: white;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	&__error {
		color: #e53e3e;
		font-weight: 600;
	}

	&__list {
		background: white;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	&__empty {
		padding: 60px 20px;
		text-align: center;
		color: #a0aec0;
		font-style: italic;
		font-size: 18px;
	}

	&__item {
		border-bottom: 1px solid #e2e8f0;

		&:last-child {
			border-bottom: none;
		}
	}

	&__view,
	&__edit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		min-height: 60px;
	}

	&__text {
		flex: 1;
		font-size: 16px;
		color: #2d3748;
		line-height: 1.5;
	}

	&__actions,
	&__edit-actions {
		display: flex;
		gap: 8px;
	}

	&__edit {
		background: #f7fafc;
	}

	&__edit-input {
		flex: 1;
		padding: 8px 12px;
		border: 2px solid #e2e8f0;
		border-radius: 6px;
		font-size: 16px;
		margin-right: 12px;

		&:focus {
			outline: none;
			border-color: #667eea;
		}
	}

	&__pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		padding: 0 20px;
	}

	&__page-info {
		color: white;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}
}

@media (max-width: 768px) {
	.todo {
		&__add {
			flex-direction: column;
		}

		&__view,
		&__edit {
			flex-direction: column;
			align-items: stretch;
			gap: 12px;
		}

		&__actions,
		&__edit-actions {
			justify-content: center;
		}

		&__pagination {
			flex-direction: column;
			gap: 12px;
			text-align: center;
		}
	}
}
</style>
