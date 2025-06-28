import { useMutation } from '@tanstack/react-query';
import { Api } from './index';

type useLoginParams = { email: string; password: string };
type useLoginResponse = { token: string };
export const useLogin = () => useMutation({ mutationFn: (params: useLoginParams) => Api.post<useLoginResponse>('/auth/login', params) });

type useRecoveryParams = { email: string };
export const useRecovery = () => useMutation({ mutationFn: (params: useRecoveryParams) => Api.post('/auth/recovery', params) });

type useRegistrationParams = { email: string; password: string; name: string; surname: string };
type useRegistrationResponse = { message: string };
export const useRegistration = () =>
    useMutation({ mutationFn: (params: useRegistrationParams) => Api.post<useRegistrationResponse>('/auth/registration', params) });
