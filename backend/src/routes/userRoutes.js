import express from "express";
import { dataSource } from "../config/dataSource.js";
import { userTest, User, userSchema } from "../model/entities/userModel.js";

const userRouter = express.Router();

//rota para criar usuario
userRouter.post("/users/create", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);

  const user = await userRepository.create(req.body);
  const result = await userRepository.save(user);
  return res.send(result);
});

//rota para fazer o login conectando o usuario
userRouter.post("/users/login", async (req, res) => {
  const userRepository = dataSource.getRepository(userSchema);

  const userCredentials = req.body;

  const userFromDatabase = await userRepository.findOneBy({
    email: userCredentials.email,
  });

  if (!userFromDatabase) {
    return res.status(401).json({
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

  return res.status(401).json({
    error: "Senha incorreta",
  });
});

userRouter.get("/users/dashboard", (req, res) => {
  const userQuery = req.query.user;

  console.log(req.session);

  res.render("dashboard", { user: req.session.user });
});

userRouter.put("/users/update", async (req, res) => {
  const usuarioAtualizado = {
    userName: req.body.userName,
    email: req.body.email,
  };
  const userRepository = dataSource.getRepository(userSchema);
  const user = await userRepository.findOneBy({ id: res.locals.user.id });
  userRepository.merge(user, usuarioAtualizado);
  const results = await userRepository.save(user);
  res.json({ message: "usuario atualizado!" });
});

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
      message: "senha não alterada, algo deu errado!",
    });
    return;
  }
});
export default userRouter;
