import typeorm from "typeorm";
import { userSchema } from "../model/entities/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const dataSource = new typeorm.DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [userSchema],
});

export { dataSource };
