import { SequelizeOptions } from "sequelize-typescript";

const sequelizeConfig: Omit<SequelizeOptions, "models"> = {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    sync: {
        // alter: true,
        force: true,
    },
};

export default sequelizeConfig;