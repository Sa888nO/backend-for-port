import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const Api = axios.create({
    baseURL: 'http://5.35.98.185:4444/api',
    // baseURL: 'http://localhost:5000/api',
});

export const AuthApi = axios.create({
    baseURL: 'http://5.35.98.185:4444/api',
    // baseURL: 'http://localhost:5000/api',
    // headers: { Authorization: `Bearer ${cookies.get('token')}` },
});
AuthApi.interceptors.request.use(
    (config) => {
        config.headers.Authorization = `Bearer ${cookies.get('token')}`;
        return config;
    },
    (error) => Promise.reject(error),
);

export const Static = axios.create({
    baseURL: 'http://5.35.98.185:4444',
    // baseURL: 'http://localhost:5000',
});
