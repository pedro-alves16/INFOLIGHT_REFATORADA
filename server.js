import express from "express";
import router from "./backend/src/routes/router.js";
import userRouter from "./backend/src/routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dataSource } from "./backend/src/config/dataSource.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "frontend")));
app.set("views", "./backend/src/views");
app.set("view engine", "ejs");

app.use(router);
app.use(userRouter);

try {
  await dataSource.initialize();
} catch (error) {
  console.log(error);
}

app.listen(3000, () => {
  console.log("aplicação rodando");
  console.log("http://localhost:3000");
});
