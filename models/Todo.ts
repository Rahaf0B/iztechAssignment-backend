import {
  Table,
  Model,
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  Index,
} from "sequelize-typescript";
import { ITodo } from "../config/interfaces/interfaces";
import User from "./User";

@Table({
  timestamps: false,
  tableName: "todo",
  modelName: "Todo",
})
class Todo extends Model<ITodo> implements ITodo {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id?: number;

  @Index({
    name: 'name-index',
    type:"FULLTEXT",
  })
  @Column({
    type: DataType.STRING,
  })
  declare title?: string;

  @Column({
    type: DataType.TEXT,
  })
  declare description?: string;

  
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare status?: boolean;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare uid: number;

  @BelongsTo(() => User, {
    foreignKey: "uid",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare user: User;
}

export default Todo;
