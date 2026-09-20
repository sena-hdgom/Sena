/**
 * Modelo de Cita Médica (Frontend)
 * Aca definimos la estructura de datos que viaja hacia el servidor Express / PostgreSQL
 */
export class Cita {
  constructor({ id = null, paciente, medico, fechaHora, motivo, estado = 'PROGRAMADA' }) {
    this.id = id;
    this.paciente = paciente;
    this.medico = medico;
    this.fechaHora = fechaHora;
    this.motivo = motivo;
    this.estado = estado;
  }
}