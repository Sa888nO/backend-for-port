import { Request, Response, NextFunction } from 'express';
import requestService from '../services/request';
import fileService from '../services/file';
import { ApiError } from '../middlewares/error';
import { Status } from '../database/models/request';
import { iRequest, Request as RequestModel } from '../database/models/request';
import { Client } from '../database/models/client';
import { File } from '../database/models/file';
import { QR } from '../database/models/qr';

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun } = require('docx');

// Функция для копирования и модификации docx-файла
async function approveDocxWithGreenLabel(originalPath: string, outputPath: string) {
    // Читаем исходный файл
    const buffer = fs.readFileSync(originalPath);

    // Загружаем документ через docx
    const doc = await Document.load(buffer);

    // Добавляем в конец параграф с зелёной надписью
    doc.addSection({
        children: [
            ...doc.getSections()[0].children,
            new Paragraph({
                children: [
                    new TextRun({
                        text: 'Cогласовано',
                        color: '008000', // зелёный
                    }),
                ],
            }),
        ],
    });

    // Сохраняем новый файл
    const packed = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, packed);
}

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
    async resolveRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const data = req.body;
            if (data.status === 'accepted') {
                const req = await RequestModel.findByPk(id);
                if (!req) return;
                const file = await File.findByPk(req.file_id);
                if (!file) return;
                const originalPath = file.path_to_file; // путь к исходному файлу
                const outputPath = path.join(path.dirname(originalPath), `approved_${path.basename(originalPath)}`) as string;
                console.log('this pre');
                // await approveDocxWithGreenLabel(originalPath, outputPath);
                console.log('this');
                const { id: z, ...d } = file;
                // const newFile = new File({ ...d, path_to_file: outputPath });
                // await newFile.save();

                const qr = new QR({
                    file_id: file.id,
                    is_blocked: false,
                });
                await qr.save();

                // const newFile = await File.create({ ...file, path_to_file: outputPath });

                // const user = await User.findByPk(id);
                // if (!user) return { error: 'Пользователь не найден' };

                // Обновляем email и пароль, если переданы
                req.status = 'accepted';
                if (data.comment) req.comment = data.comment;
                req.qr_id = qr.id;

                await req.save();

                // await user.save();
                // await RequestModel.update(Number(id), { ...req, status: 'accepted' });
                // const result = await userService.updateUser(id, req.body);
            }

            return res.json(200);
        } catch (e) {
            next(e);
        }
    }
}

export default new RequestController();
