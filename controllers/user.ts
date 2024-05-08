import { IUser } from "../config/interfaces/interfaces";
import User from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { number, string } from "yup";
import bcrypt from "bcrypt";
import sendEmail from "../config/emailConfiguration/emailTemplate";
dotenv.config();

export default class CUser {
  private static instance: CUser;

  private constructor() {}

  public static getInstance(): CUser {
    if (CUser.instance) {
      return CUser.instance;
    }
    CUser.instance = new CUser();
    return CUser.instance;
  }

  generateToken(id: number, email: string): string {
    const token = jwt.sign({ uid: id, email: email }, process.env.SECRET, {
      expiresIn: "300s",
    });
    return token;
  }

  async registerUser(data: Partial<IUser>): Promise<[string, IUser]> {
    try {
      const createdUser = await User.create(data);
      const user = createdUser.toJSON();
      delete user.password;
      const token = this.generateToken(user.uid, user.email);
      delete user.uid;
      return [token, user];
    } catch (error: any) {
      if (error.name == "SequelizeUniqueConstraintError") {
        throw new Error(error?.errors[0]?.message, {
          cause: "Validation error",
        });
      }
      throw new Error();
    }
  }

  async updateProfilePicture(uid: number, url: string): Promise<void> {
    try {
      const data = await User.update(
        { url_image: url },
        { where: { uid: uid } }
      );
    } catch (error) {
      throw new Error();
    }
  }
  async checkUserExists(key: string, data: string | number):Promise<IUser> {
    try {
      const user = await User.findOne({
        where: { [key]: data },
        attributes: ["uid", "email", "password", "url_image"],
      });
      if (user) {
        return user.toJSON();
      }
      throw new Error("No User found", { cause: "not-found" });
    } catch (error: any) {
      throw new Error(error.message, { cause: error?.cause });
    }
  }

  async userLogin(user: Partial<IUser>): Promise<[string, IUser]> {
    try {
      const userData = await this.checkUserExists("email", user.email);
      if (userData) {
        const validatePassword = await bcrypt.compare(
          user.password,
          userData.password
        );
        if (validatePassword) {
          delete userData.password;
          const token = await this.generateToken(userData.uid, userData.email);
          delete userData.uid;
          return [token, userData];
        } else {
          throw new Error("Invalid Data Try Again", {
            cause: "Validation Error",
          });
        }
      }
    } catch (error: any) {
      throw new Error(error.message, { cause: error?.cause });
    }
  }

  async getUserProfilePicture(uid: number): Promise<string> {
    try {
      const userData = await User.findOne({
        where: { uid: uid },
        attributes: ["url_image"],
      });
      const url_image = userData.toJSON().url_image;
      return url_image;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changePassword(data: Partial<IUser>): Promise<void> {
    try {
      const salt = bcrypt.genSaltSync(10);
      const newPassword = bcrypt.hashSync(data.password, salt);
      await User.update(
        { password: newPassword },
        { where: { email: data.email } }
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async sendOPTCode(userData: Partial<IUser>):Promise<void> {
    try {
      const user = await this.checkUserExists("email", userData.email);
      if (user) {
        const randomOPT =
          Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const updatedData = await User.update(
          { opt_code: randomOPT.toString() },
          {
            where: {
              uid: user.uid,
            },
          }
        );
        sendEmail(
          user.email,
          "OPT CODE",
          "Your OPT CODE is " + randomOPT.toString()
        );
      }
    } catch (error: any) {
      throw new Error(error.message, { cause: error?.cause });
    }
  }

  async validateOPTCode(userData: Partial<IUser>): Promise<boolean> {
    try {
      let user = await User.findOne({ where: { email: userData.email } });
      user = user?.toJSON();
      if (user) {
        if (user.opt_code === userData.opt_code) {
          const updatedData = await User.update(
            { opt_code: null },
            {
              where: {
                email: userData.email,
              },
            }
          );
          return true;
        }
      }
      return false;
    } catch (error: any) {
      throw new Error(error.message, { cause: error?.cause });
    }
  }
}
