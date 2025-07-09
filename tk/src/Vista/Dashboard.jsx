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
  Bell
} from 'lucide-react';

// Importar componentes de páginas
import Inicio from './Inicio';
import Clima from './Clima';
import Mapa from './Mapa';
import FlujoVehicular from './FlujoVehicular';
import Alertas from './Alertas';
import MasInformacion from './MasInformacion';
import Perfil from './Perfil';
import Configuracion from './Configuracion';
import SimulacionDeDatos from './SimulacionDeDatos'; // Asegúrate de que la ruta sea correcta

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

  const renderContent = () => {
    const commonProps = {
      profileData,
      configData,
      handleProfileUpdate,
      handleConfigUpdate
    };

    switch (activeSection) {
      case 'inicio':
        return <Inicio {...commonProps} />;
      case 'clima':
        return <Clima {...commonProps} />;
      case 'mapa':
        return <Mapa {...commonProps} />;
      case 'flujo':
        return <FlujoVehicular {...commonProps} />;
      case 'alertas':
        return <Alertas {...commonProps} />;
      case 'simulacion':
        return <SimulacionDeDatos {...commonProps} />; // Asegúrate de que este nombre coincida
      case 'info':
        return <MasInformacion {...commonProps} />;
      case 'perfil':
        return <Perfil {...commonProps} />;
      case 'configuracion':
        return <Configuracion {...commonProps} />;
      default:
        return <Inicio {...commonProps} />;
    }
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
