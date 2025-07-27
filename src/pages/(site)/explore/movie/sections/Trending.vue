<script setup lang="ts">
import { useGetTradingsQuery } from '~/api/trending';

const date_switcher = ref<'day' | 'week'>('day');

const {
	data: trending_data,
	isLoading: is_loading_trending,
	isError: is_error_trending
} = useGetTradingsQuery(date_switcher);

const handle_switch_date = async (date: 'day' | 'week') => {
	date_switcher.value = date;
};

const get_poster_url = (poster_path: string) => {
	return `https://image.tmdb.org/t/p/w500${poster_path}`;
};

const get_rating_color = (rating: number) => {
	if (rating >= 8) return '#10b981'; // green
	if (rating >= 6) return '#f59e0b'; // yellow
	return '#ef4444'; // red
};
</script>

<template>
	<section class="trending">
		<div class="container">
			<div class="trending_content">
				<!-- Header Section -->
				<div class="trending_header">
					<div class="trending_title_section">
						<h1 class="trending_title">Trending</h1>
						<p class="trending_subtitle">Discover what's popular right now</p>
					</div>

					<!-- Date Switcher -->
					<div class="date_switcher">
						<button
							@click="handle_switch_date('day')"
							class="date_switcher_btn"
							:class="{ 'date_switcher_btn--active': date_switcher === 'day' }"
						>
							<span class="date_switcher_btn_text">Today</span>
						</button>
						<button
							@click="handle_switch_date('week')"
							class="date_switcher_btn"
							:class="{ 'date_switcher_btn--active': date_switcher === 'week' }"
						>
							<span class="date_switcher_btn_text">This Week</span>
						</button>
					</div>
				</div>

				<!-- Content Section -->
				<div class="trending_main">
					<!-- Loading State -->
					<div v-if="is_loading_trending" class="trending_loading">
						<div class="loading_spinner"></div>
						<p class="loading_text">Loading trending content...</p>
					</div>

					<!-- Error State -->
					<div v-else-if="is_error_trending" class="trending_error">
						<div class="error_icon">⚠️</div>
						<p class="error_text">Failed to load trending content</p>
						<button class="error_retry_btn" @click="$router.go(0)">
							Try Again
						</button>
					</div>

					<!-- Content Grid -->
					<div v-else class="trending_grid">
						<div
							class="trending_item"
							v-for="(item, index) in trending_data?.results"
							:key="index"
						>
							<div class="trending_item_inner">
								<!-- Poster -->
								<div class="trending_item_poster">
									<img
										:src="get_poster_url(item.poster_path)"
										:alt="item.title"
										class="trending_item_image"
										loading="lazy"
									/>
									<div class="trending_item_overlay">
										<div class="trending_item_rating">
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
										<div class="trending_item_play">
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
								<div class="trending_item_info">
									<h3 class="trending_item_title">{{ item.title }}</h3>
									<p class="trending_item_date">{{ item.release_date }}</p>
									<p class="trending_item_overview">{{ item.overview }}</p>
									<div class="trending_item_meta">
										<span class="trending_item_type">{{
											item.media_type
										}}</span>
										<div class="trending_item_rating_badge">
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
			</div>
		</div>

		<!-- Background Effects -->
		<div class="trending_bg">
			<div class="trending_gradient"></div>
			<div class="trending_dots"></div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.trending {
	position: relative;
	padding: 30px 0;
	overflow: hidden;
	min-height: 100vh;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* background: radial-gradient(
				circle at 20% 20%,
				rgba(139, 92, 246, 0.1) 0%,
				transparent 50%
			),
			radial-gradient(
				circle at 80% 80%,
				rgba(168, 85, 247, 0.08) 0%,
				transparent 50%
			); */
		pointer-events: none;
	}

	.trending_content {
		position: relative;
		z-index: 10;
	}

	.trending_header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(139, 92, 246, 0.1);

		@media (max-width: 768px) {
			flex-direction: column;
			gap: 2rem;
			text-align: center;
		}

		.trending_title_section {
			.trending_title {
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

			.trending_subtitle {
				color: rgba(255, 255, 255, 0.7);
				font-size: 1.1rem;
				margin: 0;
			}
		}

		.date_switcher {
			display: flex;
			background: rgba(255, 255, 255, 0.08);
			border-radius: 50px;
			padding: 0.5rem;
			backdrop-filter: blur(10px);
			border: 1px solid rgba(139, 92, 246, 0.2);

			.date_switcher_btn {
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

				.date_switcher_btn_text {
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

	.trending_main {
		.trending_loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			min-height: 400px;
			gap: 1.5rem;

			.loading_spinner {
				width: 50px;
				height: 50px;
				border: 3px solid rgba(139, 92, 246, 0.2);
				border-top: 3px solid #8b5cf6;
				border-radius: 50%;
				animation: spin 1s linear infinite;
			}

			.loading_text {
				color: rgba(255, 255, 255, 0.7);
				font-size: 1.1rem;
				margin: 0;
			}
		}

		.trending_error {
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

		.trending_grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 2rem;

			@media (max-width: 768px) {
				grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
				gap: 1.5rem;
			}

			.trending_item {
				background: rgba(255, 255, 255, 0.08);
				border-radius: 20px;
				overflow: hidden;
				border: 1px solid rgba(139, 92, 246, 0.2);
				backdrop-filter: blur(10px);
				transition: all 0.3s ease;
				cursor: pointer;

				&:hover {
					transform: translateY(-10px);
					border-color: rgba(139, 92, 246, 0.4);
					box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);

					.trending_item_image {
						transform: scale(1.1);
					}

					.trending_item_overlay {
						opacity: 1;
					}
				}

				.trending_item_inner {
					height: 100%;
					display: flex;
					flex-direction: column;
				}

				.trending_item_poster {
					position: relative;
					aspect-ratio: 2/3;
					overflow: hidden;

					.trending_item_image {
						width: 100%;
						height: 100%;
						object-fit: cover;
						transition: transform 0.3s ease;
					}

					.trending_item_overlay {
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

						.trending_item_rating {
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

						.trending_item_play {
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

				.trending_item_info {
					padding: 1.5rem;
					flex: 1;
					display: flex;
					flex-direction: column;

					.trending_item_title {
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

					.trending_item_date {
						color: rgba(255, 255, 255, 0.6);
						font-size: 0.9rem;
						margin: 0 0 1rem 0;
					}

					.trending_item_overview {
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

					.trending_item_meta {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: auto;

						.trending_item_type {
							background: rgba(139, 92, 246, 0.2);
							color: #c084fc;
							padding: 0.25rem 0.75rem;
							border-radius: 15px;
							font-size: 0.8rem;
							font-weight: 500;
							text-transform: capitalize;
						}

						.trending_item_rating_badge {
							.rating_badge {
								font-weight: 600;
								font-size: 0.9rem;
							}
						}
					}
				}
			}
		}
	}

	.trending_bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		overflow: hidden;

		.trending_dots {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-image: radial-gradient(
					2px 2px at 30px 40px,
					rgba(139, 92, 246, 0.1),
					transparent
				),
				radial-gradient(
					2px 2px at 80px 90px,
					rgba(168, 85, 247, 0.1),
					transparent
				),
				radial-gradient(
					1px 1px at 120px 60px,
					rgba(192, 132, 252, 0.1),
					transparent
				);
			background-repeat: repeat;
			background-size: 150px 150px;
			animation: dots-drift 30s linear infinite;
		}
	}
}

@keyframes pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@keyframes dots-drift {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 150px 150px;
	}
}
</style>
