import React, { useState } from 'react';

const SimulacionDeDatos = ({ profileData, configData }) => {
  const [simulacionTrafico, setSimulacionTrafico] = useState([]);
  const [simulacionClima, setSimulacionClima] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClima, setLoadingClima] = useState(false);
  const [climaForm, setClimaForm] = useState({
    tipoClima: 'Soleado',
    intensidad: 'Media',
    fecha: new Date().toISOString().split('T')[0],
    ubicacion: 'Peaje Angostura',
    eventosCatastroficos: 'Ninguno'
  });

  const tiposVehiculos = [
    { tipo: 'Moto', pesoPromedio: 300, categoria: 'moto' },
    { tipo: 'Auto', pesoPromedio: 1500, categoria: 'auto' },
    { tipo: 'Camioneta', pesoPromedio: 2200, categoria: 'auto' },
    { tipo: 'Auto con Remolque', pesoPromedio: 2800, categoria: 'remolque' },
    { tipo: 'Camioneta con Remolque', pesoPromedio: 3500, categoria: 'remolque' },
    { tipo: 'Bus de Dos Ejes', pesoPromedio: 8000, categoria: 'buses2', ejes: 2 },
    { tipo: 'Casa Rodante', pesoPromedio: 4500, categoria: 'buses2', ejes: 2 },
    { tipo: 'Camión de Dos Ejes', pesoPromedio: 12000, categoria: 'camiones2', ejes: 2 },
    { tipo: 'Bus de Tres Ejes', pesoPromedio: 15000, categoria: 'buses3', ejes: 3 },
    { tipo: 'Bus de Cuatro Ejes', pesoPromedio: 18000, categoria: 'buses3', ejes: 4 },
    { tipo: 'Camión de Tres Ejes', pesoPromedio: 25000, categoria: 'camiones3', ejes: 3 },
    { tipo: 'Camión de Cuatro Ejes', pesoPromedio: 35000, categoria: 'camiones3', ejes: 4 }
  ];

  const tiposClima = ['Soleado', 'Nublado', 'Lluvia', 'Tormenta', 'Nieve', 'Granizo', 'Neblina', 'Viento Fuerte'];
  const intensidades = ['Baja', 'Media', 'Alta', 'Extrema'];
  const eventosCatastroficos = ['Ninguno', 'Terremoto', 'Temblor', 'Tornado', 'Huracán', 'Inundación', 'Deslizamiento', 'Aluvión'];

  const datosTablaPerajes = [
    { no: 1, nombre: 'Peaje Angostura', ubicacion: 54, distancia: '', tarifaAuto: 3700, tarifaMoto: 1100, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 2, nombre: 'Peaje Troncal Quinta', ubicacion: 162, distancia: 108, tarifaAuto: 3700, tarifaMoto: 1100, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 3, nombre: 'Peaje Troncal Río Claro', ubicacion: 220, distancia: 58, tarifaAuto: 3100, tarifaMoto: 900, tarifaRemolque: 4600, tarifaBuses2: 5500, tarifaCamiones2: 5500, tarifaBuses3: 9800, tarifaCamiones3: 9800 },
    { no: 4, nombre: 'Peaje Troncal Retiro', ubicacion: 320, distancia: 100, tarifaAuto: 3100, tarifaMoto: 900, tarifaRemolque: 4600, tarifaBuses2: 5500, tarifaCamiones2: 5500, tarifaBuses3: 9800, tarifaCamiones3: 9800 },
    { no: 5, nombre: 'Peaje Troncal Santa Clara', ubicacion: 444, distancia: 124, tarifaAuto: 3200, tarifaMoto: 800, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 6, nombre: 'Peaje Troncal Las Maicas', ubicacion: 555, distancia: 111, tarifaAuto: 3200, tarifaMoto: 1000, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 7, nombre: 'Peaje Troncal Púa', ubicacion: 620, distancia: 65, tarifaAuto: 3400, tarifaMoto: 1000, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 8, nombre: 'Peaje Troncal Quepe', ubicacion: 693, distancia: 73, tarifaAuto: 3400, tarifaMoto: 1000, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 9, nombre: 'Peaje Troncal Lanco', ubicacion: 775, distancia: 82, tarifaAuto: 3700, tarifaMoto: 1100, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 10, nombre: 'Peaje Troncal La Unión', ubicacion: 875, distancia: 100, tarifaAuto: 3100, tarifaMoto: 1100, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 11, nombre: 'Peaje Troncal Cuatro Vientos', ubicacion: 960, distancia: 85, tarifaAuto: 3500, tarifaMoto: 1100, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 },
    { no: 12, nombre: 'Peaje Troncal Puerto Montt', ubicacion: 1020, distancia: 60, tarifaAuto: 1100, tarifaMoto: 300, tarifaRemolque: 4800, tarifaBuses2: 5800, tarifaCamiones2: 5800, tarifaBuses3: 10300, tarifaCamiones3: 10300 }
  ];

  const generarDatosMeteorologicos = (tipoClima, intensidad, eventosCatastroficos) => {
    const datos = {};
    switch (tipoClima) {
      case 'Soleado':
        datos.temperatura = Math.floor(Math.random() * 20) + 15;
        datos.humedad = Math.floor(Math.random() * 30) + 30;
        datos.precipitacion = 0;
        datos.visibilidad = Math.floor(Math.random() * 10) + 40;
        datos.indiceUV = Math.floor(Math.random() * 8) + 7;
        break;
      case 'Nublado':
        datos.temperatura = Math.floor(Math.random() * 15) + 10;
        datos.humedad = Math.floor(Math.random() * 20) + 50;
        datos.precipitacion = Math.floor(Math.random() * 3);
        datos.visibilidad = Math.floor(Math.random() * 15) + 25;
        datos.indiceUV = Math.floor(Math.random() * 4) + 3;
        break;
      case 'Lluvia':
        datos.temperatura = Math.floor(Math.random() * 10) + 8;
        datos.humedad = Math.floor(Math.random() * 20) + 70;
        datos.precipitacion = Math.floor(Math.random() * 20) + 5;
        datos.visibilidad = Math.floor(Math.random() * 15) + 10;
        datos.indiceUV = Math.floor(Math.random() * 3) + 1;
        break;
      case 'Tormenta':
        datos.temperatura = Math.floor(Math.random() * 8) + 12;
        datos.humedad = Math.floor(Math.random() * 10) + 85;
        datos.precipitacion = Math.floor(Math.random() * 30) + 20;
        datos.visibilidad = Math.floor(Math.random() * 8) + 5;
        datos.indiceUV = Math.floor(Math.random() * 2) + 1;
        break;
      case 'Nieve':
        datos.temperatura = Math.floor(Math.random() * 8) - 5;
        datos.humedad = Math.floor(Math.random() * 15) + 80;
        datos.precipitacion = Math.floor(Math.random() * 15) + 10;
        datos.visibilidad = Math.floor(Math.random() * 10) + 5;
        datos.indiceUV = Math.floor(Math.random() * 2) + 1;
        break;
      case 'Granizo':
        datos.temperatura = Math.floor(Math.random() * 10) + 5;
        datos.humedad = Math.floor(Math.random() * 10) + 85;
        datos.precipitacion = Math.floor(Math.random() * 20) + 15;
        datos.visibilidad = Math.floor(Math.random() * 10) + 8;
        datos.indiceUV = Math.floor(Math.random() * 3) + 1;
        break;
      case 'Neblina':
        datos.temperatura = Math.floor(Math.random() * 12) + 8;
        datos.humedad = Math.floor(Math.random() * 10) + 90;
        datos.precipitacion = Math.floor(Math.random() * 3);
        datos.visibilidad = Math.floor(Math.random() * 3) + 1;
        datos.indiceUV = Math.floor(Math.random() * 2) + 1;
        break;
      case 'Viento Fuerte':
        datos.temperatura = Math.floor(Math.random() * 15) + 12;
        datos.humedad = Math.floor(Math.random() * 40) + 40;
        datos.precipitacion = Math.floor(Math.random() * 5);
        datos.visibilidad = Math.floor(Math.random() * 20) + 20;
        datos.indiceUV = Math.floor(Math.random() * 6) + 4;
        break;
      default:
        datos.temperatura = 20;
        datos.humedad = 60;
        datos.precipitacion = 0;
        datos.visibilidad = 30;
        datos.indiceUV = 5;
    }

    const multiplicadorIntensidad = {
      'Baja': 0.7,
      'Media': 1.0,
      'Alta': 1.3,
      'Extrema': 1.6
    };
    const factor = multiplicadorIntensidad[intensidad] || 1.0;
    datos.precipitacion = Math.floor(datos.precipitacion * factor);
    datos.humedad = Math.min(100, Math.floor(datos.humedad * factor));
    datos.visibilidad = Math.max(1, Math.floor(datos.visibilidad / factor));

    const direccionesViento = ['Norte', 'Noreste', 'Este', 'Sureste', 'Sur', 'Suroeste', 'Oeste', 'Noroeste'];
    const velocidadBase = tipoClima === 'Viento Fuerte' ?
      Math.floor(Math.random() * 30) + 40 :
      Math.floor(Math.random() * 20) + 5;

    datos.viento = {
      velocidad: Math.floor(velocidadBase * factor),
      direccion: direccionesViento[Math.floor(Math.random() * direccionesViento.length)]
    };

    datos.presion = Math.floor(Math.random() * 100) + 1000;

    if (eventosCatastroficos !== 'Ninguno') {
      switch (eventosCatastroficos) {
        case 'Terremoto':
        case 'Temblor':
          datos.presion -= Math.floor(Math.random() * 50) + 20;
          break;
        case 'Tornado':
        case 'Huracán':
          datos.presion -= Math.floor(Math.random() * 80) + 50;
          datos.viento.velocidad += Math.floor(Math.random() * 100) + 80;
          datos.precipitacion += Math.floor(Math.random() * 100) + 50;
          break;
        case 'Inundación':
          datos.precipitacion += Math.floor(Math.random() * 150) + 100;
          datos.humedad = Math.min(100, datos.humedad + 20);
          break;
        case 'Deslizamiento':
        case 'Aluvión':
          datos.precipitacion += Math.floor(Math.random() * 80) + 50;
          datos.visibilidad = Math.max(1, datos.visibilidad - 10);
          break;
      }
    }
    return datos;
  };

  const calcularDesgasteEstimado = (tipoClima, intensidad, eventosCatastroficos) => {
    let desgaste = 0;
    const desgasteBase = {
      'Soleado': 0.5,
      'Nublado': 1.0,
      'Lluvia': 2.5,
      'Tormenta': 4.0,
      'Nieve': 3.5,
      'Granizo': 5.0,
      'Neblina': 1.5,
      'Viento Fuerte': 2.0
    };
    desgaste += desgasteBase[tipoClima] || 1.0;

    const multiplicadorIntensidad = {
      'Baja': 0.5,
      'Media': 1.0,
      'Alta': 1.8,
      'Extrema': 2.5
    };
    desgaste *= multiplicadorIntensidad[intensidad] || 1.0;

    const desgasteEventos = {
      'Ninguno': 0,
      'Terremoto': 4.0,
      'Temblor': 2.0,
      'Tornado': 5.0,
      'Huracán': 5.0,
      'Inundación': 3.5,
      'Deslizamiento': 4.5,
      'Aluvión': 4.5
    };
    desgaste += desgasteEventos[eventosCatastroficos] || 0;

    return Math.min(10, Math.max(0, Math.round(desgaste * 10) / 10));
  };

  const obtenerTarifa = (peaje, categoriaVehiculo) => {
    const peajeData = datosTablaPerajes.find(p => p.nombre === peaje);
    if (!peajeData) return 0;
    const tarifaMap = {
      'moto': peajeData.tarifaMoto,
      'auto': peajeData.tarifaAuto,
      'remolque': peajeData.tarifaRemolque,
      'buses2': peajeData.tarifaBuses2,
      'camiones2': peajeData.tarifaCamiones2,
      'buses3': peajeData.tarifaBuses3,
      'camiones3': peajeData.tarifaCamiones3
    };
    return tarifaMap[categoriaVehiculo] || 0;
  };

  const calcularDistanciaPeajeAnterior = (peajeActual) => {
    const peajeData = datosTablaPerajes.find(p => p.nombre === peajeActual);
    return peajeData ? peajeData.distancia : 0;
  };

  const determinarSentido = () => {
    const sentidos = ['Norte-Sur', 'Sur-Norte'];
    return sentidos[Math.floor(Math.random() * sentidos.length)];
  };

  const generarDatosTrafico = async () => {
    setLoading(true);
    try {
      const datosSimulados = [];
      const cantidadRegistros = 50;
      for (let i = 0; i < cantidadRegistros; i++) {
        const vehiculo = tiposVehiculos[Math.floor(Math.random() * tiposVehiculos.length)];
        const peaje = datosTablaPerajes[Math.floor(Math.random() * datosTablaPerajes.length)];

        const registro = {
          tipoVehiculo: vehiculo.tipo,
          ejes: vehiculo.ejes || 'N/A',
          peaje: peaje.nombre,
          ubicacionKm: peaje.ubicacion,
          hora: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          fecha: new Date().toISOString().split('T')[0],
          pesoPromedio: vehiculo.pesoPromedio,
          tarifa: obtenerTarifa(peaje.nombre, vehiculo.categoria),
          distanciaAlAnterior: calcularDistanciaPeajeAnterior(peaje.nombre),
          sentido: determinarSentido(),
          categoria: vehiculo.categoria
        };
        datosSimulados.push(registro);
      }

      const response = await fetch('http://localhost:5000/api/simulacion-trafico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosSimulados)
      });
      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }
      setSimulacionTrafico(datosSimulados);
      alert('Datos de tráfico generados y guardados exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar datos de tráfico: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambioFormulario = (campo, valor) => {
    setClimaForm(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const obtenerUbicacionKm = (nombrePeaje) => {
    const peaje = datosTablaPerajes.find(p => p.nombre === nombrePeaje);
    return peaje ? peaje.ubicacion : 0;
  };

  const generarEventoClima = async () => {
    setLoadingClima(true);
    try {
      const datosMeteorologicos = generarDatosMeteorologicos(
        climaForm.tipoClima,
        climaForm.intensidad,
        climaForm.eventosCatastroficos
      );

      const desgasteEstimado = calcularDesgasteEstimado(
        climaForm.tipoClima,
        climaForm.intensidad,
        climaForm.eventosCatastroficos
      );

      const datosClima = {
        tipoClima: climaForm.tipoClima,
        intensidad: climaForm.intensidad,
        fecha: climaForm.fecha,
        ubicacion: climaForm.ubicacion,
        ubicacionKm: obtenerUbicacionKm(climaForm.ubicacion),
        eventosCatastroficos: climaForm.eventosCatastroficos,
        desgasteEstimado: desgasteEstimado,
        temperatura: datosMeteorologicos.temperatura,
        humedad: datosMeteorologicos.humedad,
        viento: datosMeteorologicos.viento,
        presion: datosMeteorologicos.presion,
        precipitacion: datosMeteorologicos.precipitacion,
        visibilidad: datosMeteorologicos.visibilidad,
        indiceUV: datosMeteorologicos.indiceUV
      };

      const response = await fetch('http://localhost:5000/api/simulacion-clima', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosClima)
      });
      if (!response.ok) {
        throw new Error('Error al guardar los datos de clima');
      }

      setSimulacionClima(prev => [...prev, datosClima]);
      alert('Evento climático agregado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar evento climático: ' + error.message);
    } finally {
      setLoadingClima(false);
    }
  };

  const formatearNumero = (num) => {
    return num.toLocaleString('es-CL');
  };

  const obtenerColorCategoria = (categoria) => {
    const colores = {
      'moto': '#10b981',
      'auto': '#3b82f6',
      'remolque': '#f59e0b',
      'buses2': '#8b5cf6',
      'camiones2': '#ef4444',
      'buses3': '#6366f1',
      'camiones3': '#dc2626'
    };
    return colores[categoria] || '#6b7280';
  };

  const obtenerColorClima = (tipoClima) => {
    const colores = {
      'Soleado': '#fbbf24',
      'Nublado': '#6b7280',
      'Lluvia': '#3b82f6',
      'Tormenta': '#7c3aed',
      'Nieve': '#e5e7eb',
      'Granizo': '#f3f4f6',
      'Neblina': '#9ca3af',
      'Viento Fuerte': '#10b981'
    };
    return colores[tipoClima] || '#6b7280';
  };

  const estiloInput = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #4b5563',
    backgroundColor: '#374151',
    color: 'white',
    width: '100%',
    fontSize: '14px'
  };

  const estiloLabel = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#d1d5db',
    marginBottom: '4px'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1f2937', color: 'white', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '32px', textAlign: 'center' }}>
          Simulación de Datos de Tráfico Vehicular y Condiciones Climáticas
        </h1>

        {/* Sección de Simulación de Tráfico */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#60a5fa' }}>
              Simulación de Tráfico Vehicular
            </h2>
            <button
              onClick={generarDatosTrafico}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#6b7280' : '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Generando...' : 'Generar Datos de Tráfico'}
            </button>
            {simulacionTrafico.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', backgroundColor: '#4b5563', borderRadius: '8px', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#6b7280' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Tipo Vehículo</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Ejes</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Peaje</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Ubicación (km)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Hora</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Fecha</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Peso (kg)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Tarifa ($)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Distancia (km)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Sentido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulacionTrafico.map((dato, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #6b7280' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: obtenerColorCategoria(dato.categoria) }}>{dato.tipoVehiculo}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.ejes}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.peaje}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.ubicacionKm}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.hora}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.fecha}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{formatearNumero(dato.pesoPromedio)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>${formatearNumero(dato.tarifa)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.distanciaAlAnterior}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.sentido}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Simulación de Clima */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#34d399' }}>
              Simulación de Clima
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={estiloLabel}>Tipo de Clima</label>
                <select style={estiloInput} value={climaForm.tipoClima} onChange={(e) => manejarCambioFormulario('tipoClima', e.target.value)}>
                  {tiposClima.map((clima, index) => (
                    <option key={index} value={clima}>{clima}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>Intensidad</label>
                <select style={estiloInput} value={climaForm.intensidad} onChange={(e) => manejarCambioFormulario('intensidad', e.target.value)}>
                  {intensidades.map((intensidad, index) => (
                    <option key={index} value={intensidad}>{intensidad}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>Fecha</label>
                <input type="date" style={estiloInput} value={climaForm.fecha} onChange={(e) => manejarCambioFormulario('fecha', e.target.value)} />
              </div>
              <div>
                <label style={estiloLabel}>Ubicación</label>
                <select style={estiloInput} value={climaForm.ubicacion} onChange={(e) => manejarCambioFormulario('ubicacion', e.target.value)}>
                  {datosTablaPerajes.map((peaje, index) => (
                    <option key={index} value={peaje.nombre}>{peaje.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={estiloLabel}>Eventos Catastróficos</label>
                <select style={estiloInput} value={climaForm.eventosCatastroficos} onChange={(e) => manejarCambioFormulario('eventosCatastroficos', e.target.value)}>
                  {eventosCatastroficos.map((evento, index) => (
                    <option key={index} value={evento}>{evento}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={generarEventoClima}
              disabled={loadingClima}
              style={{
                backgroundColor: loadingClima ? '#6b7280' : '#059669',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: loadingClima ? 'not-allowed' : 'pointer',
                marginBottom: '16px',
                fontSize: '16px',
                transition: 'background-color 0.2s'
              }}
            >
              {loadingClima ? 'Generando...' : 'Generar Evento Climático'}
            </button>
            {simulacionClima.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', backgroundColor: '#4b5563', borderRadius: '8px', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#6b7280' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Tipo Clima</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Intensidad</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Fecha</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Ubicación</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Desgaste Estimado</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Temperatura (°C)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Humedad (%)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Viento (km/h)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Presión (hPa)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Precipitación (mm)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Visibilidad (km)</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Índice UV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulacionClima.map((dato, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #6b7280' }}>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: obtenerColorClima(dato.tipoClima) }}>{dato.tipoClima}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.intensidad}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.fecha}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.ubicacion}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.desgasteEstimado}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.temperatura}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.humedad}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.viento.velocidad} {dato.viento.direccion}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.presion}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.precipitacion}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.visibilidad}</td>
                        <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{dato.indiceUV}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de Peajes */}
        <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: '#fbbf24' }}>
            Tabla de Peajes y Tarifas por Tipo de Vehículo
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', backgroundColor: '#334155', borderRadius: '8px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead style={{ backgroundColor: '#475569' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>N°</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Nombre del Peaje</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Ubicación (Km)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Distancia al Peaje Anterior (Km)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Autos/Camionetas ($)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Motos ($)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Autos con Remolque/Camionetas con Remolque ($)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Buses de Dos Ejes/Casas Rodantes ($)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Camiones de Dos Ejes ($)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Buses de más de Dos Ejes ($)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Tarifa Camiones de más de Dos Ejes ($)</th>
                </tr>
              </thead>
              <tbody>
                {datosTablaPerajes.map((peaje, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #475569' }}>
                    <td style={{ padding: '12px', color: 'white' }}>{peaje.no}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{peaje.nombre}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{peaje.ubicacion}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{peaje.distancia || '-'}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaAuto)}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaMoto)}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaRemolque)}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaBuses2)}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaCamiones2)}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaBuses3)}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{formatearNumero(peaje.tarifaCamiones3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulacionDeDatos;
