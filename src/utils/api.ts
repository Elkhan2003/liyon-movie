interface ApiResponse<T = any> {
	data: T;
}

interface ApiRequestConfig {
	params?: Record<string, any>;
	headers?: Record<string, string>;
}

interface ApiClientOptions {
	baseURL: string;
	defaultHeaders?: Record<string, string>;
	fetchFn?: typeof $fetch;
}

export const createApiClient = (options: ApiClientOptions) => {
	const { baseURL, defaultHeaders = {}, fetchFn = $fetch } = options;

	return {
		get: async <T = any>(
			url: string,
			config?: ApiRequestConfig
		): Promise<ApiResponse<T>> => {
			const data = await fetchFn<T>(`${baseURL}${url}`, {
				method: 'GET',
				query: config?.params,
				headers: {
					...defaultHeaders,
					...config?.headers
				}
			});
			return { data };
		},

		post: async <T = any>(
			url: string,
			requestData?: any,
			config?: ApiRequestConfig
		): Promise<ApiResponse<T>> => {
			const data = await fetchFn<T>(`${baseURL}${url}`, {
				method: 'POST',
				body: requestData,
				headers: {
					'Content-Type': 'application/json',
					...defaultHeaders,
					...config?.headers
				}
			});
			return { data };
		},

		patch: async <T = any>(
			url: string,
			requestData?: any,
			config?: ApiRequestConfig
		): Promise<ApiResponse<T>> => {
			const data = await fetchFn<T>(`${baseURL}${url}`, {
				method: 'PATCH',
				body: requestData,
				headers: {
					'Content-Type': 'application/json',
					...defaultHeaders,
					...config?.headers
				}
			});
			return { data };
		},

		put: async <T = any>(
			url: string,
			requestData?: any,
			config?: ApiRequestConfig
		): Promise<ApiResponse<T>> => {
			const data = await fetchFn<T>(`${baseURL}${url}`, {
				method: 'PUT',
				body: requestData,
				headers: {
					'Content-Type': 'application/json',
					...defaultHeaders,
					...config?.headers
				}
			});
			return { data };
		},

		delete: async <T = any>(
			url: string,
			config?: ApiRequestConfig
		): Promise<ApiResponse<T>> => {
			const data = await fetchFn<T>(`${baseURL}${url}`, {
				method: 'DELETE',
				headers: {
					...defaultHeaders,
					...config?.headers
				}
			});
			return { data };
		}
	};
};
