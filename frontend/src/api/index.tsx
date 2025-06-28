import axios from 'axios';

export const Api = axios.create({
    baseURL: 'http://5.35.98.185:4444/api',
    // baseURL: 'http://localhost:5000/api',
});

export const Static = axios.create({
    baseURL: 'http://5.35.98.185:4444',
    // baseURL: 'http://localhost:5000',
});
