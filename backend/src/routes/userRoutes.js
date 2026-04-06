import express from 'express';
import { showUsers, storeuser, connectUser, showDashboard} from '../controllers/userController.js'


const userRouter = express.Router();

userRouter.get('/users/adminPanel', showUsers);

userRouter.post('/users/create', storeuser)

userRouter.post('/users/login', connectUser)

userRouter.get('/users/dashboard', showDashboard);

userRouter.get('/unidadesConsumo', (req, res) => {
    const userName = req.query.user;
    res.render('unidades de consumo', { userName });
})

export default userRouter