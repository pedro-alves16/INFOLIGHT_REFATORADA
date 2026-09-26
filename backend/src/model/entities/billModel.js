import { EntitySchema } from "typeorm";

export class Bill {
  constructor(conta) {
    if (conta) {
      this.userId = conta.userId;
      this.mes = conta.mes;
      this.valor = conta.valor;
      this.bandeira = conta.bandeira;
    }
  }
}

export const billSchema = new EntitySchema({
  name: "Bill",
  target: Bill,
  tableName: "contas_usuario",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
    },
    mes: {
      type: "varchar",
    },
    valor: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    bandeira: {
      type: "varchar",
    },
  },
});