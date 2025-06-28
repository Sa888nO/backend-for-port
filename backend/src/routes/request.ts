import { Router } from 'express';
import RequestController from '../controllers/request';
import authMiddleware from '../middlewares/auth';
import { upload } from '../services/file';

const requestRouter = Router();

requestRouter.get('/requests', authMiddleware(['admin', 'client']), RequestController.getAllRequests);
requestRouter.get('/requests/:id', authMiddleware(['admin', 'client']), RequestController.getRequestById);
requestRouter.post('/requests', authMiddleware(['admin', 'client']), upload.single('file'), RequestController.createRequest);
requestRouter.delete('/requests/:id', authMiddleware(['admin', 'client']), RequestController.deleteRequest);
// requestRouter.put('/requests/:id', authMiddleware(['admin', 'client']), RequestController.updateRequest);

export default requestRouter;
