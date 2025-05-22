import { Sequelize } from "sequelize-typescript";
import sequelizeConfig from "../configs/database";
import { Token } from "./models/token";
import { File } from "./models/file";
import { Client } from "./models/client";
import { User } from "./models/user";

// import { Token } from "./models/token.model";
// import { User } from "./models/user.model";
// import { Request } from "./models/request.model";
// import { File } from "./models/file.model";
// import { RequestFile } from "./models/request_file";
// import { Client } from "./models/client.model";
// import { Laywer } from "./models/laywer.model";
// import { Template } from "./models/template.model";
// import { RequestStep } from "./models/request_step.model";
// import { RequestStepFile } from "./models/request_step_file.model";
// import { Chat } from "./models/chat.model";
// import { ChatMessage } from "./models/chat_message.model";
// import { ChatMessageFile } from "./models/chat_message_file.model";

const sequelize = new Sequelize({
    ...sequelizeConfig,
    models: [
        User,
        Token,
        Client,
        File
    ],
});

// Проверка соединения с базой данных
const databaseConnection = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log(
            "Успешное подключение к базе данных и синхронизация моделей"
        );
    } catch (error) {
        console.error("Ошибка подючения к базе данных", error);
    }
};

export default databaseConnection;