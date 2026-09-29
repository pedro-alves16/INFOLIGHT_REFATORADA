import express from "express";
import { dataSource } from "../config/dataSource.js";
import { userTest, User, userSchema } from "../model/entities/userModel.js";
import { createUser, deleteUser, updateUser } from "../model/userService.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

//rota para criar usuario
userRouter.post("/users/create", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);
  const result = await createUser(userRepository, req.body);
  return res.send(result);
});

//rota para atualizar usuario
userRouter.put("/users/update", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);
  const result = await updateUser(userRepository, res.locals.user.id, req.body);
  return res.json(result);
});

//rota para deletar usuario
userRouter.delete("/users/delete", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);
  const result = await deleteUser(
    userRepository,
    res.locals.user.id,
    req.body.senha,
  );
  return res.json(result);
});

//rota para alterar senha do usuario
userRouter.put("/users/password", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);

  const senhas = {
    senhaAntiga: req.body.senhaAntiga,
    senhaNova: req.body.senhaNova,
  };

  const user = await userRepository.findOneBy({ id: res.locals.user.id });
  if (user.password === senhas.senhaAntiga) {
    userRepository.merge(user, { password: senhas.senhaNova });
    const results = await userRepository.save(user);
    res.json({
      message: "senha alterada com sucesso!",
    });
  } else {
    res.json({
      error: "senha não alterada, algo deu errado!",
    });
    return;
  }
});

//rota para fazer o login conectando o usuario
userRouter.post("/users/login", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);

  const userCredentials = req.body;

  const userFromDatabase = await userRepository.findOneBy({
    email: userCredentials.email,
  });

  if (!userFromDatabase) {
    console.log(userFromDatabase);
    return res.json({ error: "usuário não cadastrado, crie sua conta!" });
  }

  if (!userFromDatabase) {
    return res.json({
      error: "Usuário não encontrado",
    });
  }

  if (userCredentials.password === userFromDatabase.password) {
    req.session.user = {
      id: userFromDatabase.id,
      nome: userFromDatabase.userName,
      email: userFromDatabase.email,
    };

    return res.status(200).json({
      userName: userFromDatabase.userName,
      canLoggin: true,
    });
  }

  return res.json({
    error: "Senha incorreta",
  });
});

export default userRouter;
