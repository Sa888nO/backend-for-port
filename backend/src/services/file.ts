import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';
import { File } from '../database/models/file';

const uploadDir = path.join('files');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/ /g, '_');
        cb(null, `${v4()}.${file.originalname.split('.').pop()}`);
    },
});

class FileService {
    async createFile(file: Express.Multer.File) {
        const sanitizedFileName = file.originalname.replace(/ /g, '_');
        const sanitizedFilePath = file.path.replace(/ /g, '_');

        const newFile = await File.create({
            name: sanitizedFileName,
            path_to_file: sanitizedFilePath,
        });

        return newFile.save();
    }

    async getAllFiles() {
        // Получаем все записи файлов из базы данных
        const files = await File.findAll();
        return files;
    }
}

export const upload = multer({ storage });
export default new FileService();
