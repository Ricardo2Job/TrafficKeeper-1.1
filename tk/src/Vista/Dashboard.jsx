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
import SimulacionDeDatos from './SimulacionDeDatos';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para perfil - ahora se cargarán desde la API
  const [profileData, setProfileData] = useState({
    id: '',
    nombre: '',
    email: '',
    telefono: '',
    cargo: '',
    departamento: '',
    ubicacion: '',
    fechaIngreso: '',
    ultimoAcceso: '',
    avatar: null,
    isAdmin: 'N'
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

  // Función para obtener los datos del usuario
  const cargarDatosUsuario = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No hay token, redirigiendo al login');
        handleLogout();
        return;
      }

      const response = await fetch('http://localhost:5000/api/usuario/perfil', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token inválido, redirigiendo al login');
          handleLogout();
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      console.log('Datos del usuario cargados:', userData);
      
      // Actualizar el estado con los datos reales del usuario
      setProfileData({
        id: userData.id,
        nombre: userData.nombre || userData.companyName || 'Usuario',
        email: userData.email || '',
        telefono: userData.telefono || '+56 9 1234 5678',
        cargo: userData.cargo || userData.userPosition || 'Cargo no especificado',
        departamento: userData.departamento || 'Monitoreo Vial',
        ubicacion: userData.ubicacion || 'Santiago, Chile',
        fechaIngreso: userData.fechaIngreso || new Date().toISOString().split('T')[0],
        ultimoAcceso: userData.ultimoAcceso || new Date().toISOString().slice(0, 16).replace('T', ' '),
        avatar: userData.avatar || null,
        isAdmin: userData.isAdmin || 'N'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      setError(error.message);
      setLoading(false);
      
      // En caso de error, usar datos por defecto pero con información básica del localStorage
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        try {
          const userData = JSON.parse(usuarioLocalStorage);
          setProfileData(prev => ({
            ...prev,
            nombre: userData.companyName || 'Usuario',
            email: userData.email || '',
            cargo: userData.userPosition || 'Cargo no especificado',
            isAdmin: userData.isAdmin || 'N'
          }));
        } catch (parseError) {
          console.error('Error al parsear datos del localStorage:', parseError);
        }
      }
    }
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  // Efecto para cambiar fondos
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
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Redirigir al login
    window.location.href = '/login';
  };

  const handleProfileUpdate = async (field, value) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No hay token para actualizar perfil');
        handleLogout();
        return;
      }

      // Actualizar estado local inmediatamente para mejor UX
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));

      // Preparar los datos para enviar al servidor
      const updateData = {
        companyName: field === 'nombre' ? value : profileData.nombre,
        userPosition: field === 'cargo' ? value : profileData.cargo,
        telefono: field === 'telefono' ? value : profileData.telefono,
        ubicacion: field === 'ubicacion' ? value : profileData.ubicacion,
        departamento: field === 'departamento' ? value : profileData.departamento
      };

      console.log('Actualizando perfil:', updateData);

      // Enviar actualización al servidor
      const response = await fetch('http://localhost:5000/api/usuario/perfil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Perfil actualizado exitosamente:', result);

      // Actualizar localStorage si es necesario
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        try {
          const userData = JSON.parse(usuarioLocalStorage);
          userData.companyName = updateData.companyName;
          userData.userPosition = updateData.userPosition;
          localStorage.setItem('usuario', JSON.stringify(userData));
        } catch (parseError) {
          console.error('Error al actualizar localStorage:', parseError);
        }
      }

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      // Revertir cambio local si hay error
      cargarDatosUsuario();
      alert('Error al actualizar el perfil. Por favor, intente nuevamente.');
    }
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

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(139, 92, 246, 0.3)',
            borderTop: '3px solid #8B5CF6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Cargando datos del usuario...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay problemas cargando los datos
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <AlertTriangle size={48} color="#EF4444" />
          <h2 style={{ margin: 0, color: '#EF4444' }}>Error al cargar datos</h2>
          <p style={{ margin: 0, color: '#D1D5DB' }}>{error}</p>
          <button
            onClick={cargarDatosUsuario}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            Reintentar
          </button>
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
          <div style={logoStyle}>Predicción Vial</div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              display: 'none' // Oculto por defecto, se puede mostrar en responsive
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
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        
        {/* Sección del usuario */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(75, 85, 99, 0.3)' }}>
          <div
            style={menuItemStyle(activeSection === 'perfil')}
            className="menu-item"
            onClick={() => setActiveSection('perfil')}
          >
            <User size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                {profileData.nombre || 'Usuario'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                {profileData.cargo || 'Cargo no especificado'}
              </div>
            </div>
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
              borderColor: 'rgba(239, 68, 68, 0.3)'
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
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: '#D1D5DB',
              fontSize: '0.875rem'
            }}>
              <span>Bienvenido, {profileData.nombre || 'Usuario'}</span>
              {profileData.isAdmin === 'Y' && (
                <span style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#A855F7',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Admin
                </span>
              )}
            </div>
            <button
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
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Área de contenido */}
        <div style={contentAreaStyle}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;