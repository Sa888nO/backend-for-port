import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
    status;
    errors;

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnAuthError() {
        return new ApiError(401, "пользователь не авторизован");
    }
    static BadRequestError(message: string, errors: any[] = []) {
        return new ApiError(400, message, errors);
    }
    static forbiddenError() {
        return new ApiError(400, "Недостаточно прав");
    }
}

export const ErrorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
    } else {
        res.status(500).json({
            message: "Ошибка сервера",
        });
    }
};