<script setup lang="ts">
import { computed } from 'vue';
import { Switch } from 'ant-design-vue';
import { useGetTopRatedQuery } from '~/api/top-rated';
import MovieList from '~/components/shared/MovieList.vue';

const type_switcher = ref<'movie' | 'tv'>('movie');
const sort_rating_desc = ref<boolean>(true);

const {
	data: top_rated_data,
	isLoading: is_loading_top_rated,
	isError: is_error_top_rated
} = useGetTopRatedQuery(type_switcher);

// Computed свойство для отсортированных данных
const sorted_top_rated_data = computed(() => {
	if (!top_rated_data.value?.results) return [];

	const dataModify = top_rated_data.value.results.map((item, index) => ({
		...item,
		media_type: type_switcher.value
	}));

	return dataModify.sort((a, b) => {
		if (sort_rating_desc.value) {
			return b.vote_average - a.vote_average;
		} else {
			return a.vote_average - b.vote_average;
		}
	});
});

const handle_switch_type = async (type: 'movie' | 'tv') => {
	type_switcher.value = type;
};

const handle_rating_sort = (checked: string | number | boolean) => {
	sort_rating_desc.value = Boolean(checked);
};

// Обработчики событий для MovieList
const handle_movie_click = (item: any) => {
	console.log('Movie clicked:', item);
	// Здесь можно добавить навигацию к детальной странице фильма
	// $router.push(`/movie/${item.id}`);
};

const handle_play_click = (item: any) => {
	console.log('Play clicked:', item);
	// Здесь можно добавить логику воспроизведения трейлера
};
</script>

<template>
	<section class="top_rated">
		<div class="container">
			<div class="top_rated_content">
				<!-- Header Section -->
				<div class="top_rated_header">
					<div class="top_rated_title_section">
						<h1 class="top_rated_title">Top Rated</h1>
						<p class="top_rated_subtitle">
							Highest rated content by critics and audiences
						</p>
					</div>

					<div class="top_rated_controls">
						<!-- Rating Sort Switch -->
						<div class="rating_sort">
							<div class="rating_sort_label">
								<svg
									class="rating_sort_icon"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"
									/>
								</svg>
								<span class="rating_sort_text">
									{{
										sort_rating_desc ? 'Высокий → Низкий' : 'Низкий → Высокий'
									}}
								</span>
							</div>
							<Switch
								v-model:checked="sort_rating_desc"
								@change="handle_rating_sort"
								class="rating_switch"
							/>
						</div>

						<!-- Type Switcher -->
						<div class="type_switcher">
							<button
								@click="handle_switch_type('movie')"
								class="type_switcher_btn"
								:class="{
									'type_switcher_btn--active': type_switcher === 'movie'
								}"
							>
								<span class="type_switcher_btn_text">Movies</span>
							</button>
							<button
								@click="handle_switch_type('tv')"
								class="type_switcher_btn"
								:class="{
									'type_switcher_btn--active': type_switcher === 'tv'
								}"
							>
								<span class="type_switcher_btn_text">TV Shows</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Content Section -->
				<div class="top_rated_main">
					<!-- Error State -->
					<div v-if="is_error_top_rated" class="top_rated_error">
						<div class="error_icon">⚠️</div>
						<p class="error_text">Failed to load top rated content</p>
						<button class="error_retry_btn" @click="$router.go(0)">
							Try Again
						</button>
					</div>

					<!-- Movie List Component -->
					<MovieList
						v-else
						:items="sorted_top_rated_data"
						:loading="is_loading_top_rated"
						@item-click="handle_movie_click"
						@play-click="handle_play_click"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.top_rated {
	position: relative;
	padding: 30px 0;
	overflow: hidden;

	.top_rated_content {
		position: relative;
		z-index: 10;
	}

	.top_rated_header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(139, 92, 246, 0.1);

		@media (max-width: 768px) {
			flex-direction: column;
			gap: 2rem;
			text-align: center;
		}

		.top_rated_title_section {
			.top_rated_title {
				display: flex;
				align-items: center;
				gap: 1rem;
				font-size: 3rem;
				font-weight: bold;
				background: linear-gradient(45deg, #ffffff, #c084fc);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				margin: 0 0 0.5rem 0;

				@media (max-width: 768px) {
					justify-content: center;
					font-size: 2.5rem;
				}
			}

			.top_rated_subtitle {
				color: rgba(255, 255, 255, 0.7);
				font-size: 1.1rem;
				margin: 0;
			}
		}

		.top_rated_controls {
			display: flex;
			align-items: center;
			gap: 1.5rem;

			@media (max-width: 768px) {
				flex-direction: column;
				gap: 1rem;
				width: 100%;
			}

			.rating_sort {
				display: flex;
				align-items: center;
				gap: 1rem;
				padding: 0.75rem 1rem;
				background: rgba(255, 255, 255, 0.08);
				border-radius: 50px;
				backdrop-filter: blur(10px);
				border: 1px solid rgba(139, 92, 246, 0.2);

				.rating_sort_label {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					color: rgba(255, 255, 255, 0.8);
					font-size: 0.9rem;
					font-weight: 500;

					.rating_sort_icon {
						color: #fbbf24;
					}

					.rating_sort_text {
						white-space: nowrap;

						@media (max-width: 768px) {
							font-size: 0.8rem;
						}
					}
				}
			}

			.type_switcher {
				display: flex;
				gap: 5px;
				background: rgba(255, 255, 255, 0.08);
				border-radius: 50px;
				padding: 5px;
				backdrop-filter: blur(10px);
				border: 1px solid rgba(139, 92, 246, 0.2);

				.type_switcher_btn {
					background: transparent;
					border: none;
					padding: 0.75rem 1.5rem;
					border-radius: 25px;
					color: rgba(255, 255, 255, 0.7);
					font-weight: 500;
					cursor: pointer;
					transition: all 0.3s ease;
					position: relative;
					overflow: hidden;

					&::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						opacity: 0;
						transition: opacity 0.3s ease;
					}

					.type_switcher_btn_text {
						position: relative;
						z-index: 2;
					}

					&:hover:not(&--active) {
						color: white;
						transform: translateY(-1px);

						&::before {
							opacity: 0.1;
						}
					}

					&--active {
						color: white;

						&::before {
							opacity: 1;
						}
					}
				}
			}
		}
	}

	.top_rated_main {
		.top_rated_error {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			min-height: 400px;
			gap: 1.5rem;

			.error_icon {
				font-size: 3rem;
			}

			.error_text {
				color: rgba(255, 255, 255, 0.7);
				font-size: 1.1rem;
				margin: 0;
			}

			.error_retry_btn {
				background: linear-gradient(45deg, #8b5cf6, #a855f7);
				color: white;
				border: none;
				padding: 0.75rem 2rem;
				border-radius: 25px;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.3s ease;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
				}
			}
		}
	}
}
</style>
