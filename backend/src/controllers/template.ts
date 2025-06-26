import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Template } from '../database/models/template';
import { ApiError } from '../middlewares/error';
import fileService from '../services/file';
import templateService from '../services/template';

class TemplateController {
    async createTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const file = req.file;
            if (!file || !name) {
                return next(ApiError.BadRequestError('Необходимо заполнить все поля'));
            }
            console.log(name);
            const unicName = await Template.findOne({
                where: {
                    name: name,
                },
            });
            console.log(unicName);
            if (unicName) {
                return next(ApiError.BadRequestError('Шаблон с таким названием уже существует'));
            }
            const new_file = await fileService.createFile(file);
            const schema = await templateService.createDocumentSchema({
                filePath: file?.path,
            });
            console.log(schema);
            await templateService.createTemplate({
                name: name,
                schema: schema,
                file_id: new_file.id,
            });
            return res.status(200).send();
        } catch (e) {
            next(e);
        }
    }
    async getAllTemplates(req: Request, res: Response, next: NextFunction) {
        try {
            const templates = await templateService.getTemplates();
            res.json(templates);
        } catch (e) {
            next(e);
        }
    }
    async getTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const template = await templateService.getTemplateFullInfo(id);
            res.json(template);
        } catch (e) {
            next(e);
        }
    }
    async createByTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, schema } = req.body;
            const filePath = await templateService.createByTemplate(id, schema);
            const absolutePath = path.resolve(filePath);
            fs.access(absolutePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(404).send('File not found');
                }

                res.sendFile(absolutePath);
            });
        } catch (e) {
            next(e);
        }
    }
    async deleteTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const result = await templateService.deleteTemplate(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default new TemplateController();
