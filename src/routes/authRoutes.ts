import express from 'express';
import authController from '../controller/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public
router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));

// Protected
router.get('/me', auth, (req, res) => authController.me(req, res));
router.put('/me', auth, (req, res) => authController.updateMe(req, res));

export default router;
