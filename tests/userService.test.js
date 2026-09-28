import { assert, describe, it } from "poku";
import { createUser, deleteUser, updateUser } from "../backend/src/model/userService.js";

function createRepository(existingUser = null) {
  const calls = { findOneBy: [], create: [], save: [], merge: [], delete: [] };

  return {
    calls,
    async findOneBy(criteria) {
      calls.findOneBy.push(criteria);
      return existingUser;
    },
    create(userData) {
      calls.create.push(userData);
      return { ...userData };
    },
    async save(user) {
      calls.save.push(user);
      return user;
    },
    merge(user, updates) {
      calls.merge.push(updates);
      Object.assign(user, updates);
      return user;
    },
    async delete(userId) {
      calls.delete.push(userId);
    },
  };
}

describe("operações de conta de usuário", () => {
  it("cria uma conta quando o e-mail ainda não está cadastrado", async () => {
    const repository = createRepository();
    const newUser = {
      userName: "Ana",
      email: "ana@example.com",
      password: "secret",
    };

    const result = await createUser(repository, newUser);

    assert.deepStrictEqual(result, newUser);
    assert.deepStrictEqual(repository.calls.create, [newUser]);
    assert.deepStrictEqual(repository.calls.save, [newUser]);
  });

  it("não cria uma conta com e-mail já cadastrado", async () => {
    const existingUser = { id: 1, email: "ana@example.com" };
    const repository = createRepository(existingUser);

    const result = await createUser(repository, {
      userName: "Outra Ana",
      email: "ana@example.com",
      password: "secret",
    });

    assert.deepStrictEqual(result, {
      error: "usuário já cadastrado, faça Login!",
    });
    assert.strictEqual(repository.calls.create.length, 0);
    assert.strictEqual(repository.calls.save.length, 0);
  });

  it("atualiza o nome e o e-mail da conta", async () => {
    const existingUser = {
      id: 7,
      userName: "Ana",
      email: "ana@example.com",
      password: "secret",
    };
    const repository = createRepository(existingUser);

    const result = await updateUser(repository, 7, {
      userName: "Ana Silva",
      email: "ana.silva@example.com",
    });

    assert.deepStrictEqual(result, { message: "usuario atualizado!" });
    assert.strictEqual(existingUser.userName, "Ana Silva");
    assert.strictEqual(existingUser.email, "ana.silva@example.com");
    assert.strictEqual(existingUser.password, "secret");
    assert.deepStrictEqual(repository.calls.save, [existingUser]);
  });

  it("retorna erro ao atualizar uma conta inexistente", async () => {
    const repository = createRepository();

    const result = await updateUser(repository, 404, {
      userName: "Ana",
      email: "ana@example.com",
    });

    assert.deepStrictEqual(result, { error: "usuário não encontrado!" });
    assert.strictEqual(repository.calls.save.length, 0);
  });

  it("deleta a conta quando a senha informada está correta", async () => {
    const existingUser = { id: 9, password: "secret" };
    const repository = createRepository(existingUser);

    const result = await deleteUser(repository, 9, "secret");

    assert.deepStrictEqual(result, { message: "usuario deletado!" });
    assert.deepStrictEqual(repository.calls.delete, [9]);
  });

  it("não deleta a conta quando a senha está incorreta", async () => {
    const existingUser = { id: 9, password: "secret" };
    const repository = createRepository(existingUser);

    const result = await deleteUser(repository, 9, "wrong-password");

    assert.deepStrictEqual(result, {
      error: "senha incorreta, tente novamente!",
    });
    assert.strictEqual(repository.calls.delete.length, 0);
  });

  it("retorna erro ao deletar uma conta inexistente", async () => {
    const repository = createRepository();

    const result = await deleteUser(repository, 404, "secret");

    assert.deepStrictEqual(result, { error: "usuário não encontrado!" });
    assert.strictEqual(repository.calls.delete.length, 0);
  });
});