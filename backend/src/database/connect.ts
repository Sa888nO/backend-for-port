import { Sequelize } from 'sequelize-typescript';
import sequelizeConfig from '../configs/database';
import { Token } from './models/token';
import { File } from './models/file';
import { Client } from './models/client';
import { User } from './models/user';
import { Template } from './models/template';
import { Request } from './models/request';

const sequelize = new Sequelize({
    ...sequelizeConfig,
    models: [User, Token, Client, File, Template, Request],
});

// Проверка соединения с базой данных
const databaseConnection = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Успешное подключение к базе данных и синхронизация моделей');
    } catch (error) {
        console.error('Ошибка подючения к базе данных', error);
    }
};

export default databaseConnection;
