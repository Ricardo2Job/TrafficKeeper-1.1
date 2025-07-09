const mongoose = require('mongoose');

const uri = "mongodb+srv://Ricardo2dds:ricardo2garrido@cluster0.qugop.mongodb.net/TrafficKeeper?retryWrites=true&w=majority&appName=Cluster0";

async function connectToDatabase() {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error al conectar a MongoDB', err);
  }
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose está conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose está desconectado de MongoDB');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexión de Mongoose cerrada debido a la terminación de la aplicación');
    process.exit(0);
  });
});

module.exports = { connectToDatabase };
