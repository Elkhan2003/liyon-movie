<script setup lang="ts">
interface MovieItem {
	id: number;
	title: string;
	poster_path: string;
	vote_average: number;
	release_date: string;
	overview: string;
	media_type: string;
}

interface Props {
	items: MovieItem[];
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false
});

const emit = defineEmits<{
	itemClick: [item: MovieItem];
	playClick: [item: MovieItem];
}>();

const get_poster_url = (poster_path: string) => {
	return `https://image.tmdb.org/t/p/w500${poster_path}`;
};

const get_rating_color = (rating: number) => {
	if (rating >= 8) return '#10b981'; // green
	if (rating >= 6) return '#f59e0b'; // yellow
	return '#ef4444'; // red
};

const handle_item_click = (item: MovieItem) => {
	emit('itemClick', item);
};

const handle_play_click = (item: MovieItem, event: Event) => {
	event.stopPropagation();
	emit('playClick', item);
};
</script>

<template>
	<div class="movie_list">
		<!-- Loading Skeleton -->
		<div v-if="loading" class="movie_grid">
			<div
				class="movie_item movie_item--skeleton"
				v-for="i in 6"
				:key="'skeleton-' + i"
			>
				<div class="movie_item_inner">
					<div class="movie_item_poster skeleton_poster"></div>
					<div class="movie_item_info">
						<div class="skeleton_title"></div>
						<div class="skeleton_date"></div>
						<div class="skeleton_overview"></div>
						<div class="movie_item_meta">
							<div class="skeleton_type"></div>
							<div class="skeleton_rating"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Movie Grid -->
		<div v-else class="movie_grid">
			<div
				class="movie_item"
				v-for="(item, index) in items"
				:key="item.id || index"
				@click="handle_item_click(item)"
			>
				<div class="movie_item_inner">
					<!-- Poster -->
					<div class="movie_item_poster">
						<img
							:src="get_poster_url(item.poster_path)"
							:alt="item.title"
							class="movie_item_image"
							loading="lazy"
						/>
						<div class="movie_item_overlay">
							<div class="movie_item_rating">
								<svg
									class="rating_icon"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path
										d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"
									/>
								</svg>
								<span class="rating_value">{{
									item.vote_average.toFixed(1)
								}}</span>
							</div>
							<div
								class="movie_item_play"
								@click="handle_play_click(item, $event)"
							>
								<svg
									class="play_icon"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Info -->
					<div class="movie_item_info">
						<h3 class="movie_item_title">{{ item.title }}</h3>
						<p class="movie_item_date">{{ item.release_date }}</p>
						<p class="movie_item_overview">{{ item.overview }}</p>
						<div class="movie_item_meta">
							<span class="movie_item_type">{{ item.media_type }}</span>
							<div class="movie_item_rating_badge">
								<span
									class="rating_badge"
									:style="{ color: get_rating_color(item.vote_average) }"
								>
									{{ item.vote_average.toFixed(1) }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.movie_list {
	.movie_grid {
		display: flex;
		gap: 2rem;
		overflow-x: auto;
		overflow-y: hidden;
		padding: 1rem 0 2rem 0;
		scroll-behavior: smooth;

		/* Custom scrollbar */
		&::-webkit-scrollbar {
			height: 8px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.1);
			border-radius: 10px;
		}

		&::-webkit-scrollbar-thumb {
			background: linear-gradient(45deg, #8b5cf6, #a855f7);
			border-radius: 10px;

			&:hover {
				background: linear-gradient(45deg, #7c3aed, #9333ea);
			}
		}

		@media (max-width: 768px) {
			gap: 1.5rem;
		}

		.movie_item {
			background: rgba(255, 255, 255, 0.08);
			border-radius: 20px;
			overflow: hidden;
			border: 1px solid rgba(139, 92, 246, 0.2);
			backdrop-filter: blur(10px);
			transition: all 0.3s ease;
			cursor: pointer;
			flex: 0 0 280px; /* Фиксированная ширина, не сжимается */

			@media (max-width: 768px) {
				flex: 0 0 250px;
			}

			&:hover {
				transform: translateY(-10px);
				border-color: rgba(139, 92, 246, 0.4);
				box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);

				.movie_item_image {
					transform: scale(1.1);
				}

				.movie_item_overlay {
					opacity: 1;
				}
			}

			&--skeleton {
				cursor: default;

				&:hover {
					transform: none;
					border-color: rgba(139, 92, 246, 0.2);
					box-shadow: none;
				}
			}

			.movie_item_inner {
				height: 100%;
				display: flex;
				flex-direction: column;
			}

			.movie_item_poster {
				position: relative;
				aspect-ratio: 2/3;
				overflow: hidden;

				.movie_item_image {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transition: transform 0.3s ease;
				}

				&.skeleton_poster {
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.1) 75%
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
				}

				.movie_item_overlay {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: linear-gradient(
						45deg,
						rgba(139, 92, 246, 0.8),
						rgba(168, 85, 247, 0.8)
					);
					display: flex;
					align-items: center;
					justify-content: center;
					opacity: 0;
					transition: opacity 0.3s ease;

					.movie_item_rating {
						position: absolute;
						top: 1rem;
						right: 1rem;
						background: rgba(0, 0, 0, 0.7);
						padding: 0.5rem;
						border-radius: 50px;
						display: flex;
						align-items: center;
						gap: 0.25rem;
						color: #fbbf24;

						.rating_icon {
							width: 16px;
							height: 16px;
						}

						.rating_value {
							font-size: 0.9rem;
							font-weight: 600;
							color: white;
						}
					}

					.movie_item_play {
						width: 60px;
						height: 60px;
						background: rgba(255, 255, 255, 0.2);
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						backdrop-filter: blur(10px);
						border: 2px solid rgba(255, 255, 255, 0.3);
						transition: all 0.3s ease;

						&:hover {
							background: rgba(255, 255, 255, 0.3);
							transform: scale(1.1);
						}

						.play_icon {
							color: white;
							margin-left: 3px;
						}
					}
				}
			}

			.movie_item_info {
				padding: 1.5rem;
				flex: 1;
				display: flex;
				flex-direction: column;

				.movie_item_title {
					color: white;
					font-size: 1.1rem;
					font-weight: 600;
					margin: 0 0 0.5rem 0;
					line-height: 1.4;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.movie_item_date {
					color: rgba(255, 255, 255, 0.6);
					font-size: 0.9rem;
					margin: 0 0 1rem 0;
				}

				.movie_item_overview {
					color: rgba(255, 255, 255, 0.7);
					font-size: 0.9rem;
					line-height: 1.5;
					margin: 0 0 1rem 0;
					flex: 1;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.movie_item_meta {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: auto;

					.movie_item_type {
						background: rgba(139, 92, 246, 0.2);
						color: #c084fc;
						padding: 0.25rem 0.75rem;
						border-radius: 15px;
						font-size: 0.8rem;
						font-weight: 500;
						text-transform: capitalize;
					}

					.movie_item_rating_badge {
						.rating_badge {
							font-weight: 600;
							font-size: 0.9rem;
						}
					}
				}

				// Skeleton styles
				.skeleton_title {
					height: 1.5rem;
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.1) 75%
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
					border-radius: 4px;
					margin-bottom: 0.5rem;
				}

				.skeleton_date {
					height: 1rem;
					width: 60%;
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.1) 75%
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
					border-radius: 4px;
					margin-bottom: 1rem;
				}

				.skeleton_overview {
					height: 3rem;
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.1) 75%
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
					border-radius: 4px;
					margin-bottom: 1rem;
					flex: 1;
				}

				.skeleton_type {
					height: 1.5rem;
					width: 60px;
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.1) 75%
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
					border-radius: 15px;
				}

				.skeleton_rating {
					height: 1rem;
					width: 30px;
					background: linear-gradient(
						90deg,
						rgba(255, 255, 255, 0.1) 25%,
						rgba(255, 255, 255, 0.2) 50%,
						rgba(255, 255, 255, 0.1) 75%
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
					border-radius: 4px;
				}
			}
		}
	}
}

@keyframes shimmer {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}
</style>
