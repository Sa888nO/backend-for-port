import { config } from "dotenv";
import envConfig from "./configs/env";
config(envConfig);
import express from "express";
import databaseConnection from "./database/connect";
import cors from "cors";
import path from "path";
import { ErrorMiddleware } from "./middlewares/error";
import authRouter from "./routes/auth";

const app = express();

app.use(
    cors({
        origin: "*", // Разрешаем доступ с любого домена
    })
);

app.use(express.json());
const staticFilesDirectory = path.join(__dirname, "../files");
app.use("/files", express.static(staticFilesDirectory));
app.use("/api/", authRouter);
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 3000;

databaseConnection();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});