//Controlador de Autenticación - authController.js
import { validarCredenciales } from '../services/authServices.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validación de campos de entrada requeridos
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'El email y la contraseña son obligatorios' });
  }

  try {
    // 2. Llamada a la capa de servicio para validar credenciales y generar el token
    const resultado = await validarCredenciales(email, password);

    if (!resultado.exito) {
      return res.status(401).json({ mensaje: resultado.mensaje });
    }

    // 3. Respuesta HTTP exitosa con el token JWT devuelto
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token: resultado.token,
      usuario: resultado.usuario
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};