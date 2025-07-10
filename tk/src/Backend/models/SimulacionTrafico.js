//SimulacionTrafico.js
const mongoose = require('mongoose');

const SimulacionTraficoSchema = new mongoose.Schema({
  tipoVehiculo: {
    type: String,
    required: [true, 'El tipo de vehículo es obligatorio'],
    trim: true
  },
  ejes: {
    type: Number,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || (v >= 2 && v <= 10);
      },
      message: 'El número de ejes debe estar entre 2 y 10'
    }
  },
  peaje: {
    type: String,
    required: [true, 'El peaje es obligatorio'],
    trim: true
  },
  ubicacionKm: {
    type: Number,
    required: [true, 'La ubicación en km es obligatoria'],
    min: [0, 'La ubicación no puede ser negativa']
  },
  hora: {
    type: String,
    required: [true, 'La hora es obligatoria'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'La hora debe tener el formato HH:MM'
    }
  },
  fecha: {
    type: String,
    required: [true, 'La fecha es obligatoria'],
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'La fecha debe tener el formato YYYY-MM-DD'
    }
  },
  pesoPromedio: {
    type: Number,
    required: [true, 'El peso promedio es obligatorio'],
    min: [0, 'El peso no puede ser negativo']
  },
  tarifa: {
    type: Number,
    required: [true, 'La tarifa es obligatoria'],
    min: [0, 'La tarifa no puede ser negativa']
  },
  distanciaAlAnterior: {
    type: Number,
    required: [true, 'La distancia al anterior es obligatoria'],
    min: [0, 'La distancia no puede ser negativa']
  },
  sentido: {
    type: String,
    required: [true, 'El sentido es obligatorio'],
    enum: {
      values: ['Norte-Sur', 'Sur-Norte'],
      message: 'El sentido debe ser Norte-Sur o Sur-Norte'
    }
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['moto', 'auto', 'remolque', 'buses2', 'camiones2', 'buses3', 'camiones3'],
      message: 'Categoría no válida'
    }
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento de las consultas
SimulacionTraficoSchema.index({ fecha: -1, hora: -1 });
SimulacionTraficoSchema.index({ peaje: 1 });
SimulacionTraficoSchema.index({ categoria: 1 });
SimulacionTraficoSchema.index({ sentido: 1 });

// Middleware para logging
SimulacionTraficoSchema.pre('save', function(next) {
  console.log('Guardando simulación de tráfico:', this.tipoVehiculo, this.peaje);
  next();
});

module.exports = mongoose.model('SimulacionTrafico', SimulacionTraficoSchema);