import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { File } from './file';

export interface iTemplate {
    id?: number;
    name: string;
    schema: object;
    file_id: number;
}

@Table({
    tableName: 'templates',
})
export class Template extends Model<iTemplate> {
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    name!: string;

    @Column({ type: DataType.JSON, allowNull: false })
    schema!: object;

    @ForeignKey(() => File)
    @Column({ type: DataType.INTEGER, allowNull: false })
    file_id!: number;

    @BelongsTo(() => File, 'file_id')
    file!: File;
}
