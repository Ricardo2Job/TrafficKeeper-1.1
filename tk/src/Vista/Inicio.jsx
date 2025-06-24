import React, { useState, useEffect } from 'react';
import {
  Home,
  Cloud,
  Map,
  Car,
  AlertTriangle,
  BarChart3,
  Info,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Palette,
  Monitor,
  Volume2,
  Eye,
  Lock,
  Globe,
  Database,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  // Estados para perfil
  const [profileData, setProfileData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@prediccionvial.com',
    telefono: '+56 9 1234 5678',
    cargo: 'Ingeniero de Sistemas',
    departamento: 'Monitoreo Vial',
    ubicacion: 'Santiago, Chile',
    fechaIngreso: '2023-03-15',
    ultimoAcceso: '2025-06-23 14:30',
    avatar: null
  });

  // Estados para configuración
  const [configData, setConfigData] = useState({
    tema: 'oscuro',
    idioma: 'es',
    notificaciones: {
      alertas: true,
      email: true,
      sonido: false,
      push: true
    },
    dashboard: {
      actualizacionAuto: true,
      intervaloActualizacion: 30,
      mostrarAnimaciones: true
    },
    privacidad: {
      perfilPublico: false,
      compartirDatos: false,
      cookies: true
    }
  });

  const backgrounds = [
    'Vista/imagenes/fondo1.png',
    'Vista/imagenes/fondo2.png',
    'Vista/imagenes/fondo3.png',
    'Vista/imagenes/fondo4.png',
    'Vista/imagenes/fondo5.png'
  ];

  // Rotación automática de fondos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'clima', label: 'Clima', icon: Cloud },
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'flujo', label: 'Flujo Vehicular', icon: Car },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
    { id: 'simulacion', label: 'Simulación de Datos', icon: BarChart3 },
    { id: 'info', label: 'Más Información', icon: Info }
  ];

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    window.location.href = '/login';
  };

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigUpdate = (section, field, value) => {
    setConfigData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveProfile = () => {
    console.log('Guardando perfil:', profileData);
    alert('Perfil actualizado correctamente');
  };

  const saveConfig = () => {
    console.log('Guardando configuración:', configData);
    alert('Configuración guardada correctamente');
  };

  // Estilos principales
  const containerStyle = {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: '#111827',
    fontFamily: 'Arial, sans-serif'
  };

  const backgroundStyle = (index) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${backgrounds[index]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: index === currentBg ? 0.1 : 0,
    transition: 'opacity 2s ease-in-out',
    zIndex: 1
  });

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    zIndex: 2
  };

  const sidebarStyle = {
    position: 'fixed',
    left: isSidebarOpen ? 0 : '-280px',
    top: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(147, 51, 234, 0.2)',
    zIndex: 30,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    padding: '1.5rem',
    borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(90deg, #8B5CF6, #A855F7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const menuStyle = {
    flex: 1,
    padding: '1rem 0',
    overflowY: 'auto'
  };

  const menuItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    margin: '0.25rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
    color: isActive ? '#A855F7' : '#D1D5DB',
    border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
  });

  const mainContentStyle = {
    marginLeft: isSidebarOpen ? '280px' : '0',
    flex: 1,
    position: 'relative',
    zIndex: 20,
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  const topBarStyle = {
    height: '70px',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    position: 'sticky',
    top: 0,
    zIndex: 25
  };

  const contentAreaStyle = {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto'
  };

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

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem'
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

  const toggleStyle = (isActive) => ({
    width: '50px',
    height: '26px',
    backgroundColor: isActive ? '#8B5CF6' : '#4B5563',
    borderRadius: '13px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const toggleSliderStyle = (isActive) => ({
    width: '22px',
    height: '22px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isActive ? '26px' : '2px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
  });

  const renderProfileContent = () => (
    <div>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Mi Perfil</h1>
        <p style={subtitleStyle}>Administra tu información personal y configuración de cuenta</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #8B5CF6, #A855F7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              color: 'white',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              {profileData.nombre.charAt(0)}
            </div>
            <button style={buttonStyle}>
              <Upload size={16} />
              Cambiar Avatar
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>
                  <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={profileData.nombre}
                  onChange={(e) => handleProfileUpdate('nombre', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>
                  <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>
                  <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={profileData.telefono}
                  onChange={(e) => handleProfileUpdate('telefono', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>
                  <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Cargo
                </label>
                <input
                  type="text"
                  value={profileData.cargo}
                  onChange={(e) => handleProfileUpdate('cargo', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Ubicación
              </label>
              <input
                type="text"
                value={profileData.ubicacion}
                onChange={(e) => handleProfileUpdate('ubicacion', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '0.5rem' }}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Fecha de Ingreso
                </label>
                <div style={{ ...inputStyle, backgroundColor: 'rgba(17, 24, 39, 0.3)', cursor: 'not-allowed' }}>
                  {profileData.fechaIngreso}
                </div>
              </div>
              <div>
                <label style={{ color: '#9CA3AF', display: 'block', marginBottom: '0.5rem' }}>
                  <Eye size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Último Acceso
                </label>
                <div style={{ ...inputStyle, backgroundColor: 'rgba(17, 24, 39, 0.3)', cursor: 'not-allowed' }}>
                  {profileData.ultimoAcceso}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={buttonStyle} onClick={saveProfile}>
                <Save size={16} />
                Guardar Cambios
              </button>
              <button style={{...buttonStyle, background: 'rgba(239, 68, 68, 0.8)'}}>
                <Lock size={16} />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfigContent = () => (
    <div>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Configuración</h1>
        <p style={subtitleStyle}>Personaliza tu experiencia en el sistema</p>
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={20} />
            Apariencia
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>Tema</label>
              <select
                value={configData.tema}
                onChange={(e) => handleConfigUpdate('tema', '', e.target.value)}
                style={inputStyle}
              >
                <option value="oscuro">Tema Oscuro</option>
                <option value="claro">Tema Claro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>Idioma</label>
              <select
                value={configData.idioma}
                onChange={(e) => handleConfigUpdate('idioma', '', e.target.value)}
                style={inputStyle}
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="pt">Portugués</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} />
            Notificaciones
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {Object.entries(configData.notificaciones).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(17, 24, 39, 0.4)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#D1D5DB', textTransform: 'capitalize' }}>
                  {key === 'alertas' ? 'Alertas del Sistema' :
                   key === 'email' ? 'Notificaciones por Email' :
                   key === 'sonido' ? 'Sonidos' : 'Notificaciones Push'}
                </span>
                <div
                  style={toggleStyle(value)}
                  onClick={() => handleConfigUpdate('notificaciones', key, !value)}
                >
                  <div style={toggleSliderStyle(value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Monitor size={20} />
            Dashboard
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ color: '#D1D5DB', display: 'block', marginBottom: '0.5rem' }}>Intervalo de Actualización (segundos)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={configData.dashboard.intervaloActualizacion}
                onChange={(e) => handleConfigUpdate('dashboard', 'intervaloActualizacion', parseInt(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(17, 24, 39, 0.4)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#D1D5DB' }}>Actualización Automática</span>
                <div
                  style={toggleStyle(configData.dashboard.actualizacionAuto)}
                  onClick={() => handleConfigUpdate('dashboard', 'actualizacionAuto', !configData.dashboard.actualizacionAuto)}
                >
                  <div style={toggleSliderStyle(configData.dashboard.actualizacionAuto)} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(17, 24, 39, 0.4)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#D1D5DB' }}>Mostrar Animaciones</span>
                <div
                  style={toggleStyle(configData.dashboard.mostrarAnimaciones)}
                  onClick={() => handleConfigUpdate('dashboard', 'mostrarAnimaciones', !configData.dashboard.mostrarAnimaciones)}
                >
                  <div style={toggleSliderStyle(configData.dashboard.mostrarAnimaciones)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} />
            Privacidad y Seguridad
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {Object.entries(configData.privacidad).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(17, 24, 39, 0.4)', borderRadius: '0.5rem' }}>
                <div>
                  <span style={{ color: '#D1D5DB', display: 'block' }}>
                    {key === 'perfilPublico' ? 'Perfil Público' :
                     key === 'compartirDatos' ? 'Compartir Datos de Análisis' : 'Aceptar Cookies'}
                  </span>
                  <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                    {key === 'perfilPublico' ? 'Permitir que otros usuarios vean tu perfil' :
                     key === 'compartirDatos' ? 'Compartir datos anónimos para mejorar el sistema' : 'Necesario para el funcionamiento del sistema'}
                  </span>
                </div>
                <div
                  style={toggleStyle(value)}
                  onClick={() => handleConfigUpdate('privacidad', key, !value)}
                >
                  <div style={toggleSliderStyle(value)} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button style={buttonStyle} onClick={saveConfig}>
            <Save size={16} />
            Guardar Configuración
          </button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{...buttonStyle, background: 'rgba(34, 197, 94, 0.8)'}}>
              <Download size={16} />
              Exportar Configuración
            </button>
            <button style={{...buttonStyle, background: 'rgba(239, 68, 68, 0.8)'}}>
              <Trash2 size={16} />
              Restablecer por Defecto
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const stats = [
      { label: 'Carreteras Monitoreadas', value: '245', icon: Map },
      { label: 'Alertas Activas', value: '12', icon: AlertTriangle },
      { label: 'Sensores Activos', value: '1,340', icon: BarChart3 },
      { label: 'Condición Promedio', value: '85%', icon: Car }
    ];

    if (activeSection === 'perfil') {
      return renderProfileContent();
    }
    if (activeSection === 'configuracion') {
      return renderConfigContent();
    }
    if (activeSection === 'inicio') {
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
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.borderColor = 'rgba(75, 85, 99, 0.3)';
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
    }

    return (
      <div style={cardStyle}>
        <h1 style={titleStyle}>{menuItems.find(item => item.id === activeSection)?.label}</h1>
        <p style={subtitleStyle}>
          Contenido para {menuItems.find(item => item.id === activeSection)?.label} en desarrollo...
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          borderRadius: '0.5rem',
          border: '2px dashed rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ textAlign: 'center' }}>
            {React.createElement(menuItems.find(item => item.id === activeSection)?.icon || Home, {
              size: 64,
              color: '#A855F7'
            })}
            <p style={{ color: '#9CA3AF', marginTop: '1rem', fontSize: '1.1rem' }}>
              Próximamente disponible
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .menu-item:hover {
          background-color: rgba(139, 92, 246, 0.1) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
        }

        button:hover {
          transform: translateY(-1px) !important;
        }

        .stat-card:hover {
          transform: translateY(-2px) !important;
          border-color: rgba(139, 92, 246, 0.4) !important;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #8B5CF6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
      `}</style>
      {backgrounds.map((bg, index) => (
        <div key={index} style={backgroundStyle(index)} />
      ))}
      <div style={overlayStyle} />
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>Predicción Vial</div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              display: 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={menuStyle}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                style={menuItemStyle(activeSection === item.id)}
                className="menu-item"
                onClick={() => setActiveSection(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <div
            style={menuItemStyle(activeSection === 'perfil')}
            className="menu-item"
            onClick={() => setActiveSection('perfil')}
          >
            <User size={20} />
            <span>Perfil</span>
          </div>
          <div
            style={menuItemStyle(activeSection === 'configuracion')}
            className="menu-item"
            onClick={() => setActiveSection('configuracion')}
          >
            <Settings size={20} />
            <span>Configuración</span>
          </div>
          <div
            style={menuItemStyle(false)}
            className="menu-item"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>
      <div style={mainContentStyle}>
        <div style={topBarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#D1D5DB',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Menu size={20} />
            </button>
            <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>
              {activeSection === 'perfil' ? 'Mi Perfil' :
               activeSection === 'configuracion' ? 'Configuración' :
               menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#D1D5DB',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '0.5rem',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Bell size={20} />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            </button>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #8B5CF6, #A855F7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => setActiveSection('perfil')}
              title="Ver perfil"
            >
              {profileData.nombre.charAt(0)}
            </div>
          </div>
        </div>
        <div style={contentAreaStyle}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
