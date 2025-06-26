import mammoth from 'mammoth';
import { Template } from '../database/models/template';
import { File } from '../database/models/file';
import fileService from '../services/file';
import { ApiError } from '../middlewares/error';
import { Document, Packer, Paragraph, TextRun } from 'docx';

import fs from 'fs';
// import fileService from "./file.service";
import path from 'path';
import { v4 } from 'uuid';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

type createTemplateDto = {
    name: string;
    schema: Object;
    file_id: number;
};
type createDocumentSchemaDto = {
    filePath: string;
};

class TemplateService {
    async createTemplate(dto: createTemplateDto) {
        const { name, schema, file_id } = dto;
        if (!name || !schema || !file_id) {
            // throw ApiError.BadRequestError("");
        }
        const newTemplate = new Template({
            schema: schema,
            name: name,
            file_id: file_id,
        });
        await newTemplate.save();
    }
    async createDocumentSchema(dto: createDocumentSchemaDto) {
        const { value: text } = await mammoth.extractRawText({
            path: dto.filePath,
        });
        const regex = /\{(.*?)\}/g;
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[1].trim());
        }
        const schema: Record<string, string> = {};
        matches.forEach((match) => {
            schema[match] = '';
        });
        return schema;
    }
    async getTemplates() {
        return Template.findAll({});
    }
    async getTemplateFullInfo(id: string) {
        const template = await Template.findOne({
            where: { id },
        });
        if (!template) {
            throw ApiError.BadRequestError('Шаблон не найден');
        }
        const template_file = await File.findOne({
            where: { id: template.file_id },
        });
        if (!template_file) {
            throw ApiError.BadRequestError('Шаблон не найден');
        }
        return {
            template,
            file: template_file,
        };
    }
    async replaceTemplateWithJson(text: string, json: Record<string, string>): Promise<string> {
        const regex = /{{(.*?)}}/g;
        return text.replace(regex, (match, key) => {
            return json[key] || '';
        });
    }
    async createByTemplate(id: string, schema: Record<string, string>) {
        // console.log(schema);
        const template = await Template.findOne({
            where: { id },
        });
        if (!template) {
            throw ApiError.BadRequestError('Шаблон не найден');
        }
        const template_file = await File.findOne({
            where: { id: template.file_id },
        });
        if (!template_file) {
            throw ApiError.BadRequestError('Шаблон не найден');
        }
        const fileContent = fs.readFileSync(template_file.path_to_file, 'binary');

        // Загрузить DOCX файл
        const zip = new PizZip(fileContent);

        // Создать экземпляр Docxtemplater
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Установить значения из schema в шаблон
        doc.setData(schema);

        try {
            // Рендеринг документа с новыми данными
            doc.render();
        } catch (error) {
            throw ApiError.BadRequestError(`Ошибка рендеринга документа`);
        }

        // Генерация нового файла DOCX
        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        // Генерировать новый путь для сохранения файла
        const newFilePath = path.join('files', `${v4()}.docx`);
        fs.writeFileSync(newFilePath, buf);

        // Прочитать и вернуть содержимое нового файла
        // const newFileContent = fs.readFileSync(newFilePath, "binary");

        return newFilePath;
    }
    async deleteTemplate(id: Template['id']) {
        const user = await Template.findByPk(id);
        if (!user) {
            return { error: 'Шаблон не найден' };
        }
        // if (user.role === 'client') {
        //     const client = await Client.findOne({ where: { user_id: user.id } });
        //     // Удалить связанные токены клиента
        //     await Token.destroy({ where: { client_id: client?.id } });

        //     // Удалить запись клиента
        //     await Client.destroy({ where: { user_id: id } });
        // }

        // Удалить пользователя
        await Template.destroy({ where: { id } });

        return { message: 'Шаблон успешно удален' };
    }
}

export default new TemplateService();
