import express from "express";
import { dataSource } from "../config/dataSource.js";
import { userTest, User, userSchema } from "../model/entities/userModel.js";
import { connectUser, createUser, deleteUser, updateUserData, updateUserPassword } from "../controller/userController.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

//rota para criar usuario
userRouter.post("/users/create", createUser);

//rota para fazer o login conectando o usuario
userRouter.post("/users/login", connectUser);

userRouter.put("/users/update", updateUserData);

userRouter.put("/users/password", updateUserPassword);

userRouter.delete("/users/delete", deleteUser);

export default userRouter;
