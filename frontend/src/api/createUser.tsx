import Cookies from 'universal-cookie';
import { Api } from './index';

export type iCreateUser = { email: string; password: string; role: string; name?: string; surname?: string; is_verified?: boolean };
const cookies = new Cookies();

export const CreateUserApi = (props: iCreateUser) => {
    const token = cookies.get('token');
    return Api.post(`/user`, props, { headers: { Authorization: `Bearer ${token}` } });
};
