import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import Cookies from 'universal-cookie';
import { Api } from './index';
import { AxiosResponse } from 'axios';

// export type iUsers = { email: string; password: string };
export type oUsers = {
    id: number;
    email: string;
    role: 'client' | 'admin';
    name?: string;
    surname?: string;
    is_verified?: boolean;
}[];
const cookies = new Cookies();

export const createTemplateApi = (formData: FormData): Promise<AxiosResponse<oUsers>> => {
    const token = cookies.get('token');
    return Api.post(`/template`, formData, { headers: { Authorization: `Bearer ${token}` } });
};
