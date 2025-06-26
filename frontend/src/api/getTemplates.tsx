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

export const TemplatesApi = (): Promise<AxiosResponse<oUsers>> => {
    const token = cookies.get('token');
    return Api.get(`/user/users/`, { headers: { Authorization: `Bearer ${token}` } });
};
