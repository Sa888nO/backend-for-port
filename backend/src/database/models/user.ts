import { Table, Column, Model, DataType } from "sequelize-typescript";
import { Role } from "../../types/types";

export interface iUser {
    id?: number;
    email: string;
    password: string;
    role: Role;
}

@Table({
    timestamps: false,
    tableName: "users",
})
export class User extends Model<iUser> {
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    role!: Role;
}