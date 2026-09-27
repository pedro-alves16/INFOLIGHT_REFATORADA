import { dataSource } from "../config/dataSource.js";
import { userSchema } from "../model/entities/userModel.js";
import jwt from "jsonwebtoken";


export async function createUser(req, res) {
    const userRepository = dataSource.getRepository(userSchema);

    const hasUser = await userRepository.findOneBy({ email: req.body.email });

    if (hasUser) {
        res.status(401).json({ error: "usuário já cadastrado, faça Login!" });
        return;
    }

    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);
    return res.status(200);
}

export async function connectUser(req, res) {
    const userRepository = dataSource.getRepository(userSchema);

    const userCredentials = req.body;

    const userFromDatabase = await userRepository.findOneBy({
        email: userCredentials.email,
    });

    if (!userFromDatabase) {
        return res.json({ error: "usuário não cadastrado, crie sua conta!" });
    }

    if (userCredentials.password === userFromDatabase.password) {
        const jwtRes = jwt.sign({ userId: userFromDatabase.id, userName: userFromDatabase.userName },
            'secret-infolight-jwt-16',
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            jwt: jwtRes,
            canLoggin: true,
        });
    }

    return res.json({
        error: "Senha incorreta",
    });
}

export async function updateUserData(req, res) {
    const usuarioAtualizado = {
        userName: req.body.userName,
        email: req.body.email,
    };
    const userRepository = dataSource.getRepository(userSchema);

    const user = await userRepository.findOneBy({ id: res.locals.user.id });

    userRepository.merge(user, usuarioAtualizado);

    await userRepository.save(user);
    res.json({ message: "usuario atualizado!" });
}

export async function updateUserPassword(req, res) {
    const userRepository = dataSource.getRepository(userSchema);

    const senhas = {
        senhaAntiga: req.body.senhaAntiga,
        senhaNova: req.body.senhaNova,
    };

    const user = await userRepository.findOneBy({ id: res.locals.user.id });
    if (user.password === senhas.senhaAntiga) {
        userRepository.merge(user, { password: senhas.senhaNova });
        await userRepository.save(user);
        res.json({
            message: "senha alterada com sucesso!",
        });
    } else {
        res.json({
            error: "senha não alterada, algo deu errado!",
        });
        return;
    }
}

export async function deleteUser(req, res) {
    const userRepository = dataSource.getRepository(userSchema);

    const userPass = req.body.senha;

    const user = await userRepository.findOneBy({ id: res.locals.user.id });

    if (!user) {
        return res.json({ error: "usuário não encontrado!" });
    }

    if (user.password === userPass) {
        await userRepository.delete(user.id);
        return res.json({ message: "usuario deletado!" });
    }

    return res.json({ error: "senha incorreta, tente novamente!" });
}
