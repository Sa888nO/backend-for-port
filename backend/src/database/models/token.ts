import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import { Client } from "./client";

export interface iToken {
    id?: number;
    client_id?: number;
    token?: string;
    expires_at?: string;
}

@Table({
    timestamps: false,
    tableName: "tokens",
})
export class Token extends Model<iToken> {
    @BelongsTo(() => Client)
    client!: Client;

    @ForeignKey(() => Client)
    @Column({ type: DataType.INTEGER, allowNull: false })
    client_id!: number;

    @Column({ type: DataType.STRING, allowNull: false })
    token!: string;

    @Column({ type: DataType.STRING, allowNull: false })
    expires_at!: string;
}