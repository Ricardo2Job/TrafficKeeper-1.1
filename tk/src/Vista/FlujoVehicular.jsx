import React, { useState, useEffect } from 'react';
import { Car, Truck, Bus, TrendingUp, TrendingDown, Activity, Clock, BarChart3, PieChart, MapPin, AlertTriangle, RefreshCw, Bike } from 'lucide-react';

const FlujoVehicular = ({ profileData, configData }) => {
  const [vehicleData, setVehicleData] = useState({
    total: 12547,
    cars: 8934,
    trucks: 1876,
    buses: 543,
    motorcycles: 1194,
    hourlyFlow: 2341,
    trend: 'up',
    percentage: 12.5
  });

  const [hourlyData, setHourlyData] = useState([
    { hour: '00:00', count: 234, peak: false },
    { hour: '06:00', count: 1567, peak: true },
    { hour: '12:00', count: 2341, peak: true },
    { hour: '18:00', count: 2876, peak: true },
    { hour: '24:00', count: 456, peak: false }
  ]);

  const [zones, setZones] = useState([
    { id: 1, name: 'Zona Centro', vehicles: 3245, capacity: 4000, percentage: 81 },
    { id: 2, name: 'Zona Norte', vehicles: 2156, capacity: 3000, percentage: 72 },
    { id: 3, name: 'Zona Sur', vehicles: 1876, capacity: 2500, percentage: 75 },
    { id: 4, name: 'Zona Este', vehicles: 3421, capacity: 4500, percentage: 76 },
    { id: 5, name: 'Zona Oeste', vehicles: 1849, capacity: 2200, percentage: 84 }
  ]);

  const [realTimeData, setRealTimeData] = useState([
    { street: 'Av. Principal', flow: 145, speed: 35, status: 'normal' },
    { street: 'Calle Central', flow: 89, speed: 25, status: 'slow' },
    { street: 'Av. Libertador', flow: 203, speed: 45, status: 'fast' },
    { street: 'Calle 5', flow: 67, speed: 15, status: 'congested' },
    { street: 'Av. San Martín', flow: 134, speed: 40, status: 'normal' },
    { street: 'Calle Norte', flow: 78, speed: 20, status: 'slow' }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulación de actualización automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (configData?.dashboard?.actualizacionAuto) {
        updateRealTimeData();
      }
    }, (configData?.dashboard?.intervaloActualizacion || 30) * 1000);

    return () => clearInterval(interval);
  }, [configData]);

  const updateRealTimeData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRealTimeData(prev => prev.map(item => ({
        ...item,
        flow: Math.floor(Math.random() * 200) + 50,
        speed: Math.floor(Math.random() * 40) + 15,
        status: getRandomStatus()
      })));
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const getRandomStatus = () => {
    const statuses = ['normal', 'slow', 'fast', 'congested'];
    return statuses[Math.floor(Math.random() * statuses.length)];
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

  return (
    <div>
      {/* Header con estadísticas principales */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={titleStyle}>Flujo Vehicular</h1>
            <p style={subtitleStyle}>
              Monitoreo en tiempo real del tráfico vehicular
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              style={selectStyle}
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
            <button 
              style={buttonStyle} 
              onClick={updateRealTimeData}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Actualizando...' : 'Actualizar'}
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
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>Distribución por Tipo de Vehículo</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {vehicleTypes.map((vehicle) => {
            const IconComponent = vehicle.icon;
            const percentage = ((vehicle.count / vehicleData.total) * 100).toFixed(1);
            
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
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>Flujo por Zonas</h2>
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
                <span style={{ color: '#9CA3AF' }}>Capacidad:</span>
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
                  width: `${zone.percentage}%`,
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
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>Monitoreo en Tiempo Real</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Vía</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Flujo (veh/h)</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Velocidad (km/h)</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#D1D5DB', fontWeight: '600' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {realTimeData.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.2)' }}>
                  <td style={{ padding: '1rem', color: '#D1D5DB' }}>{item.street}</td>
                  <td style={{ padding: '1rem', color: '#D1D5DB', fontWeight: '600' }}>{item.flow}</td>
                  <td style={{ padding: '1rem', color: '#D1D5DB', fontWeight: '600' }}>{item.speed}</td>
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
      </div>

      {/* Gráfico de flujo por horas */}
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>Flujo por Horas</h2>
        <div style={{
          display: 'flex',
          alignItems: 'end',
          gap: '1rem',
          height: '200px',
          marginTop: '2rem'
        }}>
          {hourlyData.map((item, index) => {
            const maxCount = Math.max(...hourlyData.map(d => d.count));
            const height = (item.count / maxCount) * 150;
            
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <div style={{
                  width: '40px',
                  height: `${height}px`,
                  backgroundColor: item.peak ? '#A855F7' : '#6B7280',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }} />
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  {item.hour}
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.875rem', fontWeight: '600' }}>
                  {item.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlujoVehicular;