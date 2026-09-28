// Controlador de Gestión de Citas Médicas - citaController.js
import { 
  obtenerTodasLasCitas, 
  crearNuevaCita, 
  cambiarEstadoCita, 
  eliminarCitaPorId 
} from '../services/citaServices.js';

// 1. Obtener listado de citas (GET)
export const getCitas = async (req, res) => {
  try {
    const citas = await obtenerTodasLasCitas();
    // 200 OK: Petición exitosa estándar (GET)
    return res.status(200).json(citas);
  } catch (error) {
    // 500 Internal Server Error: Fallo interno no controlado
    return res.status(500).json({ 
      mensaje: 'Error interno al obtener las citas', 
      error: error.message 
    });
  }
};

// 2. Crear una nueva cita médica (POST)
export const createCita = async (req, res) => {
  const { paciente, medico, fechaHora, motivo } = req.body;

  // Validación de campos obligatorios en el cliente
  if (!paciente || !medico || !fechaHora) {
    // 400 Bad Request: Error de validación en el cliente
    return res.status(400).json({ 
      mensaje: 'Los campos paciente, médico y fecha/hora son obligatorios' 
    });
  }

  try {
    const nuevaCita = await crearNuevaCita({ paciente, medico, fechaHora, motivo });
    // 201 Created: Nuevo recurso creado exitosamente (POST)
    return res.status(201).json({
      mensaje: 'Cita programada con éxito',
      cita: nuevaCita
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error interno al agendar la cita', 
      error: error.message 
    });
  }
};

// 3. Cancelar estado de una cita a 'CANCELADA' (PUT)
export const cancelarCita = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await cambiarEstadoCita(id, 'CANCELADA');

    if (!resultado) {
      // 404 Not Found: El recurso solicitado no existe
      return res.status(404).json({ 
        mensaje: `No se encontró la cita médica con el ID ${id}` 
      });
    }

    // 200 OK: Actualización exitosa
    return res.status(200).json({ 
      mensaje: `Cita #${id} cancelada exitosamente`,
      cita: resultado
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error al cancelar la cita', 
      error: error.message 
    });
  }
};

// 4. Eliminar físicamente una cita de la BD (DELETE)
export const deleteCita = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await eliminarCitaPorId(id);

    if (!resultado) {
      // 404 Not Found: El recurso solicitado no existe
      return res.status(404).json({ 
        mensaje: `No se encontró la cita médica con el ID ${id}` 
      });
    }

    // 200 OK: Procesado con éxito
    return res.status(200).json({ 
      mensaje: 'Cita médica eliminada exitosamente' 
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error interno al eliminar la cita', 
      error: error.message 
    });
  }
};