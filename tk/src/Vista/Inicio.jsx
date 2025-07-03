import React from 'react';
import { Map, AlertTriangle, BarChart3, Car } from 'lucide-react';

const Inicio = ({ profileData, configData }) => {
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
    gap: '0.5rem'
  };

  const stats = [
    { label: 'Carreteras Monitoreadas', value: '245', icon: Map },
    { label: 'Alertas Activas', value: '12', icon: AlertTriangle },
    { label: 'Sensores Activos', value: '1,340', icon: BarChart3 },
    { label: 'Condición Promedio', value: '85%', icon: Car }
  ];

  return (
    <div>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Sistema de Predicción de Carreteras</h1>
        <p style={subtitleStyle}>
          Panel de control para monitoreo de sedimentación y estado de carreteras
        </p>
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
                    color: '#A855F7',
                    marginBottom: '0.5rem'
                  }}>{stat.value}</div>
                  <IconComponent size={24} color="#A855F7" />
                </div>
                <div style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
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
        </div>
      </div>
      <div style={cardStyle}>
        <h2 style={{ ...titleStyle, fontSize: '1.5rem' }}>Alertas Recientes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['Sedimentación alta en KM 45', 'Condiciones climáticas adversas', 'Sensor desconectado en Ruta 202'].map((alert, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <AlertTriangle size={20} color="#EF4444" />
              <span style={{ color: '#D1D5DB', flex: 1 }}>{alert}</span>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Hace {index + 1}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inicio;