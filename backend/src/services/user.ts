import { User } from '../database/models/user';
import { Client } from '../database/models/client';
import { Token } from '../database/models/token';
class UserService {
    async getAllUsers() {
        const users = await User.findAll();
        const clients = await Client.findAll();
        return users.map((user) => {
            if (user.role === 'client') {
                const client = clients.find((client) => client.user_id === user.id);
                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: client ? client?.name : null,
                    surname: client ? client.surname : null,
                    is_verified: client ? client.is_verified : null,
                };
            }
            return { id: user.id, email: user.email, role: user.role };
        });
    }
    async deleteUser(id: User['id']) {
        const user = await User.findByPk(id);
        if (!user) {
            return { error: 'Пользователь не найден' };
        }
        if (user.role === 'client') {
            const client = await Client.findOne({ where: { user_id: user.id } });
            // Удалить связанные токены клиента
            await Token.destroy({ where: { client_id: client?.id } });

            // Удалить запись клиента
            await Client.destroy({ where: { user_id: id } });
        }

        // Удалить пользователя
        await User.destroy({ where: { id } });

        return { message: 'Пользователь и связанные данные успешно удалены' };
    }

    async getUserById(id: number) {
        const user = await User.findByPk(id);
        if (!user) return { error: 'Пользователь не найден' };

        // Если client — ищем данные клиента
        if (user.role === 'client') {
            const client = await Client.findOne({ where: { user_id: id } });
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                name: client?.name ?? null,
                surname: client?.surname ?? null,
                is_verified: client?.is_verified ?? null,
            };
        }

        // Для других ролей
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    }

    async updateUser(
        id: number,
        data: {
            email?: string;
            password?: string;
            name?: string;
            surname?: string;
            is_verified?: boolean;
        },
    ) {
        const user = await User.findByPk(id);
        if (!user) return { error: 'Пользователь не найден' };

        // Обновляем email и пароль, если переданы
        if (data.email) user.email = data.email;
        if (data.password) user.password = data.password;
        await user.save();

        // Если client — обновляем данные клиента
        if (user.role === 'client') {
            const client = await Client.findOne({ where: { user_id: id } });
            if (client) {
                if (data.name !== undefined) client.name = data.name;
                if (data.surname !== undefined) client.surname = data.surname;
                if (data.is_verified !== undefined) client.is_verified = data.is_verified;
                await client.save();
            }
        }

        return { message: 'Пользователь успешно обновлён' };
    }

    async createUser(data: { email: string; password: string; role: string; name?: string; surname?: string; is_verified?: boolean }) {
        // Проверка на существование пользователя
        const exists = await User.findOne({ where: { email: data.email } });
        if (exists) {
            return { error: 'Пользователь с таким email уже существует' };
        }

        // Хешируем пароль
        // const hash = await bcrypt.hash(data.password, 10);

        // Создаём пользователя
        const user = await User.create({
            email: data.email,
            password: data.password,
            role: data.role as User['role'],
        });

        // Если роль client — создаём запись в clients
        if (data.role === 'client') {
            await Client.create({
                user_id: user.id,
                name: data.name || '',
                surname: data.surname || '',
                is_verified: data.is_verified ?? false,
            });
        }

        return { message: 'Пользователь успешно создан', user };
    }
}

export default new UserService();
