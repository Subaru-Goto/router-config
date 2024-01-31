import express from "express";
import { 
  getAllUsers,
  getSingleUser,
  createNewUser,
  updateUser,
  deleteUser
} from "../controllers/usersController.js";
import {
  userValidator
} from "../validators/index.js";
import { checkExistingUser } from "../controllers/usersController.js";

export const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", checkExistingUser, getSingleUser);
usersRouter.post("/", userValidator, createNewUser);
usersRouter.put("/:id", userValidator, checkExistingUser, updateUser);
usersRouter.delete("/:id", checkExistingUser, deleteUser);