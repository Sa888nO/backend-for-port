import { Request, Response, NextFunction } from 'express';
import requestService from '../services/request';

class RequestController {
    async getAllRequests(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await requestService.getAllRequests();
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getRequestById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await requestService.getRequestById(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    // async createRequestWithFile(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         // req.file — файл, req.body — остальные поля
    //         const { name, description, status, client_id } = req.body;
    //         const file = req.file;

    //         if (!file) {
    //             return res.status(400).json({ error: 'Файл не загружен' });
    //         }

    //         const result = await requestService.createRequestWithFile({
    //             name,
    //             description,
    //             status,
    //             client_id: Number(client_id),
    //             file,
    //         });

    //         return res.json(result);
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    // async updateRequest(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = Number(req.params.id);
    //         const result = await requestService.updateRequest(id, req.body);
    //         return res.json(result);
    //     } catch (e) {
    //         next(e);
    //     }
    // }

    async deleteRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const result = await requestService.deleteRequest(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default new RequestController();
