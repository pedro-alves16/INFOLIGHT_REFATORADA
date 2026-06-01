import express from "express";
import router from "./backend/src/routes/router.js";
import userRouter from "./backend/src/routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dataSource } from "./backend/src/config/dataSource.js";
import {
  userTest,
  User,
  userSchema,
} from "./backend/src/model/entities/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userRepository = dataSource.getRepository(userSchema);

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

//rota para criar usuario
app.post("/users/create", async (req, res) => {
  const user = await userRepository.create(req.body);
  const result = await userRepository.save(user);
  return res.send(result);
});

app.listen(3000, () => {
  console.log("aplicação rodando");
  console.log("http://localhost:3000");
});
