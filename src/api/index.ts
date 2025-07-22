// src/api/index.ts
const baseURL = 'https://1116a39bcd510908.mokky.dev';

export const api_unimedx = {
	get: <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
		return $fetch<T>(`${baseURL}${url}`, {
			method: 'GET',
			query: params
		});
	},

	post: <T = any>(url: string, data?: any): Promise<T> => {
		return $fetch<T>(`${baseURL}${url}`, {
			method: 'POST',
			body: data,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	},

	patch: <T = any>(url: string, data?: any): Promise<T> => {
		return $fetch<T>(`${baseURL}${url}`, {
			method: 'PATCH',
			body: data,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	},

	delete: <T = any>(url: string): Promise<T> => {
		return $fetch<T>(`${baseURL}${url}`, {
			method: 'DELETE'
		});
	}
};

// Если вы хотите оставить axios, то используйте эту конфигурацию:
// import axios from 'axios';

// export const api_unimedx = axios.create({
// 	baseURL: 'https://1116a39bcd510908.mokky.dev',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	}
// });
