import { config } from 'dotenv';
import envConfig from './configs/env';
config(envConfig);
import express from 'express';
import databaseConnection from './database/connect';
import cors from 'cors';
import path from 'path';
import { ErrorMiddleware } from './middlewares/error';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import templateRouter from './routes/template';
import { seedAdmin } from './database/models/user';

const app = express();

app.use(
    cors({
        origin: '*', // Разрешаем доступ с любого домена
    }),
);

app.use(express.json());
const staticFilesDirectory = path.join(__dirname, '../files');
app.use('/files', express.static(staticFilesDirectory));
app.use('/api/', authRouter);
app.use('/api', userRouter);
app.use('/api', templateRouter);
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 3000;

databaseConnection().then(() => seedAdmin());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
