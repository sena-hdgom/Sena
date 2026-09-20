// Rutas de Citas Médicas
import express from 'express';
// Si tienes un controlador separado, impórtalo aquí. 
// Si manejas la lógica dentro de la ruta, aquí están definidas las peticiones:

const router = express.Router();

// 1. GET /api/citas -> Obtener todas las citas
router.get('/', async (req, res) => {
  try {
    // Si usas PostgreSQL vía controller o query directo:
    // Sustituye esta parte con la llamada a tu BD o controlador si ya existe
    res.status(200).json([
      // Arreglo de citas desde tu BD
    ]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las citas' });
  }
});

// 2. POST /api/citas -> Guardar una nueva cita
router.post('/', async (req, res) => {
  try {
    const { paciente, medico, fechaHora, motivo } = req.body;
    
    // Aquí ejecutas la inserción en PostgreSQL
    // Ejemplo: const result = await pool.query(...)

    res.status(201).json({ 
      success: true, 
      id: Date.now(), // O el ID retornado por PostgreSQL
      mensaje: 'Cita guardada exitosamente' 
    });
  } catch (error) {
    console.error('Error en POST /api/citas:', error);
    res.status(500).json({ success: false, mensaje: 'Error interno del servidor' });
  }
});

// 3. PUT /api/citas/:id/cancelar -> Cancelar una cita
router.put('/:id/cancelar', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Aquí ejecutas el UPDATE en PostgreSQL para cambiar el estado a 'CANCELADA'

    res.status(200).json({ success: true, mensaje: `Cita #${id} cancelada` });
  } catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error al cancelar la cita' });
  }
});

export default router;