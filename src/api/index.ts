import axios from 'axios';

const config = useRuntimeConfig();

export const api_unimedx = axios.create({
	baseURL: 'https://1116a39bcd510908.mokky.dev',
	headers: {
		'Content-Type': 'application/json'
	}
});
