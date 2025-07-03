import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Compass } from 'lucide-react';

const Clima = ({ profileData, configData }) => {
  const [weatherData, setWeatherData] = useState({
    temperatura: 18,
    sensacionTermica: 16,
    humedad: 65,
    viento: 12,
    direccionViento: 'NO',
    visibilidad: 10,
    presion: 1013,
    condicion: 'Nublado',
    precipitacion: 0,
    indiceUV: 3
  });

  const [forecast, setForecast] = useState([
    { dia: 'Hoy', temp: 18, condicion: 'Nublado', icono: Cloud },
    { dia: 'Mañana', temp: 22, condicion: 'Soleado', icono: Sun },
    { dia: 'Miércoles', temp: 15, condicion: 'Lluvioso', icono: CloudRain },
    { dia: 'Jueves', temp: 20, condicion: 'Parcialmente nublado', icono: Cloud },
    { dia: 'Viernes', temp: 24, condicion: 'Soleado', icono: Sun }
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

  const weatherIconStyle = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  };

  const getWeatherIcon = (condicion) => {
    switch (condicion.toLowerCase()) {
      case 'soleado':
        return <Sun size={40} />;
      case 'lluvioso':
        return <CloudRain size={40} />;
      case 'nublado':
      case 'parcialmente nublado':
        return <Cloud size={40} />;
      default:
        return <Cloud size={40} />;
    }
  };

  const getWeatherColor = (condicion) => {
    switch (condicion.toLowerCase()) {
      case 'soleado':
        return 'linear-gradient(135deg, #F59E0B, #F97316)';
      case 'lluvioso':
        return 'linear-gradient(135deg, #3B82F6, #1E40AF)';
      case 'nublado':
      case 'parcialmente nublado':
        return 'linear-gradient(135deg, #6B7280, #4B5563)';
      default:
        return 'linear-gradient(135deg, #8B5CF6, #A855F7)';
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Condiciones Climáticas</h1>
        <p style={subtitleStyle}>
          Monitoreo en tiempo real de las condiciones meteorológicas
        </p>
        
        {/* Clima actual */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              ...weatherIconStyle,
              background: getWeatherColor(weatherData.condicion)
            }}>
              {getWeatherIcon(weatherData.condicion)}
            </div>
            <div style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold', marginTop: '1rem' }}>
              {weatherData.temperatura}°C
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
              {weatherData.condicion}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Sensación térmica: {weatherData.sensacionTermica}°C
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(75, 85, 99, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Droplets size={20} color="#3B82F6" />
                <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Humedad</span>
              </div>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {weatherData.humedad}%
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(75, 85, 99, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Wind size={20} color="#10B981" />
                <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Viento</span>
              </div>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {weatherData.viento} km/h
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                {weatherData.direccionViento}
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(75, 85, 99, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Eye size={20} color="#F59E0B" />
                <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Visibilidad</span>
              </div>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {weatherData.visibilidad} km
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(75, 85, 99, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Thermometer size={20} color="#EF4444" />
                <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Presión</span>
              </div>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {weatherData.presion} hPa
              </div>
            </div>
          </div>
        </div>

        {/* Pronóstico */}
        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid rgba(75, 85, 99, 0.3)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Pronóstico de 5 días
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {forecast.map((day, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(75, 85, 99, 0.2)'
              }}>
                <div style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {day.dia}
                </div>
                <div style={{ 
                  color: 'white', 
                  marginBottom: '0.5rem',
                  background: getWeatherColor(day.condicion),
                  borderRadius: '50%',
                  padding: '0.5rem',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getWeatherIcon(day.condicion)}
                </div>
                <div style={{ color: 'white', fontSize: '1.125rem', fontWeight: 'bold' }}>
                  {day.temp}°C
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {day.condicion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CloudRain size={20} color="#3B82F6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Precipitación</span>
            </div>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {weatherData.precipitacion} mm
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sun size={20} color="#F59E0B" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Índice UV</span>
            </div>
            <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {weatherData.indiceUV}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
              {weatherData.indiceUV <= 2 ? 'Bajo' : 
               weatherData.indiceUV <= 5 ? 'Moderado' : 
               weatherData.indiceUV <= 7 ? 'Alto' : 'Muy Alto'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clima;