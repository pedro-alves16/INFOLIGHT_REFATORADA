import express from 'express';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { renderCreatePage, renderLoginPage } from '../controllers/logincontroller.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const router = express.Router();

router.get('/cadastro', renderCreatePage);

router.get('/', (req, res) => {
    res.sendFile(path.resolve(_dirname, '../../../frontend/html/index.html'));
})

router.get('/users/login', renderLoginPage);

export default router