// Middleware de Autenticación - authMiddleware.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    // Verificar la firma del token con la clave secreta
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_citas_medicas_123');
    req.usuario = decodificado; // Adjunta la información del usuario a la petición
    next(); // Permite el paso al controlador de la ruta protegida
  } catch (error) {
    return res.status(403).json({ mensaje: 'Acceso denegado: Token inválido o expirado' });
  }
};