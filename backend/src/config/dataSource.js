import typeorm from "typeorm";
import userEntity from "../model/entities/userModel.js";

const dataSource = new typeorm.DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "PedroDev1616",
  database: "infolight_database",
  synchronize: true,
  entities: [userEntity],
});

export { dataSource };
