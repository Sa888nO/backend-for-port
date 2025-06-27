import Cookies from 'universal-cookie';
import { Static } from './index';
import { AxiosResponse } from 'axios';

// export type iUsers = { email: string; password: string };
// export type oUsers = {
//     id: number;
//     email: string;
//     role: 'client' | 'admin';
//     name?: string;
//     surname?: string;
//     is_verified?: boolean;
// }[];
const cookies = new Cookies();

export const downloadFileApi = (path: string | number): Promise<AxiosResponse<Blob>> => {
    const token = cookies.get('token');
    return Static.get(`${path}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
};
