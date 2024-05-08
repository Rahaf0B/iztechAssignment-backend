import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import requestValidation from "../middleware/requestValidation";
const router = Router();
import crypto from "crypto";
import CUser from "../controllers/user";
import imageHandler from "../middleware/ImageHandeler";
import authorization from "../middleware/authorization";

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get(
  "/profile-picture",
  authorization.checkUserAuthorization,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const image_url = await instance.getUserProfilePicture(req.uid);
      res.status(200).send({ url: image_url });
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

router.post(
  "/register-user",
  requestValidation.validateRegisterUserAccount,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const [token, userData] = await instance.registerUser(req.body);
      res.status(201).setHeader("Authorization", token).send(userData);
    } catch (error: any) {
      if (error.cause == "Validation error") {
        res.status(409).send("Duplicate Email");
      } else {
        res.status(500).send;
      }
    }
  }
);

router.post(
  "/login",
  requestValidation.validateLoginUserAccount,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();

      const [token, userData] = await instance.userLogin(req.body);
      res.status(201).setHeader("Authorization", token).setHeader("Content-Type","application/json; charset=utf-8").send(userData);
    } catch (error: any) {
      if (error.cause == "not-found" || error.cause == "Validation Error") {
        res.status(406).send("The email or password is incorrect");
      } else res.status(500).send;
    }
  }
);

router.post("/logout", async (req: Request, res: Response) => {
  try {
  } catch (error: any) {}
});

router.put(
  "/send-opt-code",
  requestValidation.validateGenerateOPTCode,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      await instance.sendOPTCode(req.body);
      res.status(200).send({"msg":"OK"});
    } catch (error: any) {
      if (error.cause == "not-found") {
        res.status(404).send("user not found");
      } else res.status(500).send();
    }
  }
);

router.put(
  "/validate-opt-code",
  requestValidation.validateOPTCode,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      const status = await instance.validateOPTCode(req.body);
      res.status(200).send({ status: status });
    } catch (error: any) {
      if (error.cause == "not-found") {
        res.status(404).send("user not found");
      } else res.status(500).send;
    }
  }
);

router.patch(
  "/change-password",
  requestValidation.validateChangePassword,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      await instance.changePassword(req.body);
         res.status(200).send({"msg":"OK"})  ;
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

router.patch(
  "/edit-profile-picture",
  authorization.checkUserAuthorization,
  imageHandler.upload,
  imageHandler.imageUploader,
  async (req: Request, res: Response) => {
    try {
      const instance = CUser.getInstance();
      await instance.updateProfilePicture(req.uid, req.url);
      res.status(200).send();
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

export default router;
