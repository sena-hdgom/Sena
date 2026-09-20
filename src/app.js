import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import citasRoutes from './routes/citaRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, '../public');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Archivos estáticos
app.use(express.static(publicPath));

// 2. Rutas explícitas para HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/citas', (req, res) => {
  res.sendFile(path.join(publicPath, 'citas.html'));
});

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/citas', citasRoutes);

export default app;