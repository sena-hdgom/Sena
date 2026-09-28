// Capa de Servicio: Operaciones en PostgreSQL para Citas Médicas
import pool from '../config/db.js';

// 1. Obtener todas las citas ordenadas por ID descendente
export const obtenerTodasLasCitas = async () => {
  const query = 'SELECT * FROM citas ORDER BY id DESC';
  const result = await pool.query(query);
  return result.rows;
};

// 2. Crear una nueva cita en la base de datos
export const crearNuevaCita = async (datosCita) => {
  const { paciente, medico, fechaHora } = datosCita;
  
  // Usamos los nombres exactos de columnas de DBeaver:
  // paciente_nombre, fecha, medico, estado
  const query = `
    INSERT INTO citas (paciente_nombre, fecha, medico, estado)
    VALUES ($1, $2, $3, 'PROGRAMADA')
    RETURNING *
  `;
  const values = [paciente, fechaHora, medico];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// 3. Cambiar el estado de una cita (ej. a 'CANCELADA')
export const cambiarEstadoCita = async (id, nuevoEstado) => {
  const query = `
    UPDATE citas 
    SET estado = $1 
    WHERE id = $2 
    RETURNING *
  `;
  const result = await pool.query(query, [nuevoEstado, id]);

  if (result.rowCount === 0) {
    return false;
  }
  return result.rows[0];
};

// 4. Eliminar una cita por su ID
export const eliminarCitaPorId = async (id) => {
  const query = 'DELETE FROM citas WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  
  if (result.rowCount === 0) {
    return false;
  }
  return true;
};