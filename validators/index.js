import { body } from "express-validator";

export const userValidator = [
  body("first_name")
    .optional({values:undefined})
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Please input your name as a string format."),
  
    body("last_name")
    .optional({values:undefined})
    .isString()
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Please input your name as a string format.")
];