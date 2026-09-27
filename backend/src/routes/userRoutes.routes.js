import express from "express";
import { connectUser, createUser, deleteUser, updateUserData, updateUserPassword } from "../controller/userController.js";
import { dataSource } from "../config/dataSource.js";
import { userTest, User, userSchema } from "../model/entities/userModel.js";
import { billSchema } from "../model/entities/billModel.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

function getAuthenticatedUserId(req, res) {
    if (!req.session.user?.id) {
        res.status(401).json({ error: "Faça login para acessar suas contas." });
        return null;
    }

    return req.session.user.id;
}

//rota para criar usuario
userRouter.post("/users/create", createUser);

//rota para fazer o login conectando o usuario
userRouter.post("/users/login", connectUser);

userRouter.put("/users/update", updateUserData);

userRouter.put("/users/password", updateUserPassword);

userRouter.delete("/users/delete", deleteUser);


userRouter.get("/contas", async (req, res) => {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const billRepository = dataSource.getRepository(billSchema);
    const contas = await billRepository.find({
        where: { userId },
        order: { mes: "DESC" },
    });

    res.json(contas);
});

userRouter.post("/contas", async (req, res) => {
    const userId = getAuthenticatedUserId(req, res);
    if (!userId) return;

    const { mes, valor, bandeira } = req.body;
    const valorNumerico = Number(valor);
    const bandeirasPermitidas = ["verde", "amarela", "vermelha"];

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes) || !Number.isFinite(valorNumerico) || valorNumerico <= 0 || !bandeirasPermitidas.includes(bandeira)) {
        return res.status(400).json({ error: "Dados da conta inválidos." });
    }

    // ALTERAÇÃO: a conta agora é criada diretamente com todos os dados recebidos.
    // ALTERAÇÃO: deixou de existir a busca e atualização de uma conta do mesmo mês.
    // Armazena as informações da conta de luz no banco de dados.
    const billRepository = dataSource.getRepository(billSchema);
    const conta = billRepository.create({
        userId,
        mes,
        valor: valorNumerico,
        bandeira,
    });

    const contaSalva = await billRepository.save(conta);
    // ALTERAÇÃO: novas contas sempre retornam HTTP 201 (Created).
    res.status(201).json(contaSalva);
    // Fim da seção de armazenamento da conta de luz.
});

export default userRouter;
