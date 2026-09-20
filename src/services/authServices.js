import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const validarCredenciales = async (email, password) => {
  // 1. Repositorio: Consulta directa a PostgreSQL para buscar al usuario por su email
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    return { exito: false, mensaje: 'Usuario no encontrado' };
  }

  const usuario = result.rows[0];

  // 2. Lógica de negocio: Comparación segura de la contraseña plana contra el hash cifrado
  const passwordValido = await bcrypt.compare(password, usuario.password);

  if (!passwordValido) {
    return { exito: false, mensaje: 'Contraseña incorrecta' };
  }

  // 3. Generación del Token JWT firmado con la clave secreta del .env
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
    process.env.JWT_SECRET || 'secreto_citas_medicas_123',
    { expiresIn: '1h' }
  );

  return {
    exito: true,
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
  };
};

export { validarCredenciales };