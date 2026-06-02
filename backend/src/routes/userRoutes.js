import express from "express";
import { dataSource } from "../config/dataSource.js";
import { userTest, User, userSchema } from "../model/entities/userModel.js";

const userRepository = dataSource.getRepository(userSchema);

const userRouter = express.Router();

//rota para criar usuario
userRouter.post("/users/create", async (req, res) => {
  const user = await userRepository.create(req.body);
  const result = await userRepository.save(user);
  return res.send(result);
});

//rota para fazer o login conectando o usuario
userRouter.post("/users/login", async (req, res) => {
  const userCredentials = req.body;
  const userFromDatabase = await userRepository.findOneBy({
    email: userCredentials.email,
  });

  const canLoggin = false;
  if (userCredentials.password === userFromDatabase.password) {
    res.status(200).json({
      userName: userFromDatabase.userName,
      canLoggin: true,
    });
  } else {
    res.json({
      error: "não autorizado!",
    });
  }
});

userRouter.get("/users/dashboard", (req, res) => {
  const userQuery = req.query.user;
  console.log(`query param:' ${userQuery} `);
  res.render("dashboard", { userName: userQuery });
});
export default userRouter;
