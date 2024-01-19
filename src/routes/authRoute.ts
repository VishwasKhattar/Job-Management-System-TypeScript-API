//Route handling the authentication pages

import express from 'express';
import { login, register } from '../controller/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;