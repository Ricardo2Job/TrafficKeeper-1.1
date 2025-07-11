import React, { useState, useEffect } from 'react';
import { Map, AlertTriangle, BarChart3, Car, Database, Cloud, Truck, Calendar, MapPin, Clock, Thermometer, Wind, Eye, Sun, Droplets, Gauge } from 'lucide-react';

const Inicio = ({ profileData, configData }) => {
  const [datosTrafico, setDatosTrafico] = useState([]);
  const [datosClima, setDatosClima] = useState([]);
  const [cargandoTrafico, setCargandoTrafico] = useState(true);
  const [cargandoClima, setCargandoClima] = useState(true);
  const [error, setError] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');

  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem'
  };

  const subtitleStyle = {
    color: '#9CA3AF',
    marginBottom: '2rem',
    fontSize: '1.1rem'
  };

  const buttonStyle = {
    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0.25rem'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  };

  const thStyle = {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    color: '#A855F7',
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
    fontSize: '0.9rem',
    fontWeight: '600'
  };

  const tdStyle = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
    color: '#D1D5DB',
    fontSize: '0.875rem'
  };

  // Función para obtener datos de tráfico
  const obtenerDatosTrafico = async () => {
    try {
      setCargandoTrafico(true);
      const response = await fetch('http://localhost:5000/api/simulacion-trafico');
      if (!response.ok) {
        throw new Error('Error al obtener datos de tráfico');
      }
      const datos = await response.json();
      setDatosTrafico(datos);
    } catch (err) {
      setError('Error al cargar datos de tráfico: ' + err.message);
      console.error('Error:', err);
    } finally {
      setCargandoTrafico(false);
    }
  };

  // Función para obtener datos de clima
  const obtenerDatosClima = async () => {
    try {
      setCargandoClima(true);
      const response = await fetch('http://localhost:5000/api/simulacion-clima');
      if (!response.ok) {
        throw new Error('Error al obtener datos de clima');
      }
      const datos = await response.json();
      setDatosClima(datos);
    } catch (err) {
      setError('Error al cargar datos de clima: ' + err.message);
      console.error('Error:', err);
    } finally {
      setCargandoClima(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerDatosTrafico();
    obtenerDatosClima();
  }, []);

  // Estadísticas calculadas
  const stats = [
    { 
      label: 'Carreteras Monitoreadas', 
      value: 'Ruta 5 Sur', 
      icon: Map,
      color: '#8B5CF6'
    },
    { 
      label: 'Registros de Tráfico', 
      value: datosTrafico.length.toString(), 
      icon: Car,
      color: '#06B6D4'
    },
    { 
      label: 'Registros de Clima', 
      value: datosClima.length.toString(), 
      icon: Cloud,
      color: '#10B981'
    },
    { 
      label: 'Alertas Activas', 
      value: '12', 
      icon: AlertTriangle,
      color: '#F59E0B'
    }
  ];

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-CL');
    } catch {
      return fecha;
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return 'N/A';
    return hora;
  };

  const getIconoClima = (tipoClima) => {
    switch (tipoClima) {
      case 'Soleado': return <Sun size={16} color="#F59E0B" />;
      case 'Lluvia': return <Droplets size={16} color="#06B6D4" />;
      case 'Nublado': return <Cloud size={16} color="#6B7280" />;
      case 'Tormenta': return <Cloud size={16} color="#7C3AED" />;
      case 'Nieve': return <Cloud size={16} color="#E5E7EB" />;
      default: return <Cloud size={16} color="#9CA3AF" />;
    }
  };

  const getColorIntensidad = (intensidad) => {
    switch (intensidad) {
      case 'Baja': return '#10B981';
      case 'Media': return '#F59E0B';
      case 'Alta': return '#EF4444';
      case 'Extrema': return '#7C2D12';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)', padding: '2rem' }}>
      {/* Header */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>Sistema de Predicción de Carreteras</h1>
        <p style={subtitleStyle}>
          Panel de control para monitoreo de sedimentación y estado de carreteras
        </p>
        
        {/* Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(17, 24, 39, 0.6)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                className="stat-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: stat.color,
                    marginBottom: '0.5rem'
                  }}>{stat.value}</div>
                  <IconComponent size={24} color={stat.color} />
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={buttonStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Map size={20} />
            Ver Mapa
          </button>
          <button
            style={buttonStyle}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <BarChart3 size={20} />
            Análisis
          </button>
          <button
            style={buttonStyle}
            onClick={() => { obtenerDatosTrafico(); obtenerDatosClima(); }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Database size={20} />
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* Sección de Datos Históricos */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={28} color="#A855F7" />
          Datos Históricos
        </h2>
        
        {/* Filtros */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              style={{
                ...buttonStyle,
                background: filtroActivo === 'todos' ? 'linear-gradient(90deg, #8B5CF6, #7C3AED)' : 'rgba(75, 85, 99, 0.5)',
              }}
              onClick={() => setFiltroActivo('todos')}
            >
              Todos
            </button>
            <button
              style={{
                ...buttonStyle,
                background: filtroActivo === 'trafico' ? 'linear-gradient(90deg, #06B6D4, #0891B2)' : 'rgba(75, 85, 99, 0.5)',
              }}
              onClick={() => setFiltroActivo('trafico')}
            >
              <Car size={16} />
              Tráfico
            </button>
            <button
              style={{
                ...buttonStyle,
                background: filtroActivo === 'clima' ? 'linear-gradient(90deg, #10B981, #059669)' : 'rgba(75, 85, 99, 0.5)',
              }}
              onClick={() => setFiltroActivo('clima')}
            >
              <Cloud size={16} />
              Clima
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#EF4444', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Tabla de Datos de Tráfico */}
        {(filtroActivo === 'todos' || filtroActivo === 'trafico') && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ 
              color: '#06B6D4', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Truck size={20} />
              Registros de Tráfico ({datosTrafico.length})
            </h3>
            
            {cargandoTrafico ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                Cargando datos de tráfico...
              </div>
            ) : (
              <div style={{ 
                overflowX: 'auto',
                backgroundColor: 'rgba(17, 24, 39, 0.6)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Fecha</th>
                      <th style={thStyle}>Hora</th>
                      <th style={thStyle}>Tipo Vehículo</th>
                      <th style={thStyle}>Categoría</th>
                      <th style={thStyle}>Peaje</th>
                      <th style={thStyle}>Ubicación (KM)</th>
                      <th style={thStyle}>Ejes</th>
                      <th style={thStyle}>Peso (kg)</th>
                      <th style={thStyle}>Tarifa</th>
                      <th style={thStyle}>Sentido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosTrafico.slice(0, 10).map((registro, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{formatearFecha(registro.fecha)}</td>
                        <td style={tdStyle}>{formatearHora(registro.hora)}</td>
                        <td style={tdStyle}>{registro.tipoVehiculo}</td>
                        <td style={tdStyle}>
                          <span style={{
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            color: '#A855F7',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {registro.categoria}
                          </span>
                        </td>
                        <td style={tdStyle}>{registro.peaje}</td>
                        <td style={tdStyle}>{registro.ubicacionKm}</td>
                        <td style={tdStyle}>{registro.ejes || 'N/A'}</td>
                        <td style={tdStyle}>{registro.pesoPromedio?.toLocaleString()}</td>
                        <td style={tdStyle}>${registro.tarifa?.toLocaleString()}</td>
                        <td style={tdStyle}>{registro.sentido}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {datosTrafico.length > 10 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#9CA3AF' }}>
                    Mostrando 10 de {datosTrafico.length} registros
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tabla de Datos de Clima */}
        {(filtroActivo === 'todos' || filtroActivo === 'clima') && (
          <div>
            <h3 style={{ 
              color: '#10B981', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Cloud size={20} />
              Registros de Clima ({datosClima.length})
            </h3>
            
            {cargandoClima ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                Cargando datos de clima...
              </div>
            ) : (
              <div style={{ 
                overflowX: 'auto',
                backgroundColor: 'rgba(17, 24, 39, 0.6)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Fecha</th>
                      <th style={thStyle}>Tipo Clima</th>
                      <th style={thStyle}>Intensidad</th>
                      <th style={thStyle}>Ubicación</th>
                      <th style={thStyle}>KM</th>
                      <th style={thStyle}>Temperatura</th>
                      <th style={thStyle}>Humedad</th>
                      <th style={thStyle}>Viento</th>
                      <th style={thStyle}>Desgaste</th>
                      <th style={thStyle}>Eventos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosClima.slice(0, 10).map((registro, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{formatearFecha(registro.fecha)}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getIconoClima(registro.tipoClima)}
                            {registro.tipoClima}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            backgroundColor: `${getColorIntensidad(registro.intensidad)}20`,
                            color: getColorIntensidad(registro.intensidad),
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {registro.intensidad}
                          </span>
                        </td>
                        <td style={tdStyle}>{registro.ubicacion}</td>
                        <td style={tdStyle}>{registro.ubicacionKm}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Thermometer size={12} />
                            {registro.temperatura}°C
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Droplets size={12} />
                            {registro.humedad}%
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Wind size={12} />
                            {registro.viento?.velocidad} km/h
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            backgroundColor: registro.desgasteEstimado > 7 ? 'rgba(239, 68, 68, 0.2)' : 
                                           registro.desgasteEstimado > 4 ? 'rgba(245, 158, 11, 0.2)' : 
                                           'rgba(16, 185, 129, 0.2)',
                            color: registro.desgasteEstimado > 7 ? '#EF4444' : 
                                   registro.desgasteEstimado > 4 ? '#F59E0B' : 
                                   '#10B981',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {registro.desgasteEstimado}/10
                          </span>
                        </td>
                        <td style={tdStyle}>{registro.eventosCatastroficos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {datosClima.length > 10 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#9CA3AF' }}>
                    Mostrando 10 de {datosClima.length} registros
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mensaje si no hay datos */}
        {!cargandoTrafico && !cargandoClima && datosTrafico.length === 0 && datosClima.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#9CA3AF',
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <Database size={48} color="#6B7280" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>No hay datos disponibles</h3>
            <p>Los datos históricos aparecerán aquí una vez que se registren simulaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;