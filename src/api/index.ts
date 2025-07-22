const baseURL = 'https://1116a39bcd510908.mokky.dev';

interface ApiResponse<T = any> {
	data: T;
}

interface ApiRequestConfig {
	params?: Record<string, any>;
	headers?: Record<string, string>;
}

export const api_unimedx = {
	get: async <T = any>(
		url: string,
		config?: ApiRequestConfig
	): Promise<ApiResponse<T>> => {
		const data = await $fetch<T>(`${baseURL}${url}`, {
			method: 'GET',
			query: config?.params,
			headers: config?.headers
		});
		return { data };
	},

	post: async <T = any>(
		url: string,
		requestData?: any,
		config?: ApiRequestConfig
	): Promise<ApiResponse<T>> => {
		const data = await $fetch<T>(`${baseURL}${url}`, {
			method: 'POST',
			body: requestData,
			headers: {
				'Content-Type': 'application/json',
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
		const data = await $fetch<T>(`${baseURL}${url}`, {
			method: 'PATCH',
			body: requestData,
			headers: {
				'Content-Type': 'application/json',
				...config?.headers
			}
		});
		return { data };
	},

	delete: async <T = any>(
		url: string,
		config?: ApiRequestConfig
	): Promise<ApiResponse<T>> => {
		const data = await $fetch<T>(`${baseURL}${url}`, {
			method: 'DELETE',
			headers: config?.headers
		});
		return { data };
	}
};
