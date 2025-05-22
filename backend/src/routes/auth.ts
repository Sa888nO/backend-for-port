import { Router } from "express";
import AuthController from "../controllers/auth";
import authMiddleware from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/auth/login", AuthController.login);
authRouter.post("/auth/registration", AuthController.registration);
authRouter.get("/auth/test", AuthController.test);
// authRouter.get(
//     "/auth/user",
//     authMiddleware([, "admin", "client"]),
//     AuthController.user
// );

export default authRouter;