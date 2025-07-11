import React from 'react';
import { Map, AlertTriangle, BarChart3, Car, Target, Zap, Shield, TrendingUp, Brain, Database, Settings, CheckCircle } from 'lucide-react';

const MasInformacion = () => {
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
    fontSize: '1.1rem',
    lineHeight: '1.6'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const textStyle = {
    color: '#D1D5DB',
    lineHeight: '1.7',
    marginBottom: '1rem'
  };

  const highlightStyle = {
    color: '#A855F7',
    fontWeight: '600'
  };

  const featureCardStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    height: '100%'
  };

  const features = [
    {
      icon: Brain,
      title: 'Análisis Predictivo',
      description: 'Modelos avanzados de machine learning para predecir el deterioro de carreteras antes de que ocurra.'
    },
    {
      icon: Database,
      title: 'Integración de Datos',
      description: 'Recolección y análisis de datos de múltiples fuentes para decisiones informadas.'
    },
    {
      icon: Shield,
      title: 'Seguridad Vial',
      description: 'Detección temprana de problemas para prevenir accidentes y mejorar la seguridad.'
    },
    {
      icon: TrendingUp,
      title: 'Optimización',
      description: 'Reducción de costos de mantenimiento mediante intervenciones proactivas.'
    }
  ];

  const benefits = [
    'Reducción potencial de costos de mantenimiento',
    'Mejora significativa en la seguridad vial',
    'Detección temprana de problemas estructurales',
    'Optimización de recursos y planificación',
    'Gestión proactiva vs. reactiva',
    'Sostenibilidad en la gestión vial'
  ];

  const technologies = [
    { name: 'Inteligencia Artificial', desc: 'Modelos de aprendizaje automático' },
    { name: 'Análisis Estadístico', desc: 'Procesamiento de datos históricos' },
    { name: 'Sensores IoT', desc: 'Monitoreo en tiempo real' },
    { name: 'Metodología Scrum', desc: 'Desarrollo iterativo y adaptativo' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)', padding: '2rem' }}>
      {/* Header */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>TrafficKeeper</h1>
        <p style={subtitleStyle}>
          Plataforma de análisis predictivo para la gestión moderna y sostenible de carreteras en Chile
        </p>
      </div>

      {/* Problema y Solución */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          <Target size={24} color="#A855F7" />
          El Desafío
        </h2>
        <p style={textStyle}>
          Las infraestructuras viales en Chile enfrentan desafíos significativos debido a la creciente demanda de transporte y condiciones climáticas variables. La gestión proactiva de carreteras se ve limitada por la <span style={highlightStyle}>falta de herramientas predictivas avanzadas</span>, lo que genera costosos trabajos de reparación y riesgos para la seguridad vial.
        </p>
        <p style={textStyle}>
          Según el Ministerio de Obras Públicas de Chile, la ausencia de un enfoque predictivo contribuye al deterioro prematuro y a reparaciones urgentes que podrían evitarse con una mejor planificación.
        </p>
      </div>

      {/* Características Principales */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          <Zap size={24} color="#A855F7" />
          Características Principales
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                style={featureCardStyle}
                className="feature-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <IconComponent size={28} color="#A855F7" />
                  <h3 style={{ color: 'white', marginLeft: '0.75rem', fontWeight: '600' }}>{feature.title}</h3>
                </div>
                <p style={{ color: '#D1D5DB', fontSize: '0.9rem', lineHeight: '1.5' }}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Beneficios */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          <CheckCircle size={24} color="#A855F7" />
          Beneficios Clave
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          {benefits.map((benefit, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <CheckCircle size={20} color="#22C55E" />
              <span style={{ color: '#D1D5DB', fontSize: '0.95rem' }}>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tecnologías */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          <Settings size={24} color="#A855F7" />
          Tecnologías Utilizadas
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>
          {technologies.map((tech, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              textAlign: 'center',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3 style={{ color: '#A855F7', fontWeight: '600', marginBottom: '0.5rem' }}>{tech.name}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impacto y Futuro */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          <TrendingUp size={24} color="#A855F7" />
          Impacto y Proyecciones
        </h2>
        <p style={textStyle}>
          TrafficKeeper demostró su capacidad para proporcionar <span style={highlightStyle}>datos predictivos basados en información histórica y en tiempo real</span>, permitiendo la detección temprana de problemas y la optimización de recursos.
        </p>
        <p style={textStyle}>
          Los resultados preliminares indican una reducción potencial en los costos de mantenimiento y una mejora en la seguridad vial, al anticipar y abordar problemas antes de que se agraven.
        </p>
        <div style={{
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ color: '#A855F7', fontWeight: '600', marginBottom: '0.75rem' }}>Próximos Pasos</h3>
          <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Se recomienda explorar la integración de tecnologías emergentes, como <span style={highlightStyle}>inteligencia artificial avanzada</span> y <span style={highlightStyle}>análisis de imágenes en tiempo real</span>, para ampliar las capacidades predictivas del sistema.
          </p>
        </div>
      </div>

      {/* Palabras Clave */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          <Database size={24} color="#A855F7" />
          Palabras Clave
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          {['análisis predictivo', 'gestión vial', 'mantenimiento proactivo', 'seguridad vial', 'sostenibilidad'].map((keyword, index) => (
            <span key={index} style={{
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: '#A855F7',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasInformacion;