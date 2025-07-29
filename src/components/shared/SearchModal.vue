<script setup lang="ts">
const searchStore = useSearchStore();

const closeModal = () => {
	searchStore.toggleSearchModal();
};

// Закрытие по Escape
const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') {
		closeModal();
	}
};

// Добавляем и удаляем обработчик событий
onMounted(() => {
	document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
	<Teleport to="body">
		<Transition name="modal">
			<div v-if="searchStore.isOpen" class="modal_overlay" @click="closeModal">
				<div class="modal_content" @click.stop>
					<button class="close_btn" @click="closeModal" aria-label="Закрыть">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path
								d="M18 6L6 18M6 6L18 18"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					</button>

					<div class="search_container">
						<h1 class="search_title">Поиск</h1>
						<div class="search_input_wrapper">
							<svg
								class="search_icon"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
							>
								<circle
									cx="11"
									cy="11"
									r="8"
									stroke="currentColor"
									stroke-width="2"
								/>
								<path
									d="M21 21l-4.35-4.35"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
							<input
								type="text"
								placeholder="Название фильма/сериала"
								class="search_input"
								autofocus
							/>
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

		.search_container {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 2.5rem 4rem 2.5rem 4rem;
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
					left: 0;
					color: rgba(255, 255, 255, 0.6);
					z-index: 1;
					transition: color 0.3s ease;
				}

				.search_input {
					width: 100%;
					background: transparent;
					border: none;
					border-bottom: 1px solid rgba(255, 255, 255, 0.3);
					color: #ffffffba;
					font-size: 16px;
					padding: 10px 0 10px 2.5rem;
					outline: none;
					transition: all 0.3s ease;
					font-family: inherit;

					&::placeholder {
						color: rgba(255, 255, 255, 0.6);
					}

					&:focus {
						border-bottom-color: rgba(255, 255, 255, 0.8);
					}
				}

				&:focus-within .search_icon {
					color: rgba(255, 255, 255, 0.8);
				}
			}
		}
	}
}

// Анимации появления/исчезновения
.modal-enter-active,
.modal-leave-active {
	transition: all 0.3s ease;

	.modal_content .search_container {
		transition: all 0.3s ease 0.1s;
	}
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
	backdrop-filter: blur(0px);
	-webkit-backdrop-filter: blur(0px);

	.modal_content .search_container {
		opacity: 0;
		transform: translateY(20px);
	}
}

.modal-enter-to,
.modal-leave-from {
	opacity: 1;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);

	.modal_content .search_container {
		opacity: 1;
		transform: translateY(0);
	}
}

// Убираем скролл у body когда модалка открыта
:global(body:has(.modal_overlay)) {
	overflow: hidden;
}
</style>
