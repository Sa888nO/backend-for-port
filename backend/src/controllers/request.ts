import { Request, Response, NextFunction } from 'express';
import requestService from '../services/request';
import fileService from '../services/file';
import { ApiError } from '../middlewares/error';
import { Status } from '../database/models/request';

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

    async createRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, name, description } = req.body;
            const file = req.file;
            if (!file) {
                return next(ApiError.BadRequestError('Необходимо заполнить все поля'));
            }
            const new_file = await fileService.createFile(file);
            // console.log(new_file);
            await requestService.createRequest({
                user_id: Number(user_id),
                name,
                description,
                status: 'pending' as Status,
                file_id: new_file.id,
                // qr_id: 0,
            });
            return res.status(200).send();
        } catch (e) {
            next(e);
        }
    }

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
