import { iRequest, Request, Request as RequestModel } from '../database/models/request';
import { Client } from '../database/models/client';
import { File } from '../database/models/file';

// type createRequestDto = iRequest;

class RequestService {
    async getAllRequests() {
        return await RequestModel.findAll();
    }

    async getRequestById(id: number) {
        const req = await RequestModel.findByPk(id);
        if (!req) return { error: 'Запрос не найден' };
        return req;
    }

    async createRequest(data: iRequest) {
        console.log(data);
        const newRequest = new Request(data);
        await newRequest.save();
    }

    // async resolveRequest({ comment, file_id, final, id }: { final: 'resolve' | 'reject'; id: number; comment: string; file_id: number | string }) {
    //     const req = await RequestModel.findByPk(id);
    //     // const
    // }

    async deleteRequest(id: number) {
        const req = await RequestModel.findByPk(id);
        if (!req) return { error: 'Запрос не найден' };
        await req.destroy();
        return { message: 'Запрос успешно удалён' };
    }
}

export default new RequestService();
