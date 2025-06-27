import Cookies from 'universal-cookie';
import { Api } from './index';
import { AxiosResponse } from 'axios';

const cookies = new Cookies();

export type FileType = {
    id: number;
    path_to_file: string;
    name: string;
    createdAt: string; // ISO-строка даты
    updatedAt: string; // ISO-строка даты
};

export const FilesApi = (): Promise<AxiosResponse<FileType[]>> => {
    const token = cookies.get('token');
    return Api.get(`/files/`, { headers: { Authorization: `Bearer ${token}` } });
};
