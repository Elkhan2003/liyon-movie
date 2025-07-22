import {
	VueQueryPlugin,
	QueryClient,
	hydrate,
	dehydrate
} from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
	const queryClient = new QueryClient();

	nuxtApp.vueApp.use(VueQueryPlugin, {
		queryClient
	});

	// SSR поддержка
	if (process.server) {
		nuxtApp.hook('app:rendered', () => {
			nuxtApp.ssrContext!.payload.vueQueryState = dehydrate(queryClient);
		});
	}

	if (process.client) {
		nuxtApp.hook('app:created', () => {
			if (nuxtApp.ssrContext?.payload?.vueQueryState) {
				hydrate(queryClient, nuxtApp.ssrContext.payload.vueQueryState);
			}
		});
	}
});
