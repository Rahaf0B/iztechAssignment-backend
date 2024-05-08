import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

async function checkUserAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization as string;
  if (!token) {
    return res.status(401).send("The token is required");
  } else {
    token = token?.split(" ")[1];
    jwt.verify(token, process.env.SECRET as string, (err: any, user: any) => {
      if (err) return res.sendStatus(401);
      req.uid = user.uid;
      next();
    });
  }
}

export default {
  checkUserAuthorization,
};
