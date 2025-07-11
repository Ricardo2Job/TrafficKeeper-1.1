import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Phone,
  Camera,
  Key,
  Activity,
  Award,
  Clock
} from 'lucide-react';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      const userData = JSON.parse(usuarioData);
      setUsuario(userData);
      setFormData({
        email: userData.email || '',
        companyName: userData.companyName || '',
        userPosition: userData.userPosition || '',
        phone: userData.phone || '',
        address: userData.address || '',
        bio: userData.bio || ''
      });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular guardado (aquí iría la llamada real a la API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar localStorage
      const updatedUser = { ...usuario, ...formData };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUsuario(updatedUser);
      
      setEditMode(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Contraseña cambiada exitosamente');
    } catch (error) {
      alert('Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '2rem',
    marginBottom: '2rem'
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

  if (!usuario) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <User size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header del Perfil */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
            👤 Mi Perfil
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={buttonStyle}
                >
                  <Save size={16} />
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      email: usuario.email || '',
                      companyName: usuario.companyName || '',
                      userPosition: usuario.userPosition || '',
                      phone: usuario.phone || '',
                      address: usuario.address || '',
                      bio: usuario.bio || ''
                    });
                  }}
                  style={secondaryButtonStyle}
                >
                  <X size={16} />
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={buttonStyle}
              >
                <Edit3 size={16} />
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Avatar y información básica */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              border: '3px solid #8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={48} color="#8B5CF6" />
            </div>
            {editMode && (
              <button style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                backgroundColor: '#8B5CF6',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Camera size={16} color="white" />
              </button>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
              {usuario.email?.split('@')[0] || 'Usuario'}
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '1rem', marginBottom: '0.5rem' }}>
              {usuario.userPosition || 'Cargo no especificado'}
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              {usuario.companyName || 'Empresa no especificada'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <Shield size={16} color={usuario.isAdmin === 'Y' ? '#10B981' : '#9CA3AF'} />
              <span style={{ color: usuario.isAdmin === 'Y' ? '#10B981' : '#9CA3AF', fontSize: '0.875rem' }}>
                {usuario.isAdmin === 'Y' ? 'Administrador' : 'Usuario Estándar'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Información Personal */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
          📝 Información Personal
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Correo Electrónico
            </label>
            <input
              type="email"
              value={editMode ? formData.email : usuario.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!editMode}
              style={{
                ...inputStyle,
                opacity: editMode ? 1 : 0.7,
                cursor: editMode ? 'text' : 'not-allowed'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <Building size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Empresa
            </label>
            <input
              type="text"
              value={editMode ? formData.companyName : usuario.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              disabled={!editMode}
              style={{
                ...inputStyle,
                opacity: editMode ? 1 : 0.7,
                cursor: editMode ? 'text' : 'not-allowed'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <Briefcase size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Cargo
            </label>
            <input
              type="text"
              value={editMode ? formData.userPosition : usuario.userPosition}
              onChange={(e) => handleInputChange('userPosition', e.target.value)}
              disabled={!editMode}
              style={{
                ...inputStyle,
                opacity: editMode ? 1 : 0.7,
                cursor: editMode ? 'text' : 'not-allowed'
              }}
            />
          </div>

          <div>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Teléfono
            </label>
            <input
              type="tel"
              value={editMode ? formData.phone : (usuario.phone || '')}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!editMode}
              placeholder="Agregar teléfono"
              style={{
                ...inputStyle,
                opacity: editMode ? 1 : 0.7,
                cursor: editMode ? 'text' : 'not-allowed'
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Dirección
            </label>
            <input
              type="text"
              value={editMode ? formData.address : (usuario.address || '')}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!editMode}
              placeholder="Agregar dirección"
              style={{
                ...inputStyle,
                opacity: editMode ? 1 : 0.7,
                cursor: editMode ? 'text' : 'not-allowed'
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
              <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Biografía
            </label>
            <textarea
              value={editMode ? formData.bio : (usuario.bio || '')}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!editMode}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              style={{
                ...inputStyle,
                opacity: editMode ? 1 : 0.7,
                cursor: editMode ? 'text' : 'not-allowed',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
            🔒 Seguridad
          </h2>
          <button
            onClick={() => setChangePasswordMode(!changePasswordMode)}
            style={changePasswordMode ? secondaryButtonStyle : buttonStyle}
          >
            <Key size={16} />
            {changePasswordMode ? 'Cancelar' : 'Cambiar Contraseña'}
          </button>
        </div>

        {changePasswordMode && (
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.4)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                style={{
                  ...buttonStyle,
                  opacity: (loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) ? 0.5 : 1
                }}
              >
                <Save size={16} />
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: 'rgba(17, 24, 39, 0.4)',
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Información de Cuenta
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Calendar size={16} color="#9CA3AF" />
                <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Último acceso</span>
              </div>
              <p style={{ color: 'white', fontSize: '0.875rem' }}>
                {new Date().toLocaleDateString('es-CL')} a las {new Date().toLocaleTimeString('es-CL')}
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Activity size={16} color="#9CA3AF" />
                <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Estado</span>
              </div>
              <p style={{ color: '#10B981', fontSize: '0.875rem' }}>
                ✅ Activo
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield size={16} color="#9CA3AF" />
                <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Permisos</span>
              </div>
              <p style={{ color: usuario.isAdmin === 'Y' ? '#10B981' : '#F59E0B', fontSize: '0.875rem' }}>
                {usuario.isAdmin === 'Y' ? '👑 Administrador' : '👤 Usuario'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de Uso */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
          📊 Estadísticas de Uso
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <Activity size={32} color="#8B5CF6" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B5CF6', marginBottom: '0.5rem' }}>
              {Math.floor(Math.random() * 50) + 10}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Sesiones este mes</div>
          </div>

          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <Clock size={32} color="#10B981" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981', marginBottom: '0.5rem' }}>
              {Math.floor(Math.random() * 100) + 20}h
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Tiempo total</div>
          </div>

          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <Award size={32} color="#F59E0B" style={{ margin: '0 auto 1rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B', marginBottom: '0.5rem' }}>
              {Math.floor(Math.random() * 500) + 100}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Consultas realizadas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;