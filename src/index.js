// Punto de Entrada para la Ejecución
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Servidor de Citas Médicas corriendo exitosamente`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`==================================================`);
});