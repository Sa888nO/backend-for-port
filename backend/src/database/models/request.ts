import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user';
import { File } from './file';
import { Client } from './client';
import { QR } from './qr';

export type Status = 'pending' | 'accepted' | 'rejected';

export interface iRequest {
    id?: number;
    user_id: number;
    file_id: number;
    status: Status;
    name: string;
    description: string;
    qr_id?: number;
}

@Table({
    timestamps: false,
    tableName: 'requests',
})
export class Request extends Model<iRequest> {
    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description!: string;

    @Column({ type: DataType.STRING, allowNull: true })
    comment!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    status!: Status;

    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    user_id!: number;

    @ForeignKey(() => File)
    @Column({ type: DataType.INTEGER, allowNull: false })
    file_id!: number;

    @BelongsTo(() => File, 'file_id')
    file!: File;

    @ForeignKey(() => QR)
    @Column({ type: DataType.INTEGER, allowNull: true })
    qr_id?: number | null;

    @BelongsTo(() => QR, 'qr_id')
    qr?: QR | null;
}
