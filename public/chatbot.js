// Lógica del Chatbot Integrado para CitGo

function toggleCitgoChat() {
  const box = document.getElementById("chatbot-box");
  box.style.display = (box.style.display === "none" || box.style.display === "") ? "flex" : "none";
}

function addCitgoMsg(text, sender) {
  const msgs = document.getElementById("citgoMessages");
  const div = document.createElement("div");
  div.classList.add("chat-message", sender);
  div.innerHTML = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function getCitgoResponse(input) {
  const q = input.toLowerCase();
  if (q.includes("hola") || q.includes("buenas")) return "¡Hola! Bienvenido al módulo de agendamiento de **CitGo**. ¿Quieres consultar información o agendar una cita?";
  if (q.includes("agendar") || q.includes("crear")) return "Para agendar, diligencia el formulario a la izquierda con el paciente, médico y fecha, luego presiona **Agendar Cita**.";
  if (q.includes("medico") || q.includes("especialidad") || q.includes("doctor")) return "Contamos con Medicina General (Dra. María Gómez), Cardiología (Dr. Carlos Ruiz) y Pediatría (Dra. Laura Cano).";
  if (q.includes("horario") || q.includes("atencion")) return "El sistema de agendamiento en línea opera **24/7**. La atención presencial es de Lunes a Viernes de 7:00 AM a 6:00 PM.";
  if (q.includes("cancelar") || q.includes("eliminar")) return "Puedes cancelar o editar el estado de una cita directamente en la tabla de **Citas Programadas** usando las acciones.";
  if (q.includes("gracias") || q.includes("salir")) return "¡Con gusto! Que tengas un excelente día. 🏥✨";
  return "Lo siento, aún no comprendo esa consulta. Prueba preguntando sobre: **agendar**, **médicos** o **horario**.";
}

function sendCitgoMessage() {
  const input = document.getElementById("citgoInput");
  const val = input.value.trim();
  if (!val) return;
  addCitgoMsg(val, "user");
  input.value = "";
  setTimeout(() => addCitgoMsg(getCitgoResponse(val), "bot"), 400);
}

// Evento global para permitir enviar con la tecla Enter
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById("citgoInput");
  if (input) {
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") sendCitgoMessage();
    });
  }
});