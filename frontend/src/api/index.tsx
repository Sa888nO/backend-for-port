import axios from 'axios';

export const Api = axios.create({
    baseURL: 'http://5.35.98.185:4444/api',
});
