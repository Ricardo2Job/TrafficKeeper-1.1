import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Eye, 
  Palette, 
  Globe, 
  Shield, 
  Database, 
  Refresh, 
  Download, 
  Upload,
  Save,
  RotateCcw,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Clock,
  Filter,
  BarChart3
} from 'lucide-react';

const Configuracion = () => {
  const [config, setConfig] = useState({
    // Notificaciones
    notifications: {
      email: true,
      push: true,
      alertas: true,
      reportes: false,
      sonido: true,
      vibration: true
    },
    // Interfaz
    interfaz: {
      tema: 'oscuro',
      idioma: 'es',
      animaciones: true,
      sidebar: 'expandido',
      densidad: 'media'
    },
    // Dashboard
    dashboard: {
      actualizacionAuto: true,
      intervaloActualizacion: 30,
      mostrarGraficos: true,
      mostrarAlertas: true,
      compactMode: false
    },
    // Mapa
    mapa: {
      tipoMapa: 'satelite',
      mostrarEtiquetas: true,
      animacionTrafico: true,
      zoomAutomatico: true,
      capasVisibles: ['trafico', 'clima', 'peajes']
    },
    // Datos
    datos: {
      cacheDuration: 24,
      autoSync: true,
      compresion: true,
      exportFormat: 'json'
    },
    // Privacidad
    privacidad: {
      compartirUbicacion: false,
      analiticas: true,
      cookies: true,
      historial: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Cargar configuración desde localStorage
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleConfigChange = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en localStorage
      localStorage.setItem('appConfig', JSON.stringify(config));
      setHasChanges(false);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
      // Configuración por defecto
      const defaultConfig = {
        notifications: {
          email: true,
          push: true,
          alertas: true,
          reportes: false,
          sonido: true,
          vibration: true
        },
        interfaz: {
          tema: 'oscuro',
          idioma: 'es',
          animaciones: true,
          sidebar: 'expandido',
          densidad: 'media'
        },
        dashboard: {
          actualizacionAuto: true,
          intervaloActualizacion: 30,
          mostrarGraficos: true,
          mostrarAlertas: true,
          compactMode: false
        },
        mapa: {
          tipoMapa: 'satelite',
          mostrarEtiquetas: true,
          animacionTrafico: true,
          zoomAutomatico: true,
          capasVisibles: ['trafico', 'clima', 'peajes']
        },
        datos: {
          cacheDuration: 24,
          autoSync: true,
          compresion: true,
          exportFormat: 'json'
        },
        privacidad: {
          compartirUbicacion: false,
          analiticas: true,
          cookies: true,
          historial: true
        }
      };
      setConfig(defaultConfig);
      setHasChanges(true);
    }
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'configuracion-app.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '2rem',
    marginBottom: '2rem'
  };

  const sectionStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    marginBottom: '1.5rem'
  };

  const switchStyle = (checked) => ({
    position: 'relative',
    width: '48px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: checked ? '#8B5CF6' : '#4B5563',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  });

  const switchThumbStyle = (checked) => ({
    position: 'absolute',
    top: '2px',
    left: checked ? '26px' : '2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'white',
    transition: 'left 0.2s ease'
  });

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '0.875rem'
  };

  const buttonStyle = {
    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const secondaryButtonStyle = {
    backgroundColor: 'rgba(75, 85, 99, 0.3)',
    color: '#D1D5DB',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const Switch = ({ checked, onChange, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>{label}</span>
      <div style={switchStyle(checked)} onClick={() => onChange(!checked)}>
        <div style={switchThumbStyle(checked)} />
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
            ⚙️ Configuración
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={exportConfig} style={secondaryButtonStyle}>
              <Download size={16} />
              Exportar
            </button>
            <button onClick={handleReset} style={secondaryButtonStyle}>
              <RotateCcw size={16} />
              Restaurar
            </button>
            <button 
              onClick={handleSave} 
              disabled={loading || !hasChanges}
              style={{
                ...buttonStyle,
                opacity: (loading || !hasChanges) ? 0.5 : 1
              }}
            >
              <Save size={16} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '1rem' }}>
          Personaliza la aplicación según tus preferencias
        </p>
      </div>

      {/* Notificaciones */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="#8B5CF6" />
            Notificaciones
          </h2>
          
          <Switch
            checked={config.notifications.email}
            onChange={(value) => handleConfigChange('notifications', 'email', value)}
            label="Notificaciones por correo"
          />
          <Switch
            checked={config.notifications.push}
            onChange={(value) => handleConfigChange('notifications', 'push', value)}
            label="Notificaciones push"
          />
          <Switch
            checked={config.notifications.alertas}
            onChange={(value) => handleConfigChange('notifications', 'alertas', value)}
            label="Alertas del sistema"
          />
          <Switch
            checked={config.notifications.reportes}
            onChange={(value) => handleConfigChange('notifications', 'reportes', value)}
            label="Reportes automáticos"
          />
          <Switch
            checked={config.notifications.sonido}
            onChange={(value) => handleConfigChange('notifications', 'sonido', value)}
            label="Sonidos de notificación"
          />
        </div>
      </div>

      {/* Interfaz */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} color="#8B5CF6" />
            Interfaz de Usuario
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                <Monitor size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Tema
              </label>
              <select
                value={config.interfaz.tema}
                onChange={(e) => handleConfigChange('interfaz', 'tema', e.target.value)}
                style={selectStyle}
              >
                <option value="oscuro">🌙 Oscuro</option>
                <option value="claro">☀️ Claro</option>
                <option value="auto">🔄 Automático</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                <Globe size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Idioma
              </label>
              <select
                value={config.interfaz.idioma}
                onChange={(e) => handleConfigChange('interfaz', 'idioma', e.target.value)}
                style={selectStyle}
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
                <option value="pt">🇧🇷 Português</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                <Eye size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Densidad
              </label>
              <select
                value={config.interfaz.densidad}
                onChange={(e) => handleConfigChange('interfaz', 'densidad', e.target.value)}
                style={selectStyle}
              >
                <option value="compacta">📱 Compacta</option>
                <option value="media">💻 Media</option>
                <option value="amplia">🖥️ Amplia</option>
              </select>
            </div>
          </div>

          <Switch
            checked={config.interfaz.animaciones}
            onChange={(value) => handleConfigChange('interfaz', 'animaciones', value)}
            label="Animaciones de interfaz"
          />
        </div>
      </div>

      {/* Dashboard */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} color="#8B5CF6" />
            Dashboard
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Intervalo de actualización (segundos)
            </label>
            <select
              value={config.dashboard.intervaloActualizacion}
              onChange={(e) => handleConfigChange('dashboard', 'intervaloActualizacion', parseInt(e.target.value))}
              style={selectStyle}
            >
              <option value={15}>15 segundos</option>
              <option value={30}>30 segundos</option>
              <option value={60}>1 minuto</option>
              <option value={300}>5 minutos</option>
            </select>
          </div>

          <Switch
            checked={config.dashboard.actualizacionAuto}
            onChange={(value) => handleConfigChange('dashboard', 'actualizacionAuto', value)}
            label="Actualización automática"
          />
          <Switch
            checked={config.dashboard.mostrarGraficos}
            onChange={(value) => handleConfigChange('dashboard', 'mostrarGraficos', value)}
            label="Mostrar gráficos en tiempo real"
          />
          <Switch
            checked={config.dashboard.mostrarAlertas}
            onChange={(value) => handleConfigChange('dashboard', 'mostrarAlertas', value)}
            label="Mostrar panel de alertas"
          />
          <Switch
            checked={config.dashboard.compactMode}
            onChange={(value) => handleConfigChange('dashboard', 'compactMode', value)}
            label="Modo compacto"
          />
        </div>
      </div>

      {/* Mapa */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="#8B5CF6" />
            Configuración del Mapa
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Tipo de mapa
              </label>
              <select
                value={config.mapa.tipoMapa}
                onChange={(e) => handleConfigChange('mapa', 'tipoMapa', e.target.value)}
                style={selectStyle}
              >
                <option value="satelite">🛰️ Satélite</option>
                <option value="terreno">🏔️ Terreno</option>
                <option value="carreteras">🛣️ Carreteras</option>
                <option value="hibrido">🔄 Híbrido</option>
              </select>
            </div>
          </div>

          <Switch
            checked={config.mapa.mostrarEtiquetas}
            onChange={(value) => handleConfigChange('mapa', 'mostrarEtiquetas', value)}
            label="Mostrar etiquetas de lugares"
          />
          <Switch
            checked={config.mapa.animacionTrafico}
            onChange={(value) => handleConfigChange('mapa', 'animacionTrafico', value)}
            label="Animaciones de tráfico"
          />
          <Switch
            checked={config.mapa.zoomAutomatico}
            onChange={(value) => handleConfigChange('mapa', 'zoomAutomatico', value)}
            label="Zoom automático en alertas"
          />
        </div>
      </div>

      {/* Datos */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="#8B5CF6" />
            Gestión de Datos
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Duración de caché (horas)
              </label>
              <select
                value={config.datos.cacheDuration}
                onChange={(e) => handleConfigChange('datos', 'cacheDuration', parseInt(e.target.value))}
                style={selectStyle}
              >
                <option value={1}>1 hora</option>
                <option value={6}>6 horas</option>
                <option value={24}>24 horas</option>
                <option value={72}>3 días</option>
              </select>
            </div>

            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Formato de exportación
              </label>
              <select
                value={config.datos.exportFormat}
                onChange={(e) => handleConfigChange('datos', 'exportFormat', e.target.value)}
                style={selectStyle}
              >
                <option value="json">📄 JSON</option>
                <option value="csv">📊 CSV</option>
                <option value="excel">📈 Excel</option>
                <option value="pdf">📋 PDF</option>
              </select>
            </div>
          </div>

          <Switch
            checked={config.datos.autoSync}
            onChange={(value) => handleConfigChange('datos', 'autoSync', value)}
            label="Sincronización automática"
          />
          <Switch
            checked={config.datos.compresion}
            onChange={(value) => handleConfigChange('datos', 'compresion', value)}
            label="Compresión de datos"
          />
        </div>
      </div>

      {/* Privacidad */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="#8B5CF6" />
            Privacidad y Seguridad
          </h2>
          
          <Switch
            checked={config.privacidad.compartirUbicacion}
            onChange={(value) => handleConfigChange('privacidad', 'compartirUbicacion', value)}
            label="Compartir ubicación para análisis"
          />
          <Switch
            checked={config.privacidad.analiticas}
            onChange={(value) => handleConfigChange('privacidad', 'analiticas', value)}
            label="Permitir analíticas de uso"
          />
          <Switch
            checked={config.privacidad.cookies}
            onChange={(value) => handleConfigChange('privacidad', 'cookies', value)}
            label="Aceptar cookies de funcionalidad"
          />
          <Switch
            checked={config.privacidad.historial}
            onChange={(value) => handleConfigChange('privacidad', 'historial', value)}
            label="Mantener historial de actividad"
          />
        </div>
      </div>

      {/* Información del Sistema */}
      <div style={cardStyle}>
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
            ℹ️ Información del Sistema
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Versión de la aplicación:</span>
              <p style={{ color: 'white', fontSize: '0.875rem', margin: '0.25rem 0' }}>v2.1.0</p>
            </div>
            <div>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Última actualización:</span>
              <p style={{ color: 'white', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                {new Date().toLocaleDateString('es-CL')}
              </p>
            </div>
            <div>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Base de datos:</span>
              <p style={{ color: '#10B981', fontSize: '0.875rem', margin: '0.25rem 0' }}>✅ Conectada</p>
            </div>
            <div>
              <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Servidor:</span>
              <p style={{ color: '#10B981', fontSize: '0.875rem', margin: '0.25rem 0' }}>🟢 En línea</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer con advertencia de cambios */}
      {hasChanges && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'rgba(139, 92, 246, 0.9)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 50
        }}>
          <Settings size={20} />
          <span>Tienes cambios sin guardar</span>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: 'white',
              color: '#8B5CF6',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Guardar ahora
          </button>
        </div>
      )}
    </div>
  );
};

export default Configuracion;