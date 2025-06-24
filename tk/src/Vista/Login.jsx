import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Datos de login:', formData);
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  const backgroundStyle = (index) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${backgrounds[index]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: index === currentBg ? 1 : 0,
    transition: 'opacity 1s ease-in-out'
  });

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '28rem',
    margin: '0 1rem',
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: '#9CA3AF'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#D1D5DB'
  };

  const inputContainerStyle = {
    position: 'relative'
  };

  const iconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#A855F7',
    width: '1.25rem',
    height: '1.25rem'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    backgroundColor: '#1F2937',
    border: '1px solid #4B5563',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  const passwordButtonStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  };

  const forgotPasswordStyle = {
    textAlign: 'right'
  };

  const linkStyle = {
    color: '#A855F7',
    textDecoration: 'none',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
    color: 'white',
    fontWeight: '600',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  };

  const secondaryButtonStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    border: '1px solid #8B5CF6',
    color: '#A855F7',
    fontWeight: '600',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  };

  const dividerStyle = {
    margin: '2rem 0',
    display: 'flex',
    alignItems: 'center'
  };

  const dividerLineStyle = {
    flex: 1,
    height: '1px',
    backgroundColor: '#4B5563'
  };

  const dividerTextStyle = {
    padding: '0 1rem',
    color: '#9CA3AF',
    fontSize: '0.875rem'
  };

  const footerStyle = {
    textAlign: 'center',
    marginTop: '2rem'
  };

  const footerTextStyle = {
    color: '#9CA3AF',
    fontSize: '0.875rem'
  };

  const spinnerStyle = {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #8B5CF6 !important;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
        }
        button:hover {
          transform: translateY(-1px);
        }
        .secondary-button:hover {
          background-color: #8B5CF6 !important;
          color: white !important;
        }
        .link:hover {
          color: #C084FC !important;
        }
        .password-btn:hover {
          color: #A855F7 !important;
        }
      `}</style>

      {/* Fondos rotativos */}
      {backgrounds.map((bg, index) => (
        <div key={index} style={backgroundStyle(index)} />
      ))}

      {/* Overlay oscuro */}
      <div style={overlayStyle} />

      {/* Tarjeta de login */}
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Bienvenido</h1>
          <p style={subtitleStyle}>Ingresa a tu cuenta para continuar</p>
        </div>

        {/* Formulario */}
        <div style={formStyle}>
          {/* Email */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Correo Electrónico</label>
            <div style={inputContainerStyle}>
              <Mail style={iconStyle} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="tu-email@empresa.com"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Contraseña</label>
            <div style={inputContainerStyle}>
              <Lock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{...inputStyle, paddingRight: '3rem'}}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={passwordButtonStyle}
                className="password-btn"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Olvidé mi contraseña */}
          <div style={forgotPasswordStyle}>
            <button
              type="button"
              style={{...linkStyle, background: 'none', border: 'none'}}
              className="link"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón de login */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              ...buttonStyle,
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <div style={spinnerStyle} />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Divisor */}
        <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={dividerTextStyle}>O</span>
          <div style={dividerLineStyle}></div>
        </div>

        {/* Registro */}
        <div style={{textAlign: 'center'}}>
          <p style={{...footerTextStyle, marginBottom: '1rem'}}>
            ¿No tienes una cuenta?
          </p>
          <button
            onClick={() => window.location.href = '/register'}
            style={secondaryButtonStyle}
            className="secondary-button"
          >
            Crear Cuenta
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <p style={footerTextStyle}>
          Sistema de Predicción de Carreteras
        </p>
      </div>
    </div>
  );
};

export default Login;
