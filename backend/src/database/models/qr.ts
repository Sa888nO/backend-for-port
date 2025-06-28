import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { File } from './file';

export interface iQR {
    id?: number;
    is_blocked: boolean;
    file_id: number;
}

@Table({
    tableName: 'qrs',
})
export class QR extends Model<iQR> {
    @Column({ type: DataType.BOOLEAN, allowNull: false })
    is_blocked!: boolean;

    @ForeignKey(() => File)
    @Column({ type: DataType.INTEGER, allowNull: false })
    file_id!: number;

    @BelongsTo(() => File, 'file_id')
    file!: File;
}
