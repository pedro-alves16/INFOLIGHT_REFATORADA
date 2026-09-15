import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import {
  renderCreatePage,
  renderLoginPage,
} from "../controllers/logincontroller.js";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const viewRouter = express.Router();

const htmlPath = path.resolve(_dirname, "../../../frontend/html");

//renderizando index (homepage)
viewRouter.get("/", (req, res) => {
  res.sendFile(path.join(htmlPath, "index.html"));
});

//render login
viewRouter.get("/users/login", (req, res) => {
  res.sendFile(path.join(htmlPath, "login.html"));
});

//render cadastro
viewRouter.get("/users/cadastro", (req, res) => {
  res.sendFile(path.join(htmlPath, "cadastro.html"));
});

viewRouter.get("/users/dashboard", (req, res) => {
  res.sendFile(path.join(htmlPath, "dashboard.html"));
});
viewRouter.get("/users/perfil", (req, res) => {
  const currentUser = req.session.user || { nome: "Visitante" };
  res.render("update_profile", { user: currentUser });
});

export default viewRouter;
