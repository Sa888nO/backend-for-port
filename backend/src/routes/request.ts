import { Router } from 'express';
import RequestController from '../controllers/request';
import authMiddleware from '../middlewares/auth';

const requestRouter = Router();

requestRouter.get('/requests', authMiddleware(['admin', 'client']), RequestController.getAllRequests);
requestRouter.get('/requests/:id', authMiddleware(['admin', 'client']), RequestController.getRequestById);
// requestRouter.post('/requests', authMiddleware(['admin', 'client']), RequestController.createRequest);
// requestRouter.put('/requests/:id', authMiddleware(['admin', 'client']), RequestController.updateRequest);
requestRouter.delete('/requests/:id', authMiddleware(['admin', 'client']), RequestController.deleteRequest);

export default requestRouter;
