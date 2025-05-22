import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user';

export interface iClient {
    id?: number;
    user_id: number;
    name?: string;
    surname?: string;
    is_verified: boolean;
}

@Table({
    timestamps: false,
    tableName: 'clients',
})
export class Client extends Model<iClient> {
    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    surname!: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    is_verified!: boolean;
}
