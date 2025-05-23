import { Router } from 'express';
import AuthController from '../controllers/auth';
import authMiddleware from '../middlewares/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import templateController from '../controllers/template';

import { upload } from '../services/file';
// import templateController, { upload } from "../controllers/template.controller";

const templateRouter = Router();

templateRouter.post('/template', authMiddleware(['admin', 'client']), upload.single('template'), templateController.createTemplate);
templateRouter.get('/templates', authMiddleware(['admin', 'client']), templateController.getAllTemplates);
templateRouter.get('/template/:id', authMiddleware(['admin', 'client']), templateController.getTemplate);
templateRouter.post('/template/create', authMiddleware(['admin', 'client']), templateController.createByTemplate);

export default templateRouter;
