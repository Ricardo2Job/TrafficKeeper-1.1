import React, { useState, useEffect } from 'react';
import { Car, Truck, Bus, TrendingUp, TrendingDown, Activity, Clock, BarChart3, PieChart, MapPin, AlertTriangle, RefreshCw, Bike, Calendar } from 'lucide-react';

const FlujoVehicular = ({ profileData, configData }) => {
  const [datosTrafico, setDatosTrafico] = useState([]);
  const [datosClima, setDatosClima] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);

  // Datos calculados dinámicamente
  const [vehicleData, setVehicleData] = useState({
    total: 0,
    cars: 0,
    trucks: 0,
    buses: 0,
    motorcycles: 0,
    hourlyFlow: 0,
    trend: 'up',
    percentage: 0
  });

  const [hourlyData, setHourlyData] = useState([]);
  const [zones, setZones] = useState([]);
  const [realTimeData, setRealTimeData] = useState([]);

  // Solo cargar datos cuando cambien las fechas o el rango de tiempo
  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin, selectedTimeRange]);

  // ELIMINADO: El useEffect que actualizaba automáticamente cada 30 segundos

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [traficoRes, climaRes] = await Promise.all([
        fetch('http://localhost:5000/api/simulacion-trafico'),
        fetch('http://localhost:5000/api/simulacion-clima')
      ]);

      const trafico = await traficoRes.json();
      const clima = await climaRes.json();

      // Filtrar datos según el rango seleccionado
      const ahora = new Date();
      let fechaLimite;
      
      switch (selectedTimeRange) {
        case 'today':
          fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).toISOString().split('T')[0];
          break;
        case 'week':
          fechaLimite = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        case 'month':
          fechaLimite = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          break;
        default:
          fechaLimite = fechaInicio;
      }

      const traficoFiltrado = trafico.filter(item => {
        const fechaItem = item.fecha ? item.fecha.split('T')[0] : new Date().toISOString().split('T')[0];
        return selectedTimeRange === 'custom' ? 
          (fechaItem >= fechaInicio && fechaItem <= fechaFin) :
          fechaItem >= fechaLimite;
      });

      const climaFiltrado = clima.filter(item => {
        const fechaItem = item.fecha ? item.fecha.split('T')[0] : new Date().toISOString().split('T')[0];
        return selectedTimeRange === 'custom' ? 
          (fechaItem >= fechaInicio && fechaItem <= fechaFin) :
          fechaItem >= fechaLimite;
      });

      setDatosTrafico(traficoFiltrado);
      setDatosClima(climaFiltrado);
      
      // Calcular métricas dinámicas
      calcularMetricas(traficoFiltrado, climaFiltrado);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularMetricas = (trafico, clima) => {
    // Mapeo de categorías a tipos de vehículos
    const categorias = trafico.reduce((acc, item) => {
      acc[item.categoria] = (acc[item.categoria] || 0) + 1;
      return acc;
    }, {});

    // Calcular totales por tipo
    const cars = (categorias.auto || 0) + (categorias.remolque || 0);
    const trucks = (categorias.camiones2 || 0) + (categorias.camiones3 || 0);
    const buses = (categorias.buses2 || 0) + (categorias.buses3 || 0);
    const motorcycles = categorias.moto || 0;
    const total = cars + trucks + buses + motorcycles;

    // Calcular flujo por hora (promedio)
    const diasEnRango = selectedTimeRange === 'today' ? 1 : 
                      selectedTimeRange === 'week' ? 7 : 
                      selectedTimeRange === 'month' ? 30 : 7;
    const hourlyFlow = Math.round(total / (diasEnRango * 24));

    // Calcular tendencia comparando con período anterior
    const tendenciaPorcentaje = Math.random() * 20 - 10; // Simulado por ahora
    
    setVehicleData({
      total,
      cars,
      trucks,
      buses,
      motorcycles,
      hourlyFlow,
      trend: tendenciaPorcentaje > 0 ? 'up' : 'down',
      percentage: Math.abs(tendenciaPorcentaje).toFixed(1)
    });

    // Calcular datos por horas
    calcularDatosHorarios(trafico);
    
    // Calcular datos por zonas (peajes)
    calcularDatosPorZonas(trafico);
    
    // Calcular datos en tiempo real
    calcularDatosEnTiempoReal(trafico, clima);
  };

  const calcularDatosHorarios = (trafico) => {
    const horas = {};
    
    trafico.forEach(item => {
      const hora = item.hora ? parseInt(item.hora.split(':')[0]) : 12;
      const rangoHora = Math.floor(hora / 6) * 6; // Agrupar en rangos de 6 horas
      horas[rangoHora] = (horas[rangoHora] || 0) + 1;
    });

    const horasFormateadas = [0, 6, 12, 18].map(h => {
      const count = horas[h] || 0;
      return {
        hour: `${h.toString().padStart(2, '0')}:00`,
        count,
        peak: count > (Math.max(...Object.values(horas)) * 0.7)
      };
    });

    setHourlyData(horasFormateadas);
  };

  const calcularDatosPorZonas = (trafico) => {
    const peajes = [
      'Peaje Angostura',
      'Peaje Troncal Quinta', 
      'Peaje Troncal Río Claro',
      'Peaje Troncal Retiro',
      'Peaje Troncal Santa Clara'
    ];

    const zonas = peajes.map((peaje, index) => {
      const vehiculosEnPeaje = trafico.filter(item => item.peaje === peaje).length;
      const capacidadBase = 1000 + (index * 500);
      const percentage = Math.min(100, Math.round((vehiculosEnPeaje / capacidadBase) * 100));
      
      return {
        id: index + 1,
        name: peaje.replace('Peaje ', '').replace('Troncal ', ''),
        vehicles: vehiculosEnPeaje,
        capacity: capacidadBase,
        percentage
      };
    });

    setZones(zonas);
  };

  const calcularDatosEnTiempoReal = (trafico, clima) => {
    const peajesUnicos = [...new Set(trafico.map(item => item.peaje))];
    
    const datosEnTiempoReal = peajesUnicos.slice(0, 6).map(peaje => {
      const vehiculosEnPeaje = trafico.filter(item => item.peaje === peaje);
      const flow = vehiculosEnPeaje.length;
      
      // Calcular velocidad promedio basada en el tipo de vehículos
      const velocidadPromedio = vehiculosEnPeaje.reduce((acc, item) => {
        const velocidadBase = item.categoria === 'moto' ? 45 :
                             item.categoria === 'auto' ? 60 :
                             item.categoria === 'remolque' ? 50 :
                             item.categoria.includes('bus') ? 40 :
                             item.categoria.includes('camion') ? 35 : 50;
        return acc + velocidadBase;
      }, 0) / (vehiculosEnPeaje.length || 1);

      // Determinar estado basado en flujo y clima
      const climaEnPeaje = clima.find(c => c.ubicacion === peaje);
      let status = 'normal';
      
      if (flow > 15) status = 'congested';
      else if (flow > 8) status = 'slow';
      else if (velocidadPromedio > 55) status = 'fast';
      
      if (climaEnPeaje && ['Tormenta', 'Lluvia', 'Nieve'].includes(climaEnPeaje.tipoClima)) {
        status = flow > 5 ? 'congested' : 'slow';
      }

      return {
        street: peaje.replace('Peaje ', '').replace('Troncal ', ''),
        flow,
        speed: Math.round(velocidadPromedio),
        status
      };
    });

    setRealTimeData(datosEnTiempoReal);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return '#22C55E';
      case 'slow': return '#F59E0B';
      case 'fast': return '#3B82F6';
      case 'congested': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'slow': return 'Lento';
      case 'fast': return 'Rápido';
      case 'congested': return 'Congestionado';
      default: return 'Desconocido';
    }
  };

  // Estilos
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

  const statCardStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
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
    gap: '0.5rem'
  };

  const selectStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '0.5rem',
    color: 'white',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem'
  };

  const vehicleTypes = [
    { type: 'cars', label: 'Automóviles', icon: Car, count: vehicleData.cars, color: '#8B5CF6' },
    { type: 'trucks', label: 'Camiones', icon: Truck, count: vehicleData.trucks, color: '#F59E0B' },
    { type: 'buses', label: 'Autobuses', icon: Bus, count: vehicleData.buses, color: '#10B981' },
    { type: 'motorcycles', label: 'Motocicletas', icon: Bike, count: vehicleData.motorcycles, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Activity size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando datos de flujo vehicular...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header con estadísticas principales */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={titleStyle}>🚗 Flujo Vehicular</h1>
            <p style={subtitleStyle}>
              Monitoreo del tráfico vehicular - {datosTrafico.length} registros
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              style={selectStyle}
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="custom">Personalizado</option>
            </select>
            
            {selectedTimeRange === 'custom' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  style={{ ...selectStyle, width: '140px' }}
                />
                <span style={{ color: '#9ca3af' }}>a</span>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  style={{ ...selectStyle, width: '140px' }}
                />
              </div>
            )}
            
            <button 
              style={buttonStyle} 
              onClick={cargarDatos}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#A855F7' }}>
                  {vehicleData.total.toLocaleString()}
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Total Vehículos</div>
              </div>
              <Activity size={32} color="#A855F7" />
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22C55E' }}>
                  {vehicleData.hourlyFlow.toLocaleString()}
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Flujo por Hora</div>
              </div>
              <Clock size={32} color="#22C55E" />
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: vehicleData.trend === 'up' ? '#22C55E' : '#EF4444' }}>
                    {vehicleData.percentage}%
                  </span>
                  {vehicleData.trend === 'up' ? 
                    <TrendingUp size={20} color="#22C55E" /> : 
                    <TrendingDown size={20} color="#EF4444" />
                  }
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Tendencia</div>
              </div>
              <BarChart3 size={32} color={vehicleData.trend === 'up' ? '#22C55E' : '#EF4444'} />
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F59E0B' }}>
                  {lastUpdate.toLocaleTimeString()}
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Última Actualización</div>
              </div>
              <RefreshCw size={32} color="#F59E0B" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribución por tipo de vehículo */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>📊 Distribución por Tipo de Vehículo</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {vehicleTypes.map((vehicle) => {
            const IconComponent = vehicle.icon;
            const percentage = vehicleData.total > 0 ? ((vehicle.count / vehicleData.total) * 100).toFixed(1) : 0;
            
            return (
              <div key={vehicle.type} style={{
                ...statCardStyle,
                background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.4) 100%)`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <IconComponent size={28} color={vehicle.color} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: vehicle.color }}>
                    {vehicle.count.toLocaleString()}
                  </div>
                </div>
                <div style={{ color: '#D1D5DB', marginBottom: '0.5rem' }}>{vehicle.label}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{percentage}% del total</div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'rgba(75, 85, 99, 0.3)',
                  borderRadius: '2px',
                  marginTop: '1rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: vehicle.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flujo por zonas */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>🗺️ Flujo por Peajes</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {zones.map((zone) => (
            <div key={zone.id} style={{
              ...statCardStyle,
              background: 'rgba(17, 24, 39, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} color="#A855F7" />
                  <span style={{ color: '#D1D5DB', fontWeight: '600' }}>{zone.name}</span>
                </div>
                <span style={{ 
                  color: zone.percentage > 80 ? '#EF4444' : zone.percentage > 60 ? '#F59E0B' : '#22C55E',
                  fontWeight: 'bold'
                }}>
                  {zone.percentage}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#9CA3AF' }}>Vehículos:</span>
                <span style={{ color: '#D1D5DB', fontWeight: '600' }}>{zone.vehicles.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#9CA3AF' }}>Capacidad est.:</span>
                <span style={{ color: '#D1D5DB', fontWeight: '600' }}>{zone.capacity.toLocaleString()}</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(75, 85, 99, 0.3)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, zone.percentage)}%`,
                  height: '100%',
                  backgroundColor: zone.percentage > 80 ? '#EF4444' : zone.percentage > 60 ? '#F59E0B' : '#22C55E',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitoreo en tiempo real */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>⚡ Estado de Peajes</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Peaje</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Vehículos</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Vel. Promedio</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {realTimeData.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.2)' }}>
                  <td style={{ padding: '1rem', color: '#D1D5DB' }}>{item.street}</td>
                  <td style={{ padding: '1rem', color: '#D1D5DB', fontWeight: '600' }}>{item.flow}</td>
                  <td style={{ padding: '1rem', color: '#D1D5DB', fontWeight: '600' }}>{item.speed} km/h</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: `${getStatusColor(item.status)}20`,
                      color: getStatusColor(item.status),
                      border: `1px solid ${getStatusColor(item.status)}40`
                    }}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {realTimeData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
            No hay datos disponibles para el período seleccionado
          </div>
        )}
      </div>

      {/* Gráfico de flujo por horas */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>📈 Distribución de Flujo por Horarios</h2>
        <div style={{
          display: 'flex',
          alignItems: 'end',
          gap: '1rem',
          height: '200px',
          marginTop: '2rem',
          justifyContent: 'center'
        }}>
          {hourlyData.map((item, index) => {
            const maxCount = Math.max(...hourlyData.map(d => d.count), 1);
            const height = (item.count / maxCount) * 150;
            
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '100px'
              }}>
                <div style={{
                  width: '60px',
                  height: `${Math.max(height, 10)}px`,
                  backgroundColor: item.peak ? '#A855F7' : '#6B7280',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  {item.peak && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px'
                    }}>⭐</div>
                  )}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  {item.hour}
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.875rem', fontWeight: '600' }}>
                  {item.count}
                </div>
              </div>
            );
          })}
        </div>
        
        {hourlyData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
            No hay suficientes datos para mostrar la distribución horaria
          </div>
        )}
      </div>
    </div>
  );
};

export default FlujoVehicular;