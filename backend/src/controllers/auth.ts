import { Request, Response, NextFunction } from "express";
// import authService from "../services/auth.service";
// import userService from "../services/user.service";
// import { ApiError } from "../middlewares/error.middleware";
// import tokenService from "../services/token.service";

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            console.log(email, password)
            // const tokens = await authService.login({
            //     email,
            //     password,
            // });
            // return res.json(tokens);
        } catch (e) {
            next(e);
        }
    }
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, role } = req.body;
            // const tokens = await authService.registration({
            //     email,
            //     password,
            //     role,
            // });
            // res.json(tokens);
        } catch (e) {
            next(e);
        }
    }
    async test(req: Request, res: Response, next: NextFunction) {
        try {
            // const { email, password, role } = req.body;
            // const tokens = await authService.registration({
            //     email,
            //     password,
            //     role,
            // });
            // res.json(tokens);
            return res.json({ message: "okss" });
        } catch (e) {
            next(e);
        }
    }
    // async user(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const authHeader = req.headers.authorization;
    //         if (!authHeader) {
    //             return next(ApiError.UnAuthError());
    //         }
    //         const token = authHeader?.split(" ")[1];
    //         if (!token) {
    //             return next(ApiError.UnAuthError());
    //         }
    //         const userData = tokenService.validateAccessToken(token);
    //         if (!userData) {
    //             return next(ApiError.UnAuthError());
    //         }
    //         const user = await userService.findUserByEmail(userData.email);
    //         if (!user) {
    //             return next(ApiError.UnAuthError());
    //         }
    //         return res.json({
    //             role: user.role,
    //             email: user.email,
    //             id: user.id,
    //         });
    //     } catch (e) {
    //         next(e);
    //     }
    // }
}

export default new AuthController();