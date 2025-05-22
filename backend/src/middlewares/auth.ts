import { Request, Response, NextFunction } from "express";
// import tokenService from "../services/token.service";
import { ApiError } from "./error";
import { Role } from "../types/types";
const authMiddleware = (
    allowedRoles: Role[] = ["admin", "client"]
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return next(ApiError.UnAuthError());
            }
            const token = authHeader?.split(" ")[1];
            if (!token) {
                return next(ApiError.UnAuthError());
            }
            // const userData = tokenService.validateAccessToken(token);
            // if (!userData) {
            //     return next(ApiError.UnAuthError());
            // }
            // if (!allowedRoles.includes(userData.role)) {
            //     return next(ApiError.forbiddenError());
            // }
            next();
        } catch (e) {
            return next(ApiError.UnAuthError());
        }
    };
};

export default authMiddleware;