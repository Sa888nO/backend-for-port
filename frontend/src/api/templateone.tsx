import Cookies from 'universal-cookie';
import { Api } from './index';
import { AxiosResponse } from 'axios';

// export type oUser = {
//     id: number;
//     email: string;
//     role: 'client' | 'admin';
//     name?: string;
//     surname?: string;
//     is_verified?: boolean;
// };
const cookies = new Cookies();

export const TemplateApi = (id: string | number): Promise<AxiosResponse<any>> => {
    const token = cookies.get('token');
    return Api.get(`/template/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
