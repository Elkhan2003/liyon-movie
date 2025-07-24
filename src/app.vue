<script setup lang="ts">
import { useHead, useSeoMeta } from 'nuxt/app';
import AntdProvider from './providers/AntdProvider.vue';

useHead({
	title: 'LiyonMovie - Смотреть фильмы онлайн',
	meta: [
		{
			name: 'description',
			content:
				'LiyonMovie - лучший сайт для просмотра фильмов и сериалов онлайн в высоком качестве.'
		}
	]
});

useSeoMeta({
	title: 'LiyonMovie - Смотреть фильмы онлайн',
	ogTitle: 'LiyonMovie - Кино и сериалы онлайн',
	description:
		'Смотрите лучшие фильмы и сериалы онлайн в HD качестве на LiyonMovie. Большая коллекция новинок кино, популярных фильмов и сериалов.',
	ogDescription:
		'Смотрите лучшие фильмы и сериалы онлайн в HD качестве на LiyonMovie. Большая коллекция новинок кино, популярных фильмов и сериалов.',
	ogImage:
		'https://elcho.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Felcho911.eabc74a3.png&w=640&q=75',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	twitterCard: 'summary_large_image',
	twitterTitle: 'LiyonMovie - Фильмы и сериалы онлайн',
	twitterDescription: 'Смотрите лучшие фильмы и сериалы в HD качестве',
	ogType: 'website',
	ogSiteName: 'LiyonMovie',
	keywords:
		'фильмы онлайн, сериалы онлайн, смотреть фильмы, кино онлайн, LiyonMovie',
	robots: 'index, follow',
	viewport: 'width=device-width, initial-scale=1'
});
</script>

<template>
	<AntdProvider>
		<NuxtPage />
	</AntdProvider>
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html {
	color-scheme: dark;
	scroll-behavior: smooth;
}

body {
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		sans-serif;
	background-color: #0d1117;
	color: #e6edf3;
}

li {
	list-style: none;
}

a {
	text-decoration: none;
	color: inherit;
	transition: color 0.2s ease;
}

a:hover {
	color: #f85149;
}

.container {
	width: 100%;
	max-width: 1460px;
	margin: 0 auto;
	padding: 0 20px;
}

/* Дополнительные стили для киносайта */
img {
	max-width: 100%;
	height: auto;
}

button {
	cursor: pointer;
	border: none;
	transition: all 0.2s ease;
}

/* 
button:hover {
	transform: translateY(-2px);
} */

/* Scrollbar стилизация */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: #21262d;
}

::-webkit-scrollbar-thumb {
	background: #a855f7;
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: #8b5cf6;
}
</style>
