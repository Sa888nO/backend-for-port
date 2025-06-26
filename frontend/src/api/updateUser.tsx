import Cookies from 'universal-cookie';
import { Api } from './index';

export type iCreateUser = {
    id: string | number;
    email: string;
    password: string;
    role: string;
    name?: string;
    surname?: string;
    is_verified?: boolean;
};
const cookies = new Cookies();

export const UpdateUserApi = (props: iCreateUser) => {
    const { id, ...data } = props;
    const token = cookies.get('token');
    return Api.put(`/user/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};
