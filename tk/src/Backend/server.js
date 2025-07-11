//server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Agregar JWT para manejo de tokens
const { connectToDatabase } = require('./DB');
const Usuario = require('./models'); // Asegúrate de que este path sea correcto
const SimulacionTrafico = require('./models/SimulacionTrafico'); // Importación correcta
const SimulacionClima = require('./models/SimulacionClima'); // Nueva importación

const app = express();
const PORT = process.env.PORT || 5000;

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Cambia esto al origen de tu aplicación frontend
}));
app.use(bodyParser.json());

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Ruta para crear un nuevo usuario
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, companyName, userPosition } = req.body;

    // Validación básica
    if (!email || !password || !companyName || !userPosition) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Ya existe un usuario con este email' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      email,
      password: hashedPassword,
      companyName,
      userPosition,
      isAdmin: "N"
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para el login (modificada para devolver token)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'El correo y la contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Devolver token y datos básicos del usuario
    res.status(200).json({ 
      message: 'Login exitoso', 
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        companyName: usuario.companyName,
        userPosition: usuario.userPosition,
        isAdmin: usuario.isAdmin
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Nueva ruta para obtener datos del usuario autenticado
app.get('/api/usuario/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.userId).select('-password'); // Excluir contraseña
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Formatear los datos para el frontend
    const perfilUsuario = {
      id: usuario._id,
      nombre: usuario.companyName, // Usar companyName como nombre de display
      email: usuario.email,
      telefono: '+56 9 1234 5678', // Valor por defecto, puedes agregar este campo al schema
      cargo: usuario.userPosition,
      departamento: 'Monitoreo Vial', // Valor por defecto
      ubicacion: 'Santiago, Chile', // Valor por defecto
      fechaIngreso: usuario.createdAt ? usuario.createdAt.toISOString().split('T')[0] : '2023-03-15',
      ultimoAcceso: new Date().toISOString().slice(0, 16).replace('T', ' '),
      avatar: null,
      isAdmin: usuario.isAdmin
    };

    res.status(200).json(perfilUsuario);
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar perfil de usuario
app.put('/api/usuario/perfil', verificarToken, async (req, res) => {
  try {
    const { companyName, userPosition, telefono, ubicacion, departamento } = req.body;

    const usuario = await Usuario.findById(req.userId);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar campos permitidos
    if (companyName) usuario.companyName = companyName;
    if (userPosition) usuario.userPosition = userPosition;
    // Aquí podrías agregar más campos al schema si los necesitas

    await usuario.save();

    res.status(200).json({ 
      message: 'Perfil actualizado exitosamente',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        companyName: usuario.companyName,
        userPosition: usuario.userPosition,
        isAdmin: usuario.isAdmin
      }
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para guardar simulación de tráfico (ahora con verificación de token)
app.post('/api/simulacion-trafico', verificarToken, async (req, res) => {
  try {
    const datosTrafico = req.body;
    
    console.log('Datos recibidos:', datosTrafico);

    // Verifica que datosTrafico sea un array
    if (!Array.isArray(datosTrafico)) {
      return res.status(400).json({ error: 'Se esperaba un array de datos' });
    }

    // Validar que el array no esté vacío
    if (datosTrafico.length === 0) {
      return res.status(400).json({ error: 'El array de datos está vacío' });
    }

    // Validar y formatear estructura de datos antes de guardar
    const datosValidados = datosTrafico.map(dato => {
      // Convertir fecha a formato Date si es necesario
      let fechaFormateada;
      try {
        fechaFormateada = new Date(dato.fecha);
        if (isNaN(fechaFormateada.getTime())) {
          fechaFormateada = new Date(); // Fecha actual si no es válida
        }
      } catch (error) {
        fechaFormateada = new Date(); // Fecha actual si hay error
      }

      return {
        tipoVehiculo: dato.tipoVehiculo || '',
        ejes: dato.ejes === 'N/A' ? null : Number(dato.ejes) || null,
        peaje: dato.peaje || '',
        ubicacionKm: Number(dato.ubicacionKm) || 0,
        hora: dato.hora || '',
        fecha: fechaFormateada.toISOString().split('T')[0], // Formato YYYY-MM-DD
        pesoPromedio: Number(dato.pesoPromedio) || 0,
        tarifa: Number(dato.tarifa) || 0,
        distanciaAlAnterior: Number(dato.distanciaAlAnterior) || 0,
        sentido: dato.sentido || 'Norte-Sur',
        categoria: dato.categoria || 'auto',
        creadoPor: req.userId // Agregar referencia al usuario que creó el registro
      };
    });

    console.log('Datos validados:', datosValidados);

    // Guardar cada objeto del array como un documento individual
    const resultados = await SimulacionTrafico.insertMany(datosValidados);

    console.log(`${resultados.length} registros guardados exitosamente`);
    res.status(201).json({ 
      message: 'Datos de simulación guardados exitosamente',
      registrosGuardados: resultados.length
    });
  } catch (error) {
    console.error('Error completo al guardar los datos de simulación:', error);
    
    // Manejo de errores más específico
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Error de validación', 
        details: errores 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Error de duplicado', 
        details: 'Ya existe un registro con estos datos' 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
});

// Ruta para guardar simulación de clima (ahora con verificación de token)
app.post('/api/simulacion-clima', verificarToken, async (req, res) => {
  try {
    const datosClima = req.body;
    
    console.log('Datos de clima recibidos:', datosClima);

    // Validación básica
    if (!datosClima.tipoClima || !datosClima.intensidad || !datosClima.fecha || !datosClima.ubicacion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar y formatear fecha
    let fechaFormateada;
    try {
      fechaFormateada = new Date(datosClima.fecha);
      if (isNaN(fechaFormateada.getTime())) {
        return res.status(400).json({ error: 'Fecha inválida' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Error al procesar la fecha' });
    }

    // Crear nuevo documento de simulación de clima
    const nuevaSimulacionClima = new SimulacionClima({
      tipoClima: datosClima.tipoClima,
      intensidad: datosClima.intensidad,
      fecha: fechaFormateada,
      ubicacion: datosClima.ubicacion,
      ubicacionKm: datosClima.ubicacionKm,
      eventosCatastroficos: datosClima.eventosCatastroficos || 'Ninguno',
      desgasteEstimado: datosClima.desgasteEstimado,
      temperatura: datosClima.temperatura,
      humedad: datosClima.humedad,
      viento: {
        velocidad: datosClima.viento.velocidad,
        direccion: datosClima.viento.direccion
      },
      presion: datosClima.presion,
      precipitacion: datosClima.precipitacion,
      visibilidad: datosClima.visibilidad,
      indiceUV: datosClima.indiceUV,
      creadoPor: req.userId // Agregar referencia al usuario que creó el registro
    });

    await nuevaSimulacionClima.save();

    console.log('Registro de clima guardado exitosamente');
    res.status(201).json({ 
      message: 'Datos de simulación de clima guardados exitosamente',
      registro: nuevaSimulacionClima
    });
  } catch (error) {
    console.error('Error al guardar los datos de simulación de clima:', error);
    
    // Manejo de errores más específico
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Error de validación', 
        details: errores 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    });
  }
});

// Ruta para obtener datos de simulación de tráfico
app.get('/api/simulacion-trafico', verificarToken, async (req, res) => {
  try {
    const datos = await SimulacionTrafico.find().sort({ fecha: -1, hora: -1 });
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos de simulación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener datos de simulación de clima
app.get('/api/simulacion-clima', verificarToken, async (req, res) => {
  try {
    const datos = await SimulacionClima.find().sort({ fecha: -1, fechaCreacion: -1 });
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos de simulación de clima:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para verificar el estado de la conexión
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Conectar a MongoDB y arrancar el servidor
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
  process.exit(1);
});