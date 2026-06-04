import typeorm from "typeorm";
import { userSchema } from "../model/entities/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const dataSource = new typeorm.DataSource({
  type: "postgres",
  url: process.env.DB_PASSWORD,
  synchronize: true,
  entities: [userSchema],
});

export { dataSource };
