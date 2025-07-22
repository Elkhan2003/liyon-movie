<script setup lang="ts">
import { ref } from 'vue';
const searchQuery = ref('');

// Массив роутов для навигации
const navigationRoutes = [
	{
		name: 'Главная',
		path: '/'
	},
	{
		name: 'Фильмы',
		path: '/movies'
	},
	{
		name: 'TV шоу',
		path: '/tv-show'
	},
	{
		name: 'Задачи',
		path: '/todo'
	},
	{
		name: 'Топ 100',
		path: '/top-100'
	}
];

const handleSearch = () => {
	if (searchQuery.value.trim()) {
		console.log('Поиск:', searchQuery.value);
		// Здесь будет логика поиска
	}
};
</script>

<template>
	<header class="header">
		<div class="container">
			<div class="content">
				<!-- Логотип -->
				<div class="logo">
					<div class="logo-icon">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H3L5,8H2V10H22V8H20L18,4M2,12V22H22V12H2Z"
							/>
						</svg>
					</div>
					<span class="logo-text">CinemaHub</span>
				</div>

				<!-- Навигация -->
				<nav class="nav">
					<ul class="nav-list">
						<li
							v-for="(item, index) in navigationRoutes"
							:key="index"
							class="nav-item"
						>
							<NuxtLink :to="item.path" class="nav-link" activeClass="active">
								{{ item.name }}
							</NuxtLink>
						</li>
					</ul>
				</nav>

				<!-- Поиск -->
				<div class="search">
					<div class="search-input-wrapper">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Поиск фильмов, сериалов..."
							class="search-input"
							@keyup.enter="handleSearch"
						/>
						<button @click="handleSearch" class="search-btn">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Пользователь -->
				<div class="user-actions">
					<button class="btn btn--secondary">Войти</button>
					<button class="btn btn--primary">Регистрация</button>
				</div>
			</div>
		</div>

		<!-- Фоновые эффекты -->
		<div class="header-bg">
			<div class="header-gradient"></div>
			<div class="header-dots"></div>
		</div>
	</header>
</template>

<style scoped lang="scss">
.header {
	position: relative;
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(139, 92, 246, 0.1);
	padding: 1rem 0;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}

	.content {
		display: flex;
		gap: 30px;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 10;

		.logo {
			display: flex;
			align-items: center;
			gap: 0.75rem;
			text-decoration: none;
			color: white;
			font-weight: bold;
			font-size: 1.5rem;

			.logo-icon {
				width: 40px;
				height: 40px;
				background: linear-gradient(45deg, #8b5cf6, #a855f7);
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
				transition: transform 0.3s ease;

				&:hover {
					transform: scale(1.1) rotate(5deg);
				}
			}

			.logo-text {
				background: linear-gradient(45deg, #ffffff, #c084fc);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}
		}

		.nav {
			display: flex;
			align-items: center;

			.nav-list {
				display: flex;
				list-style: none;
				margin: 0;
				padding: 0;
				gap: 2rem;

				.nav-item {
					.nav-link {
						position: relative;
						padding: 0.5rem 0;
						text-decoration: none;
						font-weight: 500;
						transition: 0.3s ease;
						color: #ffffffcc;

						&::after {
							content: '';
							position: absolute;
							bottom: 0;
							left: 0;
							width: 0;
							height: 2px;
							background: linear-gradient(45deg, #8b5cf6, #a855f7);
							transition: 0.3s ease;
						}

						&:not(.active):hover {
							color: #fff;
							&::after {
								width: 100%;
							}
						}
						&.active {
							color: #a855f7;
							&::after {
								width: 100%;
							}
						}
					}
				}
			}
		}

		.search {
			flex: 1;
			max-width: 400px;

			.search-input-wrapper {
				position: relative;
				display: flex;
				align-items: center;

				.search-input {
					width: 100%;
					padding: 0.75rem 3rem 0.75rem 1rem;
					background: rgba(255, 255, 255, 0.08);
					border: 1px solid rgba(139, 92, 246, 0.2);
					border-radius: 25px;
					color: white;
					font-size: 0.9rem;
					backdrop-filter: blur(10px);
					transition: all 0.3s ease;

					&::placeholder {
						color: rgba(255, 255, 255, 0.5);
					}

					&:focus {
						outline: none;
						border-color: #8b5cf6;
						background: rgba(255, 255, 255, 0.12);
						box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
					}
				}

				.search-btn {
					position: absolute;
					right: 8px;
					background: linear-gradient(45deg, #8b5cf6, #a855f7);
					border: none;
					border-radius: 50%;
					width: 36px;
					height: 36px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					cursor: pointer;
					transition: all 0.3s ease;

					&:hover {
						transform: scale(1.1);
						box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
					}
				}
			}
		}

		.user-actions {
			display: flex;
			gap: 1rem;
			align-items: center;

			.btn {
				padding: 0.5rem 1.5rem;
				border-radius: 25px;
				font-weight: 500;
				text-decoration: none;
				border: none;
				cursor: pointer;
				transition: all 0.3s ease;
				font-size: 0.9rem;

				&--primary {
					background: linear-gradient(45deg, #8b5cf6, #a855f7);
					color: white;
					box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
					}
				}

				&--secondary {
					background: transparent;
					color: white;
					border: 1px solid rgba(139, 92, 246, 0.3);

					&:hover {
						background: rgba(139, 92, 246, 0.1);
						border-color: rgba(139, 92, 246, 0.5);
					}
				}
			}
		}
	}

	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		overflow: hidden;

		.header-dots {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-image: radial-gradient(
					2px 2px at 20px 30px,
					rgba(139, 92, 246, 0.1),
					transparent
				),
				radial-gradient(
					2px 2px at 40px 70px,
					rgba(168, 85, 247, 0.1),
					transparent
				),
				radial-gradient(
					1px 1px at 90px 40px,
					rgba(192, 132, 252, 0.1),
					transparent
				);
			background-repeat: repeat;
			background-size: 100px 100px;
			animation: dots-move 20s linear infinite;
		}
	}
}

@keyframes dots-move {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 100px 100px;
	}
}
</style>
