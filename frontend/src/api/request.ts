import { AxiosResponse } from 'axios';
import { AuthApi } from './index';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

export type Request = {
    id: number;
    user_id: number;
    file_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    name: string;
    description: string;
};

export const useRequests = (props?: Omit<UseQueryOptions<Request[]>, 'queryKey' | 'queryFn'>) =>
    useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const response: AxiosResponse<Request[]> = await AuthApi.get('/requests');
            return response.data;
        },
        ...props,
    });

export const useRequest = (id: Request['id'], props?: Omit<UseQueryOptions<Request>, 'queryKey' | 'queryFn'>) =>
    useQuery({
        queryKey: ['request', id],
        queryFn: async () => {
            const response: AxiosResponse<Request> = await AuthApi.get(`/requests/${id}`);
            return response.data;
        },
        ...props,
    });
type Resolve = {
    id: Request['id'];
    comment: string;
    status: 'accepted' | 'rejected';
};
export const useCreateRequest = () => useMutation({ mutationFn: (newRequest: FormData) => AuthApi.post('/requests', newRequest) });
export const useDeleteRequest = () => useMutation({ mutationFn: (id: Request['id']) => AuthApi.delete(`/requests/${id}`) });
export const useResolveRequest = () => useMutation({ mutationFn: ({ id, ...props }: Resolve) => AuthApi.put(`/requests/${id}`, props) });
