import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "../../models/User";
import Todo from "../../models/Todo";

dotenv.config()

const sequelize = new Sequelize({
    database: process.env.DB,
    username: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.Host,
    port: Number(process.env.PORT),
    dialect: "mysql",
  });


sequelize.addModels([User,Todo]);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sequelize.sync();
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

export default {sequelize};