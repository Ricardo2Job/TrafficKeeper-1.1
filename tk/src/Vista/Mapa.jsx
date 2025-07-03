import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, AlertTriangle, Search, Settings, Layers } from 'lucide-react';

const Mapa = ({ profileData, configData }) => {
  const [selectedLayer, setSelectedLayer] = useState('traffic');
  const [searchQuery, setSearchQuery] = useState('');
  const [incidents, setIncidents] = useState([
    { id: 1, type: 'accident', location: 'Av. Libertador con Calle 5', severity: 'high', time: '12:30' },
    { id: 2, type: 'roadwork', location: 'Calle Principal altura 200', severity: 'medium', time: '10:15' },
    { id: 3, type: 'closure', location: 'Puente San Martín', severity: 'high', time: '08:45' }
  ]);

  const [zones, setZones] = useState([
    { id: 1, name: 'Centro', traffic: 'high', incidents: 3 },
    { id: 2, name: 'Norte', traffic: 'medium', incidents: 1 },
    { id: 3, name: 'Sur', traffic: 'low', incidents: 0 },
    { id: 4, name: 'Este', traffic: 'medium', incidents: 2 }
  ]);

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

  const getTrafficColor = (level) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'accident': return <AlertTriangle size={20} color="#EF4444" />;
      case 'roadwork': return <Settings size={20} color="#F59E0B" />;
      case 'closure': return <Zap size={20} color="#DC2626" />;
      default: return <AlertTriangle size={20} color="#6B7280" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Mapa de Tráfico</h1>
        <p style={subtitleStyle}>
          Visualización en tiempo real del estado del tráfico y incidentes
        </p>
        
        {/* Controles del mapa */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            flex: '1',
            minWidth: '200px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Search size={20} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Buscar ubicación</span>
            </div>
            <input
              type="text"
              placeholder="Ingrese dirección o punto de interés"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Layers size={20} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Capas</span>
            </div>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: '0.875rem'
              }}
            >
              <option value="traffic">Tráfico</option>
              <option value="incidents">Incidentes</option>
              <option value="cameras">Cámaras</option>
              <option value="public_transport">Transporte Público</option>
            </select>
          </div>
        </div>

        {/* Mapa simulado */}
        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          height: '400px',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Simulación de mapa */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#9CA3AF'
          }}>
            <MapPin size={48} style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Mapa Interactivo
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Visualización del tráfico en tiempo real
            </p>
          </div>

          {/* Controles de navegación */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <button style={{
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '0.375rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}>
              <Navigation size={20} />
            </button>
            <button style={{
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '0.375rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}>
              +
            </button>
            <button style={{
              backgroundColor: 'rgba(31, 41, 55, 0.9)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '0.375rem',
              padding: '0.5rem',
              color: 'white',
              cursor: 'pointer'
            }}>
              -
            </button>
          </div>
        </div>

        {/* Información de zonas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {zones.map((zone) => (
            <div key={zone.id} style={{
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1rem',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              borderLeft: `4px solid ${getTrafficColor(zone.traffic)}`
            }}>
              <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {zone.name}
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Tráfico</p>
                  <p style={{ color: getTrafficColor(zone.traffic), fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {zone.traffic === 'high' ? 'Alto' : zone.traffic === 'medium' ? 'Medio' : 'Bajo'}
                  </p>
                </div>
                <div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Incidentes</p>
                  <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {zone.incidents}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de incidentes */}
        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid rgba(75, 85, 99, 0.3)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Incidentes Activos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {incidents.map((incident) => (
              <div key={incident.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(75, 85, 99, 0.2)',
                borderLeft: `4px solid ${getSeverityColor(incident.severity)}`
              }}>
                <div style={{ flexShrink: 0 }}>
                  {getIncidentIcon(incident.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {incident.location}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                    {incident.type === 'accident' ? 'Accidente' : 
                     incident.type === 'roadwork' ? 'Obra vial' : 
                     incident.type === 'closure' ? 'Cierre' : 'Incidente'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: getSeverityColor(incident.severity), fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {incident.severity === 'high' ? 'Alto' : incident.severity === 'medium' ? 'Medio' : 'Bajo'}
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                    {incident.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;