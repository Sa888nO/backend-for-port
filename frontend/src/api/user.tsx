import { AxiosResponse } from 'axios';
import { AuthApi } from './index';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

type User = {
    id: number;
    email: string;
    role: 'client' | 'admin';
    name?: string;
    surname?: string;
    is_verified?: boolean;
};

export const useUsers = (props?: Omit<UseQueryOptions<User[]>, 'queryKey' | 'queryFn'>) =>
    useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response: AxiosResponse<User[]> = await AuthApi.get('/user/users');
            return response.data;
        },
        ...props,
    });

export const useUser = (id: User['id'], props?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) =>
    useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response: AxiosResponse<User> = await AuthApi.get(`/user/${id}`);
            return response.data;
        },
        ...props,
    });

export const useCreateUser = () => useMutation({ mutationFn: (newUser: Omit<User, 'id'> & { password: string }) => AuthApi.post('/user', newUser) });
export const useDeleteUser = () => useMutation({ mutationFn: (id: User['id']) => AuthApi.delete(`/user/${id}`) });
export const useUpdateUser = () => useMutation({ mutationFn: ({ id, ...user }: User & { password: string }) => AuthApi.put(`/user/${id}`, user) });
