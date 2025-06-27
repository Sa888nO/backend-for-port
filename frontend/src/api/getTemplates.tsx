import Cookies from 'universal-cookie';
import { Api } from './index';
import { AxiosResponse } from 'axios';

// export type iUsers = { email: string; password: string };
export interface ITemplate {
    id: number;
    name: string;
    schema: Record<string, string>;
    file_id: number;
    createdAt: string;
    updatedAt: string;
}

const cookies = new Cookies();

export const TemplatesApi = (): Promise<AxiosResponse<ITemplate[]>> => {
    const token = cookies.get('token');
    return Api.get(`/templates`, { headers: { Authorization: `Bearer ${token}` } });
};
