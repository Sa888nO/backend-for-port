import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import { Token } from '../database/models/token';
import { Client } from '../database/models/client';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vladikavkaz.port.service@gmail.com',
        pass: 'diya evbq wsmf fdsr',
    },
});

class MailService {
    async SendVerificationEmail(target: string, link: string) {
        await transporter.sendMail({
            from: 'vladikavkaz.port.service@gmail.com',
            to: target,
            subject: 'Подтверждение регистрации',
            html: `
                <h2>Подтвердите вашу почту</h2>
                <p>Для подтверждения регистрации перейдите по ссылке:</p>
                <a href="${link}">${link}</a>
            `,
        });
    }
    async verifyEmail(tokenValue: string) {
        const token = await Token.findOne({ where: { token: tokenValue } });
        if (!token) return { error: 'Неверный токен' };

        if (dayjs().isAfter(dayjs(token.expires_at))) {
            return { error: 'Токен истёк' };
        }

        const client = await Client.findByPk(token.client_id);
        if (!client) return { error: 'Клиент не найден' };

        client.is_verified = true;
        await client.save();

        await token.destroy();

        return { message: 'Email успешно подтверждён' };
    }

    async sendRecoveryEmail(target: string, password: string) {
        await transporter.sendMail({
            from: 'vladikavkaz.port.service@gmail.com',
            to: target,
            subject: 'Восстановление пароля',
            html: `
                <h2>Ваш пароль от аккаунта:</h2>
                <p>${password}</p>
            `,
        });
    }

    async sendResolve(target: string, requestName: string, resolveStatus: boolean) {
        await transporter.sendMail({
            from: 'vladikavkaz.port.service@gmail.com',
            to: target,
            subject: 'Ответ по заявке',
            html: `
                <h2>Заявка ${requestName}: ${resolveStatus ? 'Одобрена' : 'Отклонена'}</h2>
            `,
        });
    }
}

export default new MailService();
