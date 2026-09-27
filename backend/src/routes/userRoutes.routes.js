import express from "express";
import { connectUser, createUser, deleteUser, updateUserData, updateUserPassword } from "../controller/userController.js";

const userRouter = express.Router();

//rota para criar usuario
userRouter.post("/users/create", createUser);

//rota para fazer o login conectando o usuario
userRouter.post("/users/login", connectUser);

userRouter.put("/users/update", updateUserData);

userRouter.put("/users/password", updateUserPassword);

userRouter.delete("/users/delete", deleteUser);

export default userRouter;
