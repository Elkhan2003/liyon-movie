export const api_unimedx = createApiClient({
	baseURL: 'https://1116a39bcd510908.mokky.dev'
});

export const api_tmdb = createApiClient({
	baseURL: 'https://api.themoviedb.org/3',
	defaultHeaders: {
		Authorization:
			'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDRhMDEwNTljZTg5MDlmYzgxMTQxYjk3MGJjMzhjYyIsIm5iZiI6MTcwMjgwMTIzMS4yMDUsInN1YiI6IjY1N2VhZjRmMDcyOTFjMDdkZjNlZjIzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5nJEcU0w0TpoZTgi20a6mQ_ftNMQPbvmqQsjvGLENGM'
	}
});

//! Другие примеры использования:
// export const apiWithAuth = createApiClient({
// 	baseURL: 'https://api.example.com',
// 	defaultHeaders: {
// 		Authorization: 'Bearer token123'
// 	}
// });

//! Для использования с обычным fetch вместо $fetch
// export const apiWithFetch = createApiClient({
// 	baseURL: 'https://api.example.com',
// 	fetchFn: fetch as any
// });
