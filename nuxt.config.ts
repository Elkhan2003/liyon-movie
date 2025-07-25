// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	srcDir: 'src/',
	experimental: {
		viewTransition: false
	}
	// build: {
	// 	transpile: ['ant-design-vue']
	// }
});
