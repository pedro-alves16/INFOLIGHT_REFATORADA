import { getUsers, createUsers } from "../model/userModel.js";

export function storeuser(req, res) {
    const newUser = createUsers(req.body);

    res.status(201).json(newUser);
}

export function showUsers(req, res) {
    const data = getUsers();

    res.render('usersTable', { data });
}

export function connectUser(req, res) {
    const data = getUsers();
    const email = req.body.email;
    const senha = req.body.password;
    console.log('senha:', senha)

    const usuario = data.find(user => user.email === email);
    console.log('usuario achado:', usuario)

    const userName = usuario.userName;

    if (senha === usuario.password) {
        console.log('caiu no if');
        res.json({ userName: usuario.userName });
        return;
    }

    console.log('erro');
}

export function showDashboard(req, res) {
    const userName = req.query.user;

    res.render('dashboard', { userName });
}