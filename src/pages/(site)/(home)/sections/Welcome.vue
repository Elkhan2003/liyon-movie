<script setup lang="ts">
import { useGetUpcomingQuery } from '~/api/upcoming';

const { data: upcomingData, isLoading } = useGetUpcomingQuery();

// watchEffect(() => {
// 	console.log(upcomingData.value?.results);
// });

// Слайдер состояние
const currentSlide = ref(0);
const isPaused = ref(false);
const sliderContainer = ref<HTMLElement>();

// Переменные для точного управления таймингом
const autoplayInterval = ref<NodeJS.Timeout>();
const progressStartTime = ref<number>(0);
const progressDuration = 5000; // 5 секунд
const elapsedTime = ref<number>(0);
const isPausedTime = ref<number>(0);

// Функции для работы со слайдером
const nextSlide = () => {
	if (upcomingData.value?.results) {
		currentSlide.value =
			(currentSlide.value + 1) % upcomingData.value.results.length;
		resetProgress();
	}
};

const prevSlide = () => {
	if (upcomingData.value?.results) {
		currentSlide.value =
			currentSlide.value === 0
				? upcomingData.value.results.length - 1
				: currentSlide.value - 1;
		resetProgress();
	}
};

const goToSlide = (index: number) => {
	currentSlide.value = index;
	resetProgress();
};

// Функция для сброса прогресса
const resetProgress = () => {
	elapsedTime.value = 0;
	isPausedTime.value = 0;
	progressStartTime.value = Date.now();
	startAutoplay();
};

// Автоплей с учетом паузы
const startAutoplay = () => {
	if (autoplayInterval.value) clearInterval(autoplayInterval.value);

	progressStartTime.value = Date.now();

	autoplayInterval.value = setInterval(() => {
		if (!isPaused.value) {
			const now = Date.now();
			const totalElapsed = now - progressStartTime.value + isPausedTime.value;
			elapsedTime.value = totalElapsed;

			if (totalElapsed >= progressDuration) {
				nextSlide();
			}
		}
	}, 16); // ~60fps для плавности
};

const stopAutoplay = () => {
	if (autoplayInterval.value) {
		clearInterval(autoplayInterval.value);
	}
};

// Функция для обработки паузы/воспроизведения
const togglePlayPause = () => {
	if (isPaused.value) {
		// Возобновляем - сбрасываем время начала, но сохраняем накопленное время паузы
		isPaused.value = false;
		progressStartTime.value = Date.now();
	} else {
		// Ставим на паузу - сохраняем текущее время
		isPaused.value = true;
		const now = Date.now();
		isPausedTime.value = now - progressStartTime.value + isPausedTime.value;
	}
};

// Вычисляемое свойство для прогресса
const progressPercentage = computed(() => {
	const progress = Math.min((elapsedTime.value / progressDuration) * 100, 100);
	return progress;
});

// Утилиты
const getPosterUrl = (posterPath: string) => {
	return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const getBackdropUrl = (backdropPath: string) => {
	return `https://image.tmdb.org/t/p/w1920${backdropPath}`;
};

const getRatingColor = (rating: number) => {
	if (rating >= 8) return '#10b981';
	if (rating >= 6) return '#f59e0b';
	return '#ef4444';
};

const formatYear = (dateString: string) => {
	return new Date(dateString).getFullYear();
};

const truncateText = (text: string, maxLength: number = 200) => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + '...';
};

// Управление слайдером с клавиатуры
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'ArrowLeft') {
		prevSlide();
	} else if (event.key === 'ArrowRight') {
		nextSlide();
	} else if (event.key === ' ') {
		event.preventDefault();
		togglePlayPause();
	}
};

// Lifecycle
onMounted(() => {
	resetProgress();
	document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	stopAutoplay();
	document.removeEventListener('keydown', handleKeydown);
});

// Рестарт автоплея при изменении данных
watch(upcomingData, () => {
	if (upcomingData.value?.results?.length) {
		resetProgress();
	}
});

// Отслеживание изменения слайда для сброса прогресса
watch(currentSlide, () => {
	resetProgress();
});
</script>

<template>
	<section class="Welcome">
		<div class="slider-container" ref="sliderContainer">
			<!-- Loading State -->
			<div v-if="isLoading" class="slider-loading">
				<div class="loading-spinner"></div>
				<p class="loading-text">Загружаем лучшие фильмы...</p>
			</div>

			<!-- Slider Content -->
			<div v-else-if="upcomingData?.results?.length" class="slider-content">
				<!-- Slides -->
				<div
					v-for="(movie, index) in upcomingData.results"
					:key="movie.id"
					class="slide"
					:class="{ 'slide--active': index === currentSlide }"
				>
					<!-- Background Image -->
					<div class="slide-bg">
						<img
							:src="getBackdropUrl(movie.backdrop_path)"
							:alt="movie.title"
							class="slide-bg-image"
						/>
						<div class="slide-gradient"></div>
					</div>

					<!-- Content -->
					<div class="container">
						<div class="slide-content">
							<div class="slide-info">
								<div class="slide-meta">
									<span class="slide-type">Фильм</span>
									<span class="slide-age">18+</span>
									<span class="slide-year">{{
										formatYear(movie.release_date)
									}}</span>
									<span class="slide-country">США</span>
									<span class="slide-duration">2ч 15мин</span>
								</div>

								<h1 class="slide-title">{{ movie.title }}</h1>

								<p class="slide-description">
									{{ truncateText(movie.overview) }}
								</p>

								<div class="slide-rating">
									<div class="rating-score">
										<span
											class="rating-number"
											:style="{ color: getRatingColor(movie.vote_average) }"
										>
											{{ movie.vote_average.toFixed(1) }}
										</span>
									</div>
									<div class="rating-sources">
										<div class="rating-source">
											<span class="rating-icon">🎬</span>
											<span class="rating-value">{{
												movie.vote_average.toFixed(1)
											}}</span>
										</div>
										<div class="rating-source">
											<span class="rating-icon">⭐</span>
											<span class="rating-value">{{
												(movie.vote_average * 0.9).toFixed(1)
											}}</span>
										</div>
									</div>
								</div>

								<div class="slide-actions">
									<button class="btn btn--primary">
										<svg
											class="btn-icon"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path d="M8 5v14l11-7z" />
										</svg>
										Перейти к фильму
									</button>
									<button class="btn btn--secondary">
										<svg
											class="btn-icon"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path
												d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
											/>
										</svg>
										В избранное
									</button>
								</div>
							</div>

							<div class="slide-poster">
								<div class="poster-container">
									<img
										:src="getPosterUrl(movie.poster_path)"
										:alt="movie.title"
										class="poster-image"
									/>
									<div class="poster-overlay">
										<button class="play-btn">
											<svg viewBox="0 0 24 24" fill="currentColor">
												<path d="M8 5v14l11-7z" />
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Navigation -->
				<div class="slider-nav">
					<button
						class="nav-btn nav-btn--prev"
						@click="prevSlide"
						:disabled="upcomingData.results.length <= 1"
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
						</svg>
					</button>
					<button
						class="nav-btn nav-btn--next"
						@click="nextSlide"
						:disabled="upcomingData.results.length <= 1"
					>
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
						</svg>
					</button>
				</div>

				<!-- Dots Pagination -->
				<div class="slider-dots">
					<button
						v-for="(_, index) in upcomingData.results"
						:key="index"
						class="dot"
						:class="{ 'dot--active': index === currentSlide }"
						@click="goToSlide(index)"
						:aria-label="`Перейти к слайду ${index + 1}`"
					></button>
				</div>

				<!-- Progress Bar -->
				<div class="slider-progress">
					<div
						class="progress-bar"
						:style="{
							width: `${progressPercentage}%`,
							transition: isPaused ? 'none' : 'width 16ms linear'
						}"
					></div>
				</div>

				<!-- Play/Pause Control -->
				<button
					class="play-pause-btn"
					@click="togglePlayPause"
					:title="isPaused ? 'Воспроизвести' : 'Пауза'"
				>
					<svg v-if="isPaused" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
					<svg v-else viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
					</svg>
				</button>
			</div>

			<!-- Empty State -->
			<div v-else class="slider-empty">
				<div class="empty-icon">🎬</div>
				<p class="empty-text">Нет доступных фильмов</p>
			</div>
		</div>

		<!-- Background Effects -->
		<div class="hero-bg-effects">
			<div class="hero-gradient"></div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.Welcome {
	position: relative;
	height: 80vh;
	min-height: 600px;
	overflow: hidden;
	background: #1a1a2e;

	.slider-container {
		position: relative;
		height: 100%;
		width: 100%;
	}

	// Loading State
	.slider-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 2rem;

		.loading-spinner {
			width: 60px;
			height: 60px;
			border: 4px solid rgba(139, 92, 246, 0.1);
			border-left: 4px solid #8b5cf6;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		.loading-text {
			color: rgba(255, 255, 255, 0.8);
			font-size: 1.2rem;
			font-weight: 500;
		}
	}

	// Slides
	.slide {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		visibility: hidden;
		transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
		transform: scale(1.05);
		display: flex;
		align-items: center;

		&--active {
			opacity: 1;
			visibility: visible;
			transform: scale(1);
		}

		.slide-bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 1;

			.slide-bg-image {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}

			.slide-gradient {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(
						135deg,
						rgba(15, 15, 35, 0.9) 0%,
						rgba(26, 26, 46, 0.7) 40%,
						rgba(30, 30, 63, 0.8) 100%
					),
					linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, transparent 70%);
			}
		}

		.slide-content {
			position: relative;
			z-index: 2;
			height: 100%;
			display: flex;
			align-items: center;
			gap: 4rem;

			@media (max-width: 1024px) {
				flex-direction: column;
				justify-content: center;
				text-align: center;
				gap: 2rem;
			}
		}

		.slide-info {
			flex: 1;
			max-width: 600px;

			.slide-meta {
				display: flex;
				align-items: center;
				gap: 1rem;
				margin-bottom: 1.5rem;
				flex-wrap: wrap;

				@media (max-width: 1024px) {
					justify-content: center;
				}

				span {
					padding: 0.5rem 1rem;
					background: rgba(139, 92, 246, 0.2);
					border: 1px solid rgba(139, 92, 246, 0.4);
					border-radius: 20px;
					color: #c084fc;
					font-size: 0.9rem;
					font-weight: 500;
				}

				.slide-type {
					background: linear-gradient(45deg, #8b5cf6, #a855f7);
					color: white;
					border-color: transparent;
				}
			}

			.slide-title {
				font-size: clamp(2.5rem, 5vw, 4rem);
				font-weight: 800;
				color: white;
				margin-bottom: 1.5rem;
				line-height: 1.1;
			}

			.slide-description {
				font-size: 1.1rem;
				line-height: 1.6;
				color: rgba(255, 255, 255, 0.8);
				margin-bottom: 2rem;
			}

			.slide-rating {
				display: flex;
				align-items: center;
				gap: 2rem;
				margin-bottom: 2.5rem;

				@media (max-width: 1024px) {
					justify-content: center;
				}

				.rating-score {
					.rating-number {
						font-size: 2rem;
						font-weight: 700;
					}
				}

				.rating-sources {
					display: flex;
					gap: 1rem;

					.rating-source {
						display: flex;
						align-items: center;
						gap: 0.5rem;
						padding: 0.5rem 1rem;
						background: rgba(255, 255, 255, 0.1);
						border-radius: 15px;

						.rating-icon {
							font-size: 1.2rem;
						}

						.rating-value {
							color: rgba(255, 255, 255, 0.9);
							font-weight: 600;
						}
					}
				}
			}

			.slide-actions {
				display: flex;
				gap: 1rem;
				flex-wrap: wrap;

				@media (max-width: 1024px) {
					justify-content: center;
				}

				.btn {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					padding: 1rem 2rem;
					border-radius: 50px;
					font-weight: 600;
					font-size: 1rem;
					border: none;
					cursor: pointer;
					transition: all 0.3s ease;

					.btn-icon {
						width: 20px;
						height: 20px;
					}

					&--primary {
						background: linear-gradient(45deg, #8b5cf6, #a855f7);
						color: white;

						&:hover {
							transform: translateY(-2px);
							opacity: 0.9;
						}
					}

					&--secondary {
						background: rgba(255, 255, 255, 0.1);
						color: white;
						border: 1px solid rgba(139, 92, 246, 0.3);

						&:hover {
							background: rgba(139, 92, 246, 0.2);
							border-color: rgba(139, 92, 246, 0.5);
						}
					}
				}
			}
		}

		.slide-poster {
			flex: 0 0 auto;

			@media (max-width: 1024px) {
				order: -1;
			}

			.poster-container {
				position: relative;
				width: 300px;
				aspect-ratio: 2/3;
				border-radius: 20px;
				overflow: hidden;
				border: 2px solid rgba(139, 92, 246, 0.3);
				transition: all 0.3s ease;

				@media (max-width: 1024px) {
					width: 250px;
				}

				@media (max-width: 480px) {
					width: 200px;
				}

				&:hover {
					border-color: rgba(139, 92, 246, 0.6);

					.poster-overlay {
						opacity: 1;
					}
				}

				.poster-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.poster-overlay {
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

					.play-btn {
						width: 80px;
						height: 80px;
						background: rgba(255, 255, 255, 0.2);
						border: 2px solid white;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						cursor: pointer;
						transition: all 0.3s ease;

						svg {
							width: 30px;
							height: 30px;
							margin-left: 4px;
						}

						&:hover {
							background: rgba(255, 255, 255, 0.3);
						}
					}
				}
			}
		}
	}

	// Navigation
	.slider-nav {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		z-index: 10;
		display: flex;
		justify-content: space-between;
		padding: 0 2rem;
		transform: translateY(-50%);
		pointer-events: none;

		.nav-btn {
			pointer-events: all;
			width: 60px;
			height: 60px;
			background: rgba(0, 0, 0, 0.5);
			border: 1px solid rgba(139, 92, 246, 0.3);
			border-radius: 50%;
			color: white;
			cursor: pointer;
			transition: all 0.3s ease;
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				width: 24px;
				height: 24px;
			}

			&:hover:not(:disabled) {
				background: #8b5cf6;
				border-color: #8b5cf6;
			}

			&:disabled {
				opacity: 0.3;
				cursor: not-allowed;
			}

			@media (max-width: 768px) {
				width: 50px;
				height: 50px;

				svg {
					width: 20px;
					height: 20px;
				}
			}
		}
	}

	// Dots Pagination
	.slider-dots {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		display: flex;
		gap: 1rem;

		.dot {
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.3);
			border: none;
			cursor: pointer;
			transition: background 0.3s ease;

			&:hover {
				background: rgba(139, 92, 246, 0.7);
			}

			&--active {
				background: #8b5cf6;
			}
		}
	}

	// Progress Bar
	.slider-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		z-index: 10;

		.progress-bar {
			height: 100%;
			background: linear-gradient(45deg, #8b5cf6, #a855f7);
			width: 0;
		}
	}

	// Play/Pause Control
	.play-pause-btn {
		position: absolute;
		top: 7rem;
		right: 2rem;
		z-index: 10;
		width: 50px;
		height: 50px;
		background: rgba(0, 0, 0, 0.5);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 20px;
			height: 20px;
		}

		&:hover {
			background: #8b5cf6;
			border-color: #8b5cf6;
		}
	}

	// Empty State
	.slider-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 2rem;

		.empty-icon {
			font-size: 4rem;
			opacity: 0.5;
		}

		.empty-text {
			color: rgba(255, 255, 255, 0.7);
			font-size: 1.2rem;
		}
	}

	// Background Effects
	.hero-bg-effects {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 0;

		.hero-gradient {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: radial-gradient(
					circle at 20% 80%,
					rgba(139, 92, 246, 0.1) 0%,
					transparent 50%
				),
				radial-gradient(
					circle at 80% 20%,
					rgba(168, 85, 247, 0.08) 0%,
					transparent 50%
				);
		}
	}
}

// Animations
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@keyframes progress {
	to {
		width: 100%;
	}
}

// Media Queries
@media (max-width: 768px) {
	.Welcome {
		height: 80vh;
		min-height: 500px;

		.slider-nav {
			padding: 0 1rem;
		}

		.slide .slide-content {
			padding: 1rem 0;
			gap: 1.5rem;
		}

		.slide .slide-info .slide-title {
			font-size: clamp(2rem, 8vw, 3rem);
		}

		.slide .slide-info .slide-actions {
			justify-content: center;
		}
	}
}

@media (max-width: 480px) {
	.Welcome {
		height: 70vh;
		min-height: 400px;

		.slide .slide-info .slide-description {
			font-size: 1rem;
		}

		.slide .slide-info .slide-actions .btn {
			padding: 0.75rem 1.5rem;
			font-size: 0.9rem;
		}

		.slide .slide-info .slide-rating {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;

			@media (max-width: 1024px) {
				align-items: center;
			}
		}
	}
}
</style>
