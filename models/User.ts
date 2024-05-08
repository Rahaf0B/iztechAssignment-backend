import {
  DataType,
  AllowNull,
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  IsEmail,
  Unique,
  HasMany,
  BeforeCreate,
  Is,
} from "sequelize-typescript";
import { IUser } from "../config/interfaces/interfaces";
import Todo from "./Todo";
import bcrypt from "bcrypt";
@Table({
  timestamps: false,
  tableName: "user",
  modelName: "User",
})
class User extends Model<IUser> implements IUser {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare uid?: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare user_name: string;

  @AllowNull(false)
  @Is(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @Unique
  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare password?: string;

  @Column({
    type: DataType.STRING,
  })
  declare url_image?: string;

  @Column({
    type: DataType.STRING,
  })
  declare opt_code?: string;

  @HasMany(() => Todo, {
    foreignKey: "uid",
  })
  declare todo: Todo[];

  @BeforeCreate
  static passwordEncryption(instance: User) {
    try {
      const salt = bcrypt.genSaltSync(10);
      instance.password = bcrypt.hashSync(instance.password, salt);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}

export default User;
