import { Router } from 'express';
import FileController from '../controllers/file';
import authMiddleware from '../middlewares/auth';

const fileRouter = Router();

fileRouter.get('/files', authMiddleware(['admin', 'client']), FileController.getAllFiles);

export default fileRouter;
