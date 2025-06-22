import { Api } from './index';
import { AxiosResponse } from 'axios';

export type iLogin = { email: string; password: string };
export type oLogin = { token: string };

export const LoginApi = (params: iLogin): Promise<AxiosResponse<oLogin>> => Api.post(`/auth/login`, params);
