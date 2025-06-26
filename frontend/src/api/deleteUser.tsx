import Cookies from 'universal-cookie';
import { Api } from './index';
import { AxiosResponse } from 'axios';

const cookies = new Cookies();

export const deleteUserApi = (id: string | number): Promise<AxiosResponse<never>> => {
    const token = cookies.get('token');
    return Api.delete(`/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};
