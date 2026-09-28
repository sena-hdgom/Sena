# modulo de autenticación: Proyecto de modulo citas medicas

## 📝 En el presente se describe la función de cada archivo perteneciento al codigo del proyecto. 
# .env
Guarda las variables de entorno de tu proyecto. Son los datos confidenciales y de configuración del servidor. Sirve para proteger tus credenciales. Nunca se debe escribir la contraseña de la base de datos ni las claves de seguridad directamente dentro del código JavaScript. Al ponerlas en el .env, el código las lee de forma segura en memoria sin exponerlas en GitHub ni al público.

# PORT=3000: 
El número de puerta o canal digital donde va a atender tu servidor backend.

# DB_*: 
Las coordenadas completas para que Node.js encuentre tu base de datos en DBeaver (usuario, clave, servidor, puerto y nombre de la BD).

# JWT_SECRET: 
La "clave maestra" que usará la librería jsonwebtoken para firmar y validar los tokens de seguridad de los usuarios.
-----------------------------------------------------------------
## Conexión a PostgreSQL (src/config/db.js)
Abre el canal de comunicación inicial entre tu servidor de Node.js y la base de datos PostgreSQL que administras en DBeaver.

# import dotenv from 'dotenv': 
Carga las variables que acabas de escribir en el .env para que estén disponibles en la memoria (process.env).

# new Pool(...): 
Crea un "grupo o piscina de conexiones". En lugar de abrir y cerrar la conexión con la BD en cada petición (lo cual vuelve lento el servidor), el Pool mantiene conexiones listas para reutilizarse inmediatamente cuando un usuario consulte o guarde una cita médica.

# export default pool: 
Exporta esta piscina de conexiones para utilizarla en la capa de servicios.
-----------------------------------------------------------------------
## Lógica de Autenticación (src/services/authServices.js)
Contiene la lógica de negocio y las reglas del proceso de autenticación. Es el encargo de verificar si quien intenta ingresar es un usuario real registrado en PostgreSQL. Aislar las decisiones complejas (como cifrar, verificar credenciales y firmar tokens) fuera de las rutas y del controlador.

# pool.query(...): 
Envía la sentencia SQL a PostgreSQL sustituyendo $1 por el email de manera segura para prevenir inyecciones SQL.

# bcrypt.compare(...): 
Toma la contraseña enviada desde el cliente (ejemplo: "123456") y comprueba matemáticamente si coincide con la contraseña encriptada guardada en la BD.

# jwt.sign(...): 
Si todo es correcto, emite un "carné digital" cifrado (Token JWT) que vence en 1 hora, codificando la ID y el nombre del usuario.
-----------------------------------------------------------------------
##  Controlador de Autenticación authController.js
Es el orquestador HTTP. Recibe la petición realizada desde el cliente (Postman), extrae los datos enviados (email y password) y determina qué respuesta devolver según el resultado del servicio. Aísla la gestión de protocolos y códigos de respuesta HTTP de la lógica interna de base de datos.

# req.body: 
Extrae la información enviada en el cuerpo de la petición HTTP en formato JSON.

# res.status(400): 
Si faltan campos obligatorios, corta la ejecución devolviendo un código 400 Bad Request.

# res.status(401): 
Si la contraseña o correo son incorrectos, devuelve un código 401 Unauthorized.

# res.status(200):
Si las credenciales son válidas, entrega el Token JWT al cliente con código 200 OK.
-----------------------------------------------------------------------
## Middleware de Autenticación - authMiddleware.js
Es el guardia de seguridad del backend. Se coloca justo antes de las rutas privadas para inspeccionar cada petición entrante. mpide que usuarios no autenticados (o personas malintencionadas) consulten, agenden o modifiquen información médica sensible sin un token válido.

# req.headers['authorization']: 
Lee la cabecera HTTP de autorización donde el cliente (Postman o la web) envía el token.

# authHeader.split(' ')[1]: 
Separa la palabra Bearer del código del token para extraer solo la clave cifrada.

# jwt.verify(...): 
Comprueba matemáticamente si el token fue firmado con la misma JWT_SECRET de nuestro .env. Si no coincide o ya venció, retorna un código HTTP 403 Forbidden.

# next(): 
Si el token es legítimo, llama a la función next() para dar el "luz verde" y permitir que la petición continúe hacia la ruta de citas médicas.
-----------------------------------------------------------------------
## Rutas del Sistema 
# authRoutes.js
expone el inicio de sesión (/api/auth/login) y citaRoutes.js expone el módulo de citas (/api/citas).
# citaRoutes.js 
router.get('/', verificarToken, (req, res) => ...)
Express ejecuta las funciones en orden de izquierda a derecha. Primero entra verificarToken (el middleware). Si el token no existe o es falso, la petición se detiene ahí. Si el token es válido, se llama a next() y recién entra a la función (req, res) que responde con los datos de la cita médica.

-----------------------------------------------------------------------
## Ensamblar la Aplicación en Express y Encender el Servidor
# express.json(): 
Convierte automáticamente los datos del cuerpo de las peticiones HTTP que vienen en formato JSON para que Node los entienda.

# app.use('/api/auth', authRoutes): 
Define el prefijo /api/auth para todas las rutas de autenticación (/api/auth/login).

