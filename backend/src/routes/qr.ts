import { Router } from 'express';
import QRControler from '../controllers/qr';
import authMiddleware from '../middlewares/auth';

const QRRouter = Router();

QRRouter.get('/qrs', authMiddleware(['admin', 'client']), QRControler.getAllQRs);
QRRouter.get('/qrs/:id', authMiddleware(['admin', 'client']), QRControler.blockQR);

// userRouter.put('/user/:id', authMiddleware(['admin', 'client']), UserController.updateUser);

export default QRRouter;
