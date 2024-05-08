import { Sequelize } from "sequelize-typescript";
import { ITodo } from "../config/interfaces/interfaces";
import Todo from "../models/Todo";
import { Op } from "sequelize";

export default class CTodo {
  private static instance: CTodo;

  private constructor() {}

  public static getInstance(): CTodo {
    if (CTodo.instance) {
      return CTodo.instance;
    }
    CTodo.instance = new CTodo();
    return CTodo.instance;
  }

  async countTodo(uid: number): Promise<number> {
    try {
      const numberOfTodo = await Todo.count({
        where: { uid: uid },
      });

      return numberOfTodo;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllTodoData(
    uid: number,
    pageNumber: number,
    numberOfItems: number
  ): Promise<ITodo[]> {
    try {
      const data = await Todo.findAll({
        offset: (pageNumber - 1) * numberOfItems,
        limit: numberOfItems,
        where: { uid: uid },
        attributes: ["id", "title", "description", "status"],
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllUserTodo(
    uid: number,
    pageNumber: number,
    numberOfItems: number
  ): Promise<[number, ITodo[]]> {
    try {

      const dataTodo = await this.getAllTodoData(
        uid,
        pageNumber,
        numberOfItems
      );
      const numberOfTodo = await this.countTodo(uid);
      return [numberOfTodo, dataTodo];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addTodo(uid: number, todoData: ITodo): Promise<ITodo> {
    try {
      todoData.uid = uid;
      const data = await Todo.create(todoData);
      return data.toJSON();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getTodoById(id: number): Promise<ITodo> {
    try {
      const data = await Todo.findByPk(id);
      return data.toJSON();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async editTodo(uid: number, todoId: number, todoData: ITodo): Promise<ITodo> {
    try {
      const updatedRow = await Todo.update(todoData, {
        where: { uid: uid, id: todoId },
      });
      let data;
      if (updatedRow[0] != 0) {
        data = this.getTodoById(todoId);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteTodo(uid: number, todoId: number): Promise<void> {
    try {
      const updatedRow = await Todo.destroy({
        where: { uid: uid, id: todoId },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async countSearchResult(uid: number, searchString: string): Promise<number> {
    try {
      const count = await Todo.count({
        where: {
          [Op.and]: [
            {
              uid: uid,
            },
            Sequelize.literal(
              `MATCH (todo.title) AGAINST('${searchString}' IN NATURAL LANGUAGE MODE)`
            ),
          ],
        },
      });
      return count;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async searchByTitle(
    uid: number,
    searchString: string,
    pageNumber: number,
    numberOfItems: number
  ): Promise<ITodo[]> {
    try {
      const data = await Todo.findAll({
        offset: (pageNumber - 1) * numberOfItems,
        limit: numberOfItems,
        where: {
          [Op.and]: [
            {
              uid: uid,
            },
            Sequelize.literal(
              `MATCH (todo.title) AGAINST('${searchString}' IN NATURAL LANGUAGE MODE)`
            ),
          ],
        },
        attributes: { exclude: ["uid"] },
      });
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async search(
    uid: number,
    searchString: string,
    pageNumber: number,
    numberOfItems: number
  ): Promise<[number, ITodo[]]> {
    try {
      const count = await this.countSearchResult(uid, searchString);
      const items = await this.searchByTitle(
        uid,
        searchString,
        pageNumber,
        numberOfItems
      );
      return [count, items];
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
