const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { connectToDatabase } = require('./DB');
const Usuario = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Cambia esto al origen de tu aplicación frontend
}));
app.use(bodyParser.json());

// Ruta para crear un nuevo usuario
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, companyName, userPosition } = req.body;

    // Validación básica
    if (!email || !password || !companyName || !userPosition) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
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

// Ruta para el login
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

    res.status(200).json({ message: 'Login exitoso', usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Conectar a MongoDB y arrancar el servidor
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(err => console.error('Error al conectar a MongoDB:', err));
