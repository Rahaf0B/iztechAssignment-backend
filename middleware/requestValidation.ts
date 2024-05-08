import { object, string, number, date, mixed, lazy, array, bool } from "yup";
import { Request, Response, NextFunction, query } from "express";

async function validateRegisterUserAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      user_name: string()
        .strict(true)
        .typeError("The user_name Should be String")
        .nullable()
        .required("The user_name is required"),

      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .min(8, "password should not be less than 8 digits")
        .matches(
          /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must numbers and special characters"
        )
        .nullable(),
    })
      .required("The user_name,email,password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await schema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateLoginUserAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .nullable(),
    })
      .required("The email and password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await schema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateGenerateOPTCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),
    })
      .required("The email is required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await schema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateOPTCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      opt_code: string()
        .strict(true)
        .required("The opt_code is required")
        .length(6, "The opt_code must be a 6 digit code")
        .nullable(),
    })
      .required("The opt_code and email are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await schema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateChangePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      email: string()
        .strict(true)
        .typeError("The Email Should be String")
        .required("The email is required")
        .email("It should be in the Email form")
        .nullable(),

      password: string()
        .strict(true)
        .required("The password is required")
        .typeError("The password Should be String")
        .min(8, "password should not be less than 8 digits")
        .matches(
          /^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
          "The password must numbers and special characters"
        )
        .nullable(),
    })
      .required("The email and password are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await schema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateAddTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      title: string()
        .strict(true)
        .typeError("The title Should be String"),

      description: string()
        .strict(true)
        .typeError("The description Should be String"),
    })
      .required("The title and description are required")
      .nullable()
      .strict(true)
      .noUnknown(true),
  });

  try {
    const response = await schema.validate({ body: req.body });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateEditTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    body: object({
      title: string().strict(true).typeError("The title Should be String"),
      description: string()
        .strict(true)
        .typeError("The description Should be String"),

      status: bool()
        .strict(true)
        .typeError("The status Should be boolean value"),
    })
      .required(
        "To Edit the TODO the title / description / status are required"
      )
      .nullable()
      .strict(true)
      .noUnknown(true),

    params: object({
      id: number()
        .typeError("the todo id must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The todo id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await schema.validate({
      body: req.body,
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}

async function validateDeleteTodo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let schema = object({
    params: object({
      id: number()
        .typeError("the todo id must be a number")
        .integer("Please enter a valid number.")
        .nullable()
        .required("The todo id is required"),
    }).noUnknown(true),
  });

  try {
    const response = await schema.validate({
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}




async function validatePageAndItemNumber(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      page_number: number()
        .typeError("page_number must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The page_number is required")
        .min(1, "The page_number must be 1 or above"),

      number_of_items: number()
        .typeError("number_of_items must be a number")
        .integer(" enter a valid number")
        .nullable()
        .required("The number_of_items is required")
        .min(1, "The number_of_items must be 1 or above"),
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}


async function validateSearch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let validateSchema = object({
    query: object({
      title: string()
        .typeError("page_number must be a number")
        .nullable()
        .required("The page_number is required"),

     
    }).noUnknown(true),
  });

  try {
    const response = await validateSchema.validate({
      query: req.query,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
}



export default {
  validateRegisterUserAccount,
  validateLoginUserAccount,
  validateGenerateOPTCode,
  validateOPTCode,
  validateChangePassword,
  validateAddTodo,
  validateEditTodo,
  validateDeleteTodo,
  validatePageAndItemNumber,
  validateSearch,
};
