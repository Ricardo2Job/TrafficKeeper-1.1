import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, AlertTriangle, MapPin, Calendar, RefreshCw } from 'lucide-react';

const Clima = ({ profileData, configData }) => {
  const [climaData, setClimaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    ubicacion: 'Todas',
    fechaDesde: '',
    fechaHasta: '',
    tipoClima: 'Todos'
  });

  // Datos de ubicaciones desde tu simulación
  const ubicaciones = [
    'Peaje Angostura', 'Peaje Troncal Quinta', 'Peaje Troncal Río Claro',
    'Peaje Troncal Retiro', 'Peaje Troncal Santa Clara', 'Peaje Troncal Las Maicas',
    'Peaje Troncal Púa', 'Peaje Troncal Quepe', 'Peaje Troncal Lanco',
    'Peaje Troncal La Unión', 'Peaje Troncal Cuatro Vientos', 'Peaje Troncal Puerto Montt'
  ];

  const tiposClima = ['Soleado', 'Nublado', 'Lluvia', 'Tormenta', 'Nieve', 'Granizo', 'Neblina', 'Viento Fuerte'];

  // Cargar datos de clima desde la base de datos
  const cargarDatosClima = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/simulacion-clima');
      if (!response.ok) {
        throw new Error('Error al cargar datos de clima');
      }
      const data = await response.json();
      setClimaData(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosClima();
  }, []);

  // Filtrar datos según los filtros aplicados
  const datosFiltrados = climaData.filter(dato => {
    if (filtros.ubicacion !== 'Todas' && dato.ubicacion !== filtros.ubicacion) return false;
    if (filtros.tipoClima !== 'Todos' && dato.tipoClima !== filtros.tipoClima) return false;
    if (filtros.fechaDesde && dato.fecha < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && dato.fecha > filtros.fechaHasta) return false;
    return true;
  });

  // Obtener datos climáticos más recientes
  const datosRecientes = datosFiltrados.length > 0 ? datosFiltrados[datosFiltrados.length - 1] : null;

  // Estadísticas generales
  const estadisticas = {
    totalRegistros: datosFiltrados.length,
    temperaturaPromedio: datosFiltrados.length > 0 ? 
      Math.round(datosFiltrados.reduce((sum, d) => sum + d.temperatura, 0) / datosFiltrados.length) : 0,
    humedadPromedio: datosFiltrados.length > 0 ? 
      Math.round(datosFiltrados.reduce((sum, d) => sum + d.humedad, 0) / datosFiltrados.length) : 0,
    desgastePromedio: datosFiltrados.length > 0 ? 
      (datosFiltrados.reduce((sum, d) => sum + d.desgasteEstimado, 0) / datosFiltrados.length).toFixed(1) : 0
  };

  const getWeatherIcon = (condicion) => {
    switch (condicion) {
      case 'Soleado':
        return <Sun size={32} color="#F59E0B" />;
      case 'Lluvia':
        return <CloudRain size={32} color="#3B82F6" />;
      case 'Tormenta':
        return <CloudRain size={32} color="#7C3AED" />;
      case 'Nieve':
        return <Cloud size={32} color="#E5E7EB" />;
      case 'Granizo':
        return <Cloud size={32} color="#9CA3AF" />;
      case 'Neblina':
        return <Cloud size={32} color="#6B7280" />;
      case 'Viento Fuerte':
        return <Wind size={32} color="#10B981" />;
      case 'Nublado':
      default:
        return <Cloud size={32} color="#6B7280" />;
    }
  };

  const getDesgasteColor = (desgaste) => {
    if (desgaste <= 2) return '#10B981'; // Verde
    if (desgaste <= 5) return '#F59E0B'; // Amarillo
    if (desgaste <= 7) return '#EF4444'; // Rojo
    return '#DC2626'; // Rojo oscuro
  };

  const manejarCambioFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const estiloCard = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  const estiloInput = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #4b5563',
    backgroundColor: '#374151',
    color: 'white',
    fontSize: '14px'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <RefreshCw size={32} color="#8B5CF6" className="animate-spin" />
        <span style={{ color: 'white', marginLeft: '12px' }}>Cargando datos climáticos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={estiloCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444' }}>
          <AlertTriangle size={24} />
          <span>Error al cargar los datos: {error}</span>
        </div>
        <button 
          onClick={cargarDatosClima}
          style={{
            backgroundColor: '#8B5CF6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '12px'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Título */}
      <div style={estiloCard}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
          Condiciones Climáticas
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
          Monitoreo de condiciones meteorológicas en tiempo real
        </p>
      </div>

      {/* Filtros */}
      <div style={estiloCard}>
        <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Filtros
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '4px' }}>
              Ubicación
            </label>
            <select 
              style={estiloInput}
              value={filtros.ubicacion}
              onChange={(e) => manejarCambioFiltro('ubicacion', e.target.value)}
            >
              <option value="Todas">Todas las ubicaciones</option>
              {ubicaciones.map(ubicacion => (
                <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '4px' }}>
              Tipo de Clima
            </label>
            <select 
              style={estiloInput}
              value={filtros.tipoClima}
              onChange={(e) => manejarCambioFiltro('tipoClima', e.target.value)}
            >
              <option value="Todos">Todos los tipos</option>
              {tiposClima.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '4px' }}>
              Fecha Desde
            </label>
            <input 
              type="date"
              style={estiloInput}
              value={filtros.fechaDesde}
              onChange={(e) => manejarCambioFiltro('fechaDesde', e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '4px' }}>
              Fecha Hasta
            </label>
            <input 
              type="date"
              style={estiloInput}
              value={filtros.fechaHasta}
              onChange={(e) => manejarCambioFiltro('fechaHasta', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div style={estiloCard}>
        <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Estadísticas Generales
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.6)', 
            borderRadius: '0.75rem', 
            padding: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Total Registros
            </div>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {estadisticas.totalRegistros}
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.6)', 
            borderRadius: '0.75rem', 
            padding: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Temperatura Promedio
            </div>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {estadisticas.temperaturaPromedio}°C
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.6)', 
            borderRadius: '0.75rem', 
            padding: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Humedad Promedio
            </div>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {estadisticas.humedadPromedio}%
            </div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.6)', 
            borderRadius: '0.75rem', 
            padding: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Desgaste Promedio
            </div>
            <div style={{ 
              color: getDesgasteColor(estadisticas.desgastePromedio), 
              fontSize: '1.5rem', 
              fontWeight: 'bold' 
            }}>
              {estadisticas.desgastePromedio}/10
            </div>
          </div>
        </div>
      </div>

      {/* Condiciones actuales */}
      {datosRecientes && (
        <div style={estiloCard}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Condiciones Más Recientes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem' }}>
                {getWeatherIcon(datosRecientes.tipoClima)}
              </div>
              <div style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
                {datosRecientes.temperatura}°C
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
                {datosRecientes.tipoClima}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {datosRecientes.intensidad}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.6)', 
                borderRadius: '0.75rem', 
                padding: '1rem',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Droplets size={16} color="#3B82F6" />
                  <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Humedad</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {datosRecientes.humedad}%
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.6)', 
                borderRadius: '0.75rem', 
                padding: '1rem',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Wind size={16} color="#10B981" />
                  <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Viento</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {datosRecientes.viento.velocidad} km/h
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                  {datosRecientes.viento.direccion}
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.6)', 
                borderRadius: '0.75rem', 
                padding: '1rem',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Eye size={16} color="#F59E0B" />
                  <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Visibilidad</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {datosRecientes.visibilidad} km
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.6)', 
                borderRadius: '0.75rem', 
                padding: '1rem',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={16} color={getDesgasteColor(datosRecientes.desgasteEstimado)} />
                  <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Desgaste</span>
                </div>
                <div style={{ 
                  color: getDesgasteColor(datosRecientes.desgasteEstimado), 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold' 
                }}>
                  {datosRecientes.desgasteEstimado}/10
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <MapPin size={16} color="#8B5CF6" />
            <span style={{ color: '#D1D5DB' }}>{datosRecientes.ubicacion}</span>
            <Calendar size={16} color="#8B5CF6" />
            <span style={{ color: '#D1D5DB' }}>{datosRecientes.fecha}</span>
            {datosRecientes.eventosCatastroficos !== 'Ninguno' && (
              <>
                <AlertTriangle size={16} color="#EF4444" />
                <span style={{ color: '#EF4444' }}>{datosRecientes.eventosCatastroficos}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Historial de eventos */}
      <div style={estiloCard}>
        <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Historial de Eventos ({datosFiltrados.length} registros)
        </h3>
        {datosFiltrados.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', backgroundColor: '#4b5563', borderRadius: '8px', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#6b7280' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Ubicación</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Clima</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Temp. (°C)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Humedad (%)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Viento (km/h)</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: 'white', fontWeight: '500' }}>Desgaste</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.map((dato, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #6b7280' }}>
                    <td style={{ padding: '12px', color: 'white' }}>{dato.fecha}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{dato.ubicacion}</td>
                    <td style={{ padding: '12px', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getWeatherIcon(dato.tipoClima)}
                        <span>{dato.tipoClima}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'white' }}>{dato.temperatura}</td>
                    <td style={{ padding: '12px', color: 'white' }}>{dato.humedad}</td>
                    <td style={{ padding: '12px', color: 'white' }}>
                      {dato.viento.velocidad} {dato.viento.direccion}
                    </td>
                    <td style={{ padding: '12px', color: getDesgasteColor(dato.desgasteEstimado) }}>
                      {dato.desgasteEstimado}/10
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>
            No se encontraron registros con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
};

export default Clima;