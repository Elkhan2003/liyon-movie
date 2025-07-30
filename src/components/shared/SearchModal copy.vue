<script setup lang="ts">
import { Search, X, Loader2 } from 'lucide-vue-next';
import { useGetSearchQuery } from '~/api/search';
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useRouter } from 'vue-router';

const searchStore = useSearchStore();
const router = useRouter();

const searchInput = ref('');
const debouncedSearchInput = ref('');
const currentPage = ref(1);

const searchParams = computed(() => ({
	search: debouncedSearchInput.value.trim(),
	page: currentPage.value
}));

const searchQuery = useGetSearchQuery(searchParams, {
	enabled: computed(() => debouncedSearchInput.value.trim().length > 0)
});

const getYearFromDate = (dateString: string | undefined): string => {
	if (!dateString) return 'Неизвестно';
	try {
		return new Date(dateString).getFullYear().toString();
	} catch {
		return 'Неизвестно';
	}
};

const getItemYear = (item: any): string => {
	const dateString = item.release_date || item.first_air_date;
	return getYearFromDate(dateString);
};

const closeModal = () => {
	searchStore.toggleSearchModal();
	searchInput.value = '';
	debouncedSearchInput.value = '';
	currentPage.value = 1;
};

const handleItemClick = (item: any) => {
	closeModal();
	if (item.media_type === 'movie') {
		router.push(`/movie/${item.id}`);
	} else if (item.media_type === 'tv') {
		router.push(`/tv/${item.id}`);
	} else if (item.media_type === 'person') {
		router.push(`/person/${item.id}`);
	}
};

const debouncedSearch = useDebounceFn((value: string) => {
	debouncedSearchInput.value = value;
	currentPage.value = 1;
}, 300);

