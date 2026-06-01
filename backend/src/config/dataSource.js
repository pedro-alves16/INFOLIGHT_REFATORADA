import typeorm from "typeorm";
import { userSchema } from "../model/entities/userModel.js";

const dataSource = new typeorm.DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "pedroDev1616",
  database: "usuarios_DB",
  synchronize: true,
  entities: [userSchema],
});

export { dataSource };
