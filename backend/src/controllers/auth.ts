import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth';
import mailService from '../services/mail';

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            console.log(email, password);
            const result = await authService.Login(email, password);
            console.log(result);
            if (result.error) return res.status(400).json({ message: result.error });
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name, surname } = req.body;
            console.log(email, password);
            const result = await authService.Registration(email, password, name, surname);
            console.log(result);
            if (result.error) return res.status(400).json({ message: result.error });
            return res.json(result);
        } catch (e) {
            next(e);
        }
    }
    async verification(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.query;
            if (!token || typeof token !== 'string') {
                return res.status(400).json({ error: 'Токен не передан' });
            }
            const result = await mailService.verifyEmail(token);
            if (result.error) {
                return res.status(400).json({ error: result.error });
            }
            return res.status(200).json({ message: result.message });
        } catch (e) {
            next(e);
        }
    }

    async recovery(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: 'Email обязателен' });

            const result = await authService.recoveryPassword(email);
            if (result.error) return res.status(400).json({ error: result.error });

            return res.json({ message: 'Новый пароль отправлен на вашу почту' });
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();
