import { getUsers, createUsers } from "../model/userModelMockup.js";

export function storeuser(req, res) {
  const newUser = createUsers(req.body);
  console.log(newUser);

  res.status(201).json(newUser);
}

export function showUsers(req, res) {
  const data = getUsers();

  res.render("usersTable", { data });
}

export function connectUser(req, res) {
  const data = getUsers();
  const email = req.body.email;
  const senha = req.body.password;
  console.log("senha:", senha);

  const usuario = data.find((user) => user.email === email);

  if (!usuario) {
    return res.json({
      error: true,
      userEmail: email,
    });
  }

  console.log("usuario achado:", usuario);

  if (senha === usuario.password) {
    console.log("caiu no if");
    return res.json({ usuario: usuario, userName: usuario.userName });
  }

  console.log("erro");
}

export function showDashboard(req, res) {
  const userId = req.query.id;
  const userName = req.query.user;
  console.log(userId);

  res.render("dashboard", { userId, userName });
}