watch(searchInput, (newValue) => {
	debouncedSearch(newValue);
});
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="searchStore.isOpen" class="modal_overlay" @click="closeModal">
				<div class="modal_content" @click.stop>
					<button class="close_btn" @click="closeModal" aria-label="Закрыть">
						<X />
					</button>

					<div class="search_content">
						<h1 class="search_title">Поиск</h1>
						<div class="search_input_wrapper">
							<Search class="search_icon" :size="20" />
							<input
								v-model="searchInput"
								type="text"
								placeholder="Название фильма/сериала"
								class="search_input"
								autofocus
								@keydown.stop
							/>
						</div>
					</div>

					<div class="results_content">
						<!-- Состояние загрузки -->
						<div v-if="searchQuery.isLoading.value" class="loading_state">
							<Loader2 class="loading_icon" :size="24" />
							<p>Поиск...</p>
						</div>

						<!-- Состояние ошибки -->
						<div v-else-if="searchQuery.isError.value" class="error_state">
							<p>Произошла ошибка при поиске</p>
						</div>

						<!-- Результаты поиска - используем debouncedSearchInput для отображения -->
						<div
							v-else-if="searchQuery.data.value && debouncedSearchInput.trim()"
							class="search_results"
						>
							<div
								v-if="searchQuery.data.value.results.length === 0"
								class="no_results"
							>
								<p>Ничего не найдено для "{{ debouncedSearchInput }}"</p>
							</div>

							<div v-else class="results_grid">
								<div
									v-for="item in searchQuery.data.value.results"
									:key="item.id"
									class="result_item"
									@click="handleItemClick(item)"
								>
									<div class="result_poster">
										<img
											v-if="item.poster_path"
											:src="`https://image.tmdb.org/t/p/w200${item.poster_path}`"
											:alt="item.title || item.name"
											class="poster_image"
										/>
										<div v-else class="poster_placeholder">
											<Search :size="24" />
										</div>
									</div>

									<div class="result_info">
										<h3 class="result_title">
											{{ item.title || item.name }}
										</h3>
										<p class="result_year">
											{{ getItemYear(item) }}
										</p>
										<p class="result_type">
											{{
												item.media_type === 'movie'
													? 'Фильм'
													: item.media_type === 'tv'
													? 'Сериал'
													: 'Персона'
											}}
										</p>
									</div>
								</div>
							</div>

							<!-- Пагинация -->
							<div
								v-if="searchQuery.data.value.total_pages > 1"
								class="pagination"
							>
								<button
									:disabled="currentPage === 1"
									@click="currentPage--"
									class="pagination_btn"
								>
									Предыдущая
								</button>

								<span class="pagination_info">
									{{ currentPage }} из {{ searchQuery.data.value.total_pages }}
								</span>

								<button
									:disabled="currentPage === searchQuery.data.value.total_pages"
									@click="currentPage++"
									class="pagination_btn"
								>
									Следующая
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style lang="scss" scoped>
.modal_overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	display: flex;
	align-items: flex-start;
	justify-content: center;
	z-index: 99999;
	padding: 0;

	.modal_content {
		width: 100%;
		height: 100%;
		background: transparent;
		position: relative;
		display: flex;
		flex-direction: column;

		.close_btn {
			position: absolute;
			top: 2rem;
			right: 2rem;
			width: 2.5rem;
			height: 2.5rem;
			background: transparent;
			border: none;
			color: white;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			transition: all 0.2s ease;
			z-index: 10;

			&:hover {
				background: rgba(255, 255, 255, 0.1);
				transform: scale(1.1);
			}

			&:active {
				transform: scale(0.95);
			}
		}

		.search_content {
			padding: 2.5rem 4rem 1rem 4rem;
			margin: 0 auto;
			width: 100%;

			.search_title {
				color: white;
				font-size: 3rem;
				font-weight: 700;
				margin-bottom: 20px;
				text-align: left;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
					sans-serif;
			}

			.search_input_wrapper {
				position: relative;
				display: flex;
				align-items: center;

				.search_icon {
					position: absolute;
					left: 12px;
					color: rgba(255, 255, 255, 0.6);
					z-index: 1;
					transition: color 0.3s ease;
				}

				.search_input {
					width: 100%;
					background: transparent;
					border: none;
					border-bottom: 1.5px solid transparent;
					border-image: linear-gradient(
							90deg,
							rgba(255, 255, 255, 0.1),
							rgba(200, 162, 255, 0.6),
							rgba(255, 255, 255, 0.1)
						)
						1;
					color: #ffffffba;
					font-size: 16px;
					padding: 13px 0 13px 2.7rem;
					outline: none;
					transition: all 0.3s ease;

					&::placeholder {
						color: rgba(255, 255, 255, 0.6);
					}

					&:focus {
						border-image: linear-gradient(
								90deg,
								rgba(147, 112, 219, 0.4),
								rgba(200, 162, 255, 0.9),
								rgba(147, 112, 219, 0.4)
							)
							1;
					}
				}

				&:focus-within .search_icon {
					color: rgba(255, 255, 255, 0.8);
				}
			}
		}

		.results_content {
			flex: 1;
			padding: 2rem 4rem;
			overflow-y: auto;

			.loading_state,
			.error_state,
			.no_results {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: rgba(255, 255, 255, 0.8);
				text-align: center;
				padding: 2rem;

				.loading_icon {
					animation: spin 1s linear infinite;
					margin-bottom: 1rem;
				}
			}

			.search_results {
				.results_grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
					gap: 1.5rem;
					margin-bottom: 2rem;

					.result_item {
						background: rgba(255, 255, 255, 0.05);
						border-radius: 8px;
						padding: 1rem;
						cursor: pointer;
						transition: all 0.3s ease;
						border: 1px solid transparent;

						&:hover {
							background: rgba(255, 255, 255, 0.1);
							border-color: rgba(200, 162, 255, 0.3);
							transform: translateY(-2px);
						}

						.result_poster {
							width: 100%;
							aspect-ratio: 2/3;
							margin-bottom: 0.5rem;
							border-radius: 6px;
							overflow: hidden;

							.poster_image {
								width: 100%;
								height: 100%;
								object-fit: cover;
							}

							.poster_placeholder {
								width: 100%;
								height: 100%;
								background: rgba(255, 255, 255, 0.1);
								display: flex;
								align-items: center;
								justify-content: center;
								color: rgba(255, 255, 255, 0.5);
							}
						}

						.result_info {
							.result_title {
								color: white;
								font-size: 0.9rem;
								font-weight: 600;
								margin-bottom: 0.25rem;
								line-height: 1.2;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								overflow: hidden;
							}

							.result_year,
							.result_type {
								color: rgba(255, 255, 255, 0.7);
								font-size: 0.8rem;
								margin-bottom: 0.1rem;
							}
						}
					}
				}

				.pagination {
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 1rem;
					margin-top: 2rem;

					.pagination_btn {
						background: rgba(255, 255, 255, 0.1);
						border: 1px solid rgba(255, 255, 255, 0.2);
						color: white;
						padding: 0.5rem 1rem;
						border-radius: 6px;
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover:not(:disabled) {
							background: rgba(255, 255, 255, 0.2);
						}

						&:disabled {
							opacity: 0.5;
							cursor: not-allowed;
						}
					}

					.pagination_info {
						color: rgba(255, 255, 255, 0.8);
						font-size: 0.9rem;
					}
				}
			}
		}
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

// Анимации появления/исчезновения
.modal-enter-active,
.modal-leave-active {
	transition: all 0.3s ease;

	.modal_content .search_content {
		transition: all 0.3s ease 0.1s;
	}
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
	backdrop-filter: blur(0px);
	-webkit-backdrop-filter: blur(0px);

	.modal_content .search_content {
		opacity: 0;
		transform: translateY(20px);
	}
}

.modal-enter-to,
.modal-leave-from {
	opacity: 1;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);

	.modal_content .search_content {
		opacity: 1;
		transform: translateY(0);
	}
}

// Убираем скролл у body когда модалка открыта
:global(body:has(.modal_overlay)) {
	overflow: hidden;
}
</style>
