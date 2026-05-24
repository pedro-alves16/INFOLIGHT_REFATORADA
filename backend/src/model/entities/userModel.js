import { EntitySchema } from "typeorm";

export class User {
  constructor(usuario) {
    if (usuario) {
      this.username = usuario.username;
      this.email = usuario.email;
      this.password = usuario.password;
    }
  }
}

export default new EntitySchema({
  name: "User",
  target: User,
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    username: {
      type: "varchar",
    },

    email: {
      type: "varchar",
    },

    password: {
      type: "varchar",
    },
  },
});

export const userTest = {
  username: "pedro",
  email: "pedro@gmail.com",
  password: "12345",
};
