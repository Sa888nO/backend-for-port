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
import requestRouter from './routes/request';
import fileRouter from './routes/file';
import QRRouter from './routes/qr';

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json());
const staticFilesDirectory = path.join(__dirname, '../files');
app.use('/files', express.static(staticFilesDirectory));
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', templateRouter);
app.use('/api', requestRouter);
app.use('/api', fileRouter);
app.use('/api', QRRouter);
app.use(ErrorMiddleware);

const PORT = process.env.PORT || 3000;

databaseConnection().then(() => seedAdmin());
app.listen(PORT);
