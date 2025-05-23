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
}

export default new UserService();
