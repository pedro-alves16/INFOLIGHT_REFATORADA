import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
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

viewRouter.get("/unidadesConsumo", (req, res) => {
  res.sendFile(path.join(htmlPath, "unidades de consumo.html"));
});

viewRouter.get("/users/perfil", (req, res) => {
  res.sendFile(path.join(htmlPath, "update_profile.html"));
});

export default viewRouter;
