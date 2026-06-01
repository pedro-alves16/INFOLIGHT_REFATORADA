import { EntitySchema } from "typeorm";

export class User {
  constructor(usuario) {
    if (usuario) {
      this.userName = usuario.userName;
      this.email = usuario.email;
      this.password = usuario.password;
    }
  }
}

export const userSchema = new EntitySchema({
  name: "User",
  target: User,
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    userName: {
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
