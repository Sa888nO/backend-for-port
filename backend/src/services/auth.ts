import { User } from "../database/models/user";
import { Client } from "../database/models/client";
import jwt from "jsonwebtoken";

const SECRET_KEY = '123456789' // @TODO USE ENV

class AuthSerivce {
    async Login (email: string, password: string) {
        // Поиск пользователя по email
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return { error: 'нет пользователя' };
    }
    // Проверка пароля (в реальном проекте сравнивать хеши!)
    if (user.password !== password) {
        return { error: 'неверный пароль' };
    }
    // Проверка роли
    if (user.role === 'client') {
        const client = await Client.findOne({ where: { user_id: user.id } });
        if (!client || !client.is_verified) {
            return { error: 'пользователь не подтвердил почту' };
        }
        // Генерация JWT с ролью client и данными пользователя
        const token = jwt.sign(
            { user_id: user.id, role: user.role },
            JWTSecret,
            { expiresIn: '1h' }
        );
        return { token, user };
    }
    if (user.role === 'admin') {
        // Генерация JWT только с ролью admin
        const token = jwt.sign(
            { user_id: user.id, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        return { token };
    }
    return { error: 'неизвестная роль' };

    
    }
}