import { User } from '../database/models/user';
import { Client } from '../database/models/client';
import { Token } from '../database/models/token';
import mailService from './mail';
import { uuid } from 'uuidv4';
import dayjs from 'dayjs';
import jwt, { verify } from 'jsonwebtoken';

const SECRET_KEY = '123456789'; // @TODO USE ENV

class AuthService {
    async Login(email: string, password: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) return { error: 'нет пользователя' };
        if (user.password !== password) return { error: 'неверный пароль' };
        if (user.role === 'client') {
            const client = await Client.findOne({ where: { user_id: user.id } });
            if (!client || !client.is_verified) return { error: 'пользователь не подтвердил почту' };
            const token = jwt.sign({ user_id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '30d' });
            return { token };
        }
        if (user.role === 'admin') {
            const token = jwt.sign({ user_id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '30d' });
            return { token };
        }
        return { error: 'неизвестная роль' };
    }
    async Registration(email: string, password: string, name: string, surname: string) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return { error: 'Пользователь уже существует' };

        // Создание пользователя
        const user = await User.create({ email, password, role: 'client' });

        // Создание клиента
        const client = await Client.create({
            user_id: user.id,
            name: name || '',
            surname: surname || '',
            is_verified: false,
        });

        // Генерация токена и срока действия (например, сутки)
        const tokenValue = uuid();
        const expiresAt = dayjs().add(1, 'day').toISOString();

        // Сохранение токена
        await Token.create({
            client_id: client.id,
            token: tokenValue,
            expires_at: expiresAt,
        });

        // Ссылка для подтверждения
        const verificationLink = `http://5.35.98.185:4444/api/auth/verification?token=${tokenValue}`;

        // Отправка письма
        await mailService.SendVerificationEmail(email, verificationLink);

        return { message: 'Письмо с подтверждением отправлено на ваш email' };
    }
    validateAccessToken(token: string) {
        try {
            const data = verify(token, String(SECRET_KEY));
            return data;
        } catch (e) {
            return null;
        }
    }
}

export default new AuthService();
