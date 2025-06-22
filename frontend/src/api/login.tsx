import { Api } from './index';
import { AxiosResponse } from 'axios';

export type iLogin = { email: string; password: string };
export type oLogin = unknown;

export const LoginApi = (params: iLogin): Promise<AxiosResponse<oLogin>> => Api.post(`http://localhost:4444/api/auth/login`, params);
