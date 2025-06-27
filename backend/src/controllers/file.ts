import { Request, Response, NextFunction } from 'express';
import fileService from '../services/file';

class FileController {
    async getAllFiles(req: Request, res: Response, next: NextFunction) {
        try {
            const files = await fileService.getAllFiles();
            return res.json(files);
        } catch (e) {
            next(e);
        }
    }
}

export default new FileController();