# app.use('/api/citas', citaRoutes):
Define el prefijo /api/citas para el módulo de citas.
------------------
## Punto de Entrada para la Ejecución index.js
# app.listen(PORT, ...): 
Enciende el servidor y se pone a "escuchar" todas las peticiones que lleguen por el puerto 3000.
-----------------------------------------------------------------
## citaModels.js
Creamos la clase Cita utilizando ES6 Modules (export class Cita) 
# propósito: 
Definimos la estructura única y estandarizada de un objeto Cita.   
# Detalle técnico: 
En el constructor aplicamos desestructuración (constructor({ id, paciente, ... })) y fijamos un valor por defecto para el estado (estado = 'PROGRAMADA'). Esto garantiza que, aunque el usuario no seleccione un estado en la pantalla, la cita nacerá automáticamente como programada.

# Enlazado de Módulos en citas.htmlLo que hicimos: Le agregamos el atributo type="module" a la etiqueta <script src="app.js">.  
# El propósito: 
Los navegadores modernos bloquean la palabra reservada import/export por seguridad a menos que les especifiques de forma explícita que el script debe ejecutarse como un módulo de JavaScript.  
# 3. Integración y Programación Orientada a Objetos en app.jsLo que hicimos: Importamos la clase (import { Cita } from './models/citaModel.js') e instanciamos el objeto con la palabra clave new Cita(...) dentro del listener del formulario.   
# El propósito: 
Cuando el usuario hace clic en el botón de agendar, el navegador no envía un JSON cualquiera; toma los valores de los inputs, los valida e instancia una Cita oficial.   
# Manejo del ciclo de vida: 
Al enviar JSON.stringify(nuevaCita), Express recibe un cuerpo con la misma estructura requerida por PostgreSQL y nos devuelve la respuesta para actualizar la tabla dinámicamente con cargarCitas().   
---------------------------------------------------------------------


## Pruebas
# iniciar el servidor con pnpm start
ingresar usuario (paciente@sena.edu.co) y contraseña(123456)
---------------------------------------------------------------------
## Integración del Chatbot en citas.html
--------------------------------------------------------------
## fallos de autenticación 401 Unauthorized, respuestas de éxito con JWT (200 OK) y el control de excepciones imprevistas (500 Internal Server Error)

# A. Importación de Servicios: 
Trae (importa) las funciones SQL que creamos en la capa de servicio (citaServices.js). y el controlador no tenga que escribir SQL directo (SELECT, INSERT), sino simplemente llamar a estas funciones.

    import { 
        obtenerTodasLasCitas, 
        crearNuevaCita, 
        eliminarCitaPorId 
    } from '../services/citaServices.js';

# B. Obtener la lista de citas (getCitas):
# req (Request / Petición): 
Trae la información que envía el cliente desde la web.
# res (Response / Respuesta):
Es el objeto que usamos para enviarle la respuesta al navegador.
# await obtenerTodasLasCitas():
Le dice a la base de datos PostgreSQL: "Tráeme todas las citas registradas".
# res.status(200).json(citas): 
Devuelve el código de estado HTTP 200 OK (Petición exitosa estándar) junto con la lista de citas en formato JSON.   
# try / catch: 
Si la base de datos se cae o ocurre un fallo imprevisto, salta al catch y envía un código 500 Internal Server Error

    export const getCitas = async (req, res) => {
    try {
        const citas = await obtenerTodasLasCitas();
        return res.status(200).json(citas);
    } catch (error) {
        return res.status(500).json({ 
        mensaje: 'Error interno al obtener las citas', 
        error: error.message 
        });
    }
    };

# C. Función 2: Agendar una nueva cita (createCita) 
# req.body: 
Extrae los datos que el usuario escribió en el formulario HTML (paciente, medico, fechaHora, motivo).
# if (!paciente || !medico || !fechaHora): 
Valida que los campos requeridos no vengan vacíos. Si el usuario intenta enviar el formulario sin llenar el paciente, detiene la ejecución inmediatamente y responde con un código 400 Bad Request (Error de validación del cliente).   
# res.status(201):
Si la inserción en PostgreSQL fue exitosa, responde con el código 201 Created (Nuevo recurso creado)

    export const createCita = async (req, res) => {
    const { paciente, medico, fechaHora, motivo } = req.body;

    // 1. Validación de cliente
    if (!paciente || !medico || !fechaHora) {
        return res.status(400).json({ 
        mensaje: 'Los campos paciente, médico y fecha/hora son obligatorios' 
        });
    }

    try {
        // 2. Inserción en BD
        const nuevaCita = await crearNuevaCita({ paciente, medico, fechaHora, motivo });
        
        // 3. Respuesta de éxito
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

# D. Función 3: Cancelar / Eliminar una cita (deleteCita)

export const deleteCita = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await eliminarCitaPorId(id);

    if (!resultado) {
      return res.status(404).json({ 
        mensaje: `No se encontró la cita médica con el ID ${id}` 
      });
    }

    return res.status(200).json({ 
      mensaje: 'Cita médica cancelada/eliminada exitosamente' 
    });
  } catch (error) {
    return res.status(500).json({ 
      mensaje: 'Error interno al eliminar la cita', 
      error: error.message 
    });
  }
};

# req.params.id: 
Captura el ID enviado a través de la URL de la petición (por ejemplo, en DELETE /api/citas/5, el ID es 5).
# if (!resultado): 
Si el ID enviado no existe en la base de datos PostgreSQL, responde con un código 404 Not Found (El recurso solicitado no existe). 
# res.status(200): 
Si la cita existía y se borró de la tabla, confirma el éxito con 200 OK.   