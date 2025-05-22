import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";

export interface iFile {
    id?: number;
    name: string;
    path_to_file: string;
}

@Table({
    tableName: "files",
})
export class File extends Model<iFile> {
    @Column({ type: DataType.STRING, allowNull: false })
    path_to_file!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name!: string;
}