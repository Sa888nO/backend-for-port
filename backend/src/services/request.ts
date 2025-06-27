import { iRequest, Request as RequestModel } from '../database/models/request';
import { Client } from '../database/models/client';
import { File } from '../database/models/file';

// type createRequestDto = iRequest;

class RequestService {
    async getAllRequests() {
        // Можно добавить include: [Client, File] если нужны связи
        return await RequestModel.findAll();
    }

    async getRequestById(id: number) {
        const req = await RequestModel.findByPk(id);
        if (!req) return { error: 'Запрос не найден' };
        return req;
    }

    // async createTemplate(dto: createTemplateDto) {
    //     const { name, schema, file_id } = dto;
    //     if (!name || !schema || !file_id) {
    //         // throw ApiError.BadRequestError("");
    //     }
    //     const newTemplate = new Template({
    //         schema: schema,
    //         name: name,
    //         file_id: file_id,
    //     });
    //     await newTemplate.save();
    // }

    // async createRequest:({dto}: createRequestDto) {
    //     if ()

    // }

    // async createRequestWithFile(data: { name: string; description: string; status: string; client_id: number; file: Express.Multer.File }) {
    //     // 1. Сохраняем файл в таблицу files
    //     const uploadedFile = await File.create({
    //         filename: data.file.filename,
    //         originalname: data.file.originalname,
    //         mimetype: data.file.mimetype,
    //         size: data.file.size,
    //         path: data.file.path,
    //     });

    //     // 2. Создаём запрос и связываем с файлом и клиентом
    //     const request = await RequestModel.create({
    //         name: data.name,
    //         description: data.description,
    //         status: data.status,
    //         client_id: data.client_id,
    //         file_id: uploadedFile.id,
    //     });

    //     return { message: 'Запрос успешно создан', request };
    // }

    // async updateRequest(
    //     id: number,
    //     data: {
    //         name?: string;
    //         description?: string;
    //         status?: string;
    //         client_id?: number;
    //         file_id?: number;
    //     },
    // ) {
    //     const req = await RequestModel.findByPk(id);
    //     if (!req) return { error: 'Запрос не найден' };

    //     if (data.name !== undefined) req.name = data.name;
    //     if (data.description !== undefined) req.description = data.description;
    //     if (data.status !== undefined) req.status = data.status;
    //     if (data.client_id !== undefined) req.client_id = data.client_id;
    //     if (data.file_id !== undefined) req.file_id = data.file_id;

    //     await req.save();
    //     return { message: 'Запрос успешно обновлён', request: req };
    // }

    async deleteRequest(id: number) {
        const req = await RequestModel.findByPk(id);
        if (!req) return { error: 'Запрос не найден' };
        await req.destroy();
        return { message: 'Запрос успешно удалён' };
    }
}

export default new RequestService();
