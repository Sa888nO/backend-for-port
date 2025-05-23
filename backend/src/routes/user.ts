import { Router } from 'express';
import UserController from '../controllers/user';
import authMiddleware from '../middlewares/auth';

const userRouter = Router();
userRouter.get('/user/users', authMiddleware(['admin', 'client']), UserController.users);
userRouter.delete('/user/:id', authMiddleware(['admin', 'client']), UserController.deleteUser);

export default userRouter;
