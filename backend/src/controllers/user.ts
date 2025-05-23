import { Request, Response, NextFunction } from 'express';
import userService from '../services/user';
import mailService from '../services/mail';

class UserController {
    async users(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.getAllUsers();
            console.log(result);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const result = await userService.deleteUser(id);
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();
