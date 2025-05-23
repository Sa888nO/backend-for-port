import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Role } from '../../types/types';

export interface iUser {
    id?: number;
    email: string;
    password: string;
    role: Role;
}

@Table({
    timestamps: false,
    tableName: 'users',
})
export class User extends Model<iUser> {
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    role!: Role;
}

export async function seedAdmin() {
    const adminEmail = 'admin@admin.ru';
    const adminPassword = 'admin';
    const adminRole = 'admin';

    // Проверяем, есть ли уже такой пользователь
    const existing = await User.findOne({ where: { email: adminEmail } });
    if (existing) {
        console.log('Администратор уже существует');
        return;
    }

    // Хешируем пароль для безопасности

    // Создаем пользователя-администратора
    await User.create({
        email: adminEmail,
        password: adminPassword,
        role: adminRole,
    });

    console.log('Администратор успешно создан');
}
