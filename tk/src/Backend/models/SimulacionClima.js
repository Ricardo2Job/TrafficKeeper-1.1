// models/SimulacionClima.js
const mongoose = require('mongoose');

const simulacionClimaSchema = new mongoose.Schema({
  tipoClima: {
    type: String,
    required: true,
    enum: ['Soleado', 'Nublado', 'Lluvia', 'Tormenta', 'Nieve', 'Granizo', 'Neblina', 'Viento Fuerte']
  },
  intensidad: {
    type: String,
    required: true,
    enum: ['Baja', 'Media', 'Alta', 'Extrema']
  },
  fecha: {
    type: Date,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },
  ubicacionKm: {
    type: Number,
    required: true
  },
  eventosCatastroficos: {
    type: String,
    enum: ['Ninguno', 'Terremoto', 'Temblor', 'Tornado', 'Huracán', 'Inundación', 'Deslizamiento', 'Aluvión'],
    default: 'Ninguno'
  },
  desgasteEstimado: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  temperatura: {
    type: Number,
    required: true,
    min: -30,
    max: 50
  },
  humedad: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  viento: {
    velocidad: {
      type: Number,
      required: true,
      min: 0,
      max: 200
    },
    direccion: {
      type: String,
      required: true,
      enum: ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste']
    }
  },
  presion: {
    type: Number,
    required: true,
    min: 800,
    max: 1100
  },
  precipitacion: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  visibilidad: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  indiceUV: {
    type: Number,
    required: true,
    min: 0,
    max: 15
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SimulacionClima', simulacionClimaSchema);