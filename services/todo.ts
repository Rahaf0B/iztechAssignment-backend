import express, { Router, Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import requestValidation from "../middleware/requestValidation";
import authorization from "../middleware/authorization";
import CTodo from "../controllers/todo";

const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.get(
  "/",
  authorization.checkUserAuthorization,
  requestValidation.validatePageAndItemNumber,
  async (req: Request, res: Response) => {
    try {
      const instance = CTodo.getInstance();
      const [count, data] = await instance.getAllUserTodo(
        req.uid,
        Number(req.query.page_number),
        Number(req.query.number_of_items)
      );
      res.status(200).send({ numberOfItems: count, items: data });
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

router.get(
  "/search",
  authorization.checkUserAuthorization,
  requestValidation.validatePageAndItemNumber,
  requestValidation.validateSearch,
  async (req: Request, res: Response) => {
    try {
      const instance = CTodo.getInstance();
      const [count, data] = await instance.search(
        req.uid,
        req.query.title as string,
        Number(req.query.page_number),
        Number(req.query.number_of_items)
      );
      res.status(200).send({ numberOfItems: count, items: data });
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

router.post(
  "/add-todo",
  authorization.checkUserAuthorization,
  requestValidation.validateAddTodo,
  async (req: Request, res: Response) => {
    try {
      const instance = CTodo.getInstance();
      const todoData = await instance.addTodo(req.uid, req.body);
      res.status(200).send(todoData);
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

router.patch(
  "/edit-todo/:id",
  authorization.checkUserAuthorization,
  requestValidation.validateEditTodo,
  async (req: Request, res: Response) => {
    try {
      const instance = CTodo.getInstance();

      const data = await instance.editTodo(
        req.uid,
        Number(req.params.id),
        req.body
      );
      res.status(200).send(data);
    } catch (error: any) {
      res.status(500).send;
    }
  }
);

router.delete(
  "/:id",
  authorization.checkUserAuthorization,
  requestValidation.validateDeleteTodo,
  async (req: Request, res: Response) => {
    try {
      const instance = CTodo.getInstance();
      await instance.deleteTodo(req.uid, Number(req.params.id));
      res.status(200).send({"msg":"OK"});

    } catch (error: any) {
      res.status(500).send;
    }
  }
);

export default router;
