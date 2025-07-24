<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue';
import ruRU from 'ant-design-vue/es/locale/ru_RU';
</script>

<template>
	<ConfigProvider
		:theme="{
			token: {
				colorPrimary: '#8b5cf6',
				colorSuccess: '#10b981',
				colorWarning: '#f59e0b',
				colorError: '#ef4444',
				borderRadius: 8
			},
			algorithm: theme.darkAlgorithm
		}"
		:locale="ruRU"
		component-size="middle"
	>
		<slot />
	</ConfigProvider>
</template>
