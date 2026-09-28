// Rutas de Citas Médicas - citaRoutes.js
import express from 'express';
import { 
  getCitas, 
  createCita, 
  cancelarCita, 
  deleteCita 
} from '../controllers/citaController.js';

const router = express.Router();

// 1. GET /api/citas -> Obtener todas las citas (200 OK)
router.get('/', getCitas);

// 2. POST /api/citas -> Crear/Programar una nueva cita (201 Created / 400 Bad Request)
router.post('/', createCita);

// 3. PUT /api/citas/:id/cancelar -> Cancelar el estado de una cita (200 OK / 404 Not Found)
router.put('/:id/cancelar', cancelarCita);

// 4. DELETE /api/citas/:id -> Eliminar una cita por su ID (200 OK / 404 Not Found)
router.delete('/:id', deleteCita);

export default router;