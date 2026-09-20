//Lógica de agendamiento, lista y notificaciones
import { Cita } from './models/citaModel.js';
const formCita = document.getElementById('formCita');
const citasBody = document.getElementById('citasBody');

// Obtener citas desde la BD
async function cargarCitas() {
    try {
        const response = await fetch('http://localhost:3000/api/citas');
        const citas = await response.json();
        renderCitas(citas);
    } catch (error) {
        console.error('Error cargando citas:', error);
    }
}

function renderCitas(citas) {
    citasBody.innerHTML = '';

    if (!citas || citas.length === 0) {
        citasBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay citas en PostgreSQL.</td></tr>`;
        return;
    }

    citas.forEach(cita => {
        const tr = document.createElement('tr');
        const esProgramada = cita.estado === 'PROGRAMADA';

        tr.innerHTML = `
            <td>#${cita.id}</td>
            <td><strong>${cita.paciente}</strong></td>
            <td>${cita.medico}</td>
            <td>${new Date(cita.fechaHora).toLocaleString('es-CO')}</td>
            <td>
                <span class="badge ${esProgramada ? 'badge-programada' : 'badge-cancelada'}">
                    ${cita.estado}
                </span>
            </td>
            <td>
                ${esProgramada 
                    ? `<button class="btn-cancel" onclick="cancelarCita(${cita.id})">Cancelar</button>` 
                    : '<span style="color:#94a3b8;">N/A</span>'}
            </td>
        `;
        citasBody.appendChild(tr);
    });
}

// Guardar en la BD - CÓDIGO CON EL MODELO INTEGRAD0
formCita.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Instanciamos el modelo de la Cita antes de enviarlo
    const nuevaCita = new Cita({
        paciente: document.getElementById('paciente').value,
        medico: document.getElementById('medico').value,
        fechaHora: document.getElementById('fechaHora').value,
        motivo: document.getElementById('motivo').value
    });

    const response = await fetch('http://localhost:3000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCita)
    });

    const data = await response.json();

    if (data.success) {
        alert(`✅ Cita #${data.id} guardada en PostgreSQL.`);
        formCita.reset();
        cargarCitas();
    }
});

// Cancelar en la BD
async function cancelarCita(id) {
    if (confirm(`¿Cancelar la cita #${id} en PostgreSQL?`)) {
        await fetch(`http://localhost:3000/api/citas/${id}/cancelar`, { method: 'PUT' });
        cargarCitas();
    }
}

// Carga inicial
cargarCitas();