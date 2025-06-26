import { Router } from 'express';
import AuthController from '../controllers/auth';

const authRouter = Router();

authRouter.post('/auth/login', AuthController.login);
authRouter.post('/auth/registration', AuthController.registration);
authRouter.get('/auth/verification', AuthController.verification);
authRouter.post('/auth/recovery', AuthController.recovery);

export default authRouter;
