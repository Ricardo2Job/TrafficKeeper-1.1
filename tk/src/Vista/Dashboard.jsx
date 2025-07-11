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
  ChevronDown
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
import SimulacionDeDatos from './SimulacionDeDatos';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [alertasCount, setAlertasCount] = useState(0);

  const backgrounds = [
    'Vista/imagenes/fondo1.png',
    'Vista/imagenes/fondo2.png',
    'Vista/imagenes/fondo3.png',
    'Vista/imagenes/fondo4.png',
    'Vista/imagenes/fondo5.png'
  ];

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    } else {
      // Si no hay usuario, redirigir al login
      window.location.href = '/login';
    }
  }, []);

  // Efecto para cambiar fondos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Simular conteo de alertas
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertasCount(Math.floor(Math.random() * 10));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'clima', label: 'Clima', icon: Cloud },
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'flujo', label: 'Flujo Vehicular', icon: Car },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle, badge: alertasCount },
    { id: 'simulacion', label: 'Simulación de Datos', icon: BarChart3 },
    { id: 'info', label: 'Más Información', icon: Info }
  ];

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
  };

  const handleProfileUpdate = (field, value) => {
    console.log(`Actualizando ${field} a ${value}`);
  };

  const handleConfigUpdate = (section, field, value) => {
    console.log(`Actualizando ${section}.${field} a ${value}`);
  };

  const getUserDisplayName = () => {
    if (!usuario) return 'Usuario';
    
    // Intentar obtener un nombre del email o usar el email completo
    if (usuario.nombre) return usuario.nombre;
    if (usuario.email) {
      const emailName = usuario.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'Usuario';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
    border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
    position: 'relative'
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

  const userMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
    padding: '0.5rem',
    minWidth: '200px',
    zIndex: 50
  };

  const renderContent = () => {
    const commonProps = {
      handleProfileUpdate,
      handleConfigUpdate,
      profileData: usuario,
      configData: {}
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
        return <SimulacionDeDatos {...commonProps} />;
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

  if (!usuario) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #8B5CF6',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

      {/* Fondos rotativos */}
      {backgrounds.map((bg, index) => (
        <div key={index} style={backgroundStyle(index)} />
      ))}
      <div style={overlayStyle} />

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <div style={logoStyle}>🚗 Predicción Vial</div>
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

        {/* Menú de navegación */}
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
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    backgroundColor: '#EF4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '1rem',
                    minWidth: '1.5rem',
                    textAlign: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Sección de opciones del usuario - Solo los botones esenciales */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <div
            style={menuItemStyle(activeSection === 'perfil')}
            className="menu-item"
            onClick={() => setActiveSection('perfil')}
          >
            <User size={20} />
            <span>Mi Perfil</span>
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
            style={{
              ...menuItemStyle(false),
              color: '#EF4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              marginTop: '0.5rem'
            }}
            className="menu-item"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={mainContentStyle}>
        {/* Barra superior */}
        <div style={topBarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#D1D5DB',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s ease'
              }}
            >
              <Menu size={20} />
            </button>
            <h1 style={{
              margin: 0,
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Saludo personalizado */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#D1D5DB',
              fontSize: '0.875rem'
            }}>
              <span>
                Bienvenido, <strong style={{ color: '#A855F7' }}>{getUserDisplayName()}</strong>
              </span>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981'
              }}></div>
            </div>

            {/* Botón de notificaciones */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setActiveSection('alertas')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D1D5DB',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'background-color 0.2s ease',
                  position: 'relative'
                }}
              >
                <Bell size={20} />
                {alertasCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0.25rem',
                    right: '0.25rem',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '1rem',
                    minWidth: '1rem',
                    textAlign: 'center',
                    lineHeight: 1
                  }}>
                    {alertasCount}
                  </span>
                )}
              </button>
            </div>

            {/* Menú de usuario */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D1D5DB',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#8B5CF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}>
                  {getUserInitials()}
                </div>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div style={userMenuStyle}>
                  <div style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {getUserDisplayName()}
                    </div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                      {usuario.email}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setActiveSection('perfil');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'none',
                      border: 'none',
                      color: '#D1D5DB',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <User size={16} />
                    Ver Perfil
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveSection('configuracion');
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'none',
                      border: 'none',
                      color: '#D1D5DB',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <Settings size={16} />
                    Configuración
                  </button>
                  
                  <div style={{ height: '1px', backgroundColor: 'rgba(75, 85, 99, 0.3)', margin: '0.5rem 0' }}></div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área de contenido */}
        <div style={contentAreaStyle}>
          {renderContent()}
        </div>
      </div>

      {/* Overlay para cerrar menús */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;