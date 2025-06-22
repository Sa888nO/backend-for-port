import { Api } from './index';
import { AxiosResponse } from 'axios';

export type iRegistration = { email: string; password: string; name: string; surname: string };
export type oRegistration = { message: string };

export const RegistrationApi = (params: iRegistration): Promise<AxiosResponse<oRegistration>> => Api.post(`/auth/registration`, params);
