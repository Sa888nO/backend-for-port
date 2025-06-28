import { AxiosResponse } from 'axios';
import { AuthApi } from './index';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

type QR = {
    id: number;
    file_id: string | number;
    is_blocked: boolean;
};

export const useQRs = (props?: Omit<UseQueryOptions<QR[]>, 'queryKey' | 'queryFn'>) =>
    useQuery({
        queryKey: ['qrs'],
        queryFn: async () => {
            const response: AxiosResponse<QR[]> = await AuthApi.get('/qrs');
            return response.data;
        },
        ...props,
    });

export const useBlockQR = () => useMutation({ mutationFn: (id: QR['id']) => AuthApi.get(`/qrs/${id}`) });
