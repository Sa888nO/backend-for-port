import { Router } from 'express';
import UserController from '../controllers/user';
import authMiddleware from '../middlewares/auth';

const userRouter = Router();
userRouter.get('/user/users', authMiddleware(['admin', 'client']), UserController.users);
userRouter.get('/user/:id', authMiddleware(['admin', 'client']), UserController.getUser);
userRouter.post('/user', authMiddleware(['admin']), UserController.createUser);
userRouter.put('/user/:id', authMiddleware(['admin', 'client']), UserController.updateUser);
userRouter.delete('/user/:id', authMiddleware(['admin', 'client']), UserController.deleteUser);

export default userRouter;
