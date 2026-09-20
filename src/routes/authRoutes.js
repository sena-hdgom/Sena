import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Ruta pública para iniciar sesión
router.post('/login', login);

export default router;