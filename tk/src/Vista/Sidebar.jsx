import React from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/StyleSidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><a href="/inicio" className={isActive('/inicio')}>Inicio</a></li>
          <li><a href="/alertas" className={isActive('/alertas')}>Alertas</a></li>
          <li><a href="/predicciones" className={isActive('/predicciones')}>Predicciones</a></li>
          <li><a href="/registro-del-clima" className={isActive('/registro-del-clima')}>Registro del Clima</a></li>
          <li><a href="/transito-vehicular" className={isActive('/transito-vehicular')}>Tránsito Vehicular</a></li>
          <li><a href="/software" className={isActive('/software')}>Software</a></li>
          <li><a href="/informacion" className={isActive('/informacion')}>Información</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
