import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { registerUser ,login} from '../controllers/authController.js';

const router=express.Router();

router.post('/register',registerUser);

router.post('/login',login);

export default router;