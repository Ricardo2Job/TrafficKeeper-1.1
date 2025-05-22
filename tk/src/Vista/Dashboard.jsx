import React from 'react';
import '../Styles/Styles.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Buscar...</span>
          <img src="user-icon.png" alt="Usuario" />
          <span>Usuario</span>
        </div>
      </div>
      <div className="main-content">
        <div className="sidebar">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/alertas">Alertas</a></li>
            <li><a href="/predicciones">Predicciones</a></li>
            <li><a href="/registro-del-clima">Registro del Clima</a></li>
            <li><a href="/transito-vehicular">Tránsito Vehicular</a></li>
            <li><a href="/software">Software</a></li>
            <li><a href="/informacion">Información</a></li>
          </ul>
        </div>
        <div className="content">
          <div className="road-status">
            <h2>Estado de carretera</h2>
            <p>162.9km</p>
            <p>25%</p>
            <div className="chart-placeholder">
              {/* TODO: Agregar gráfico de simulacion */}
            </div>
          </div>
          <div className="map-placeholder">
            {/* TODO: Agregar mapa de simulacion */}
          </div>
          <div className="road-conditions">
            <h2>Condiciones de la carretera</h2>
            <ul>
              <li>Ruta del Desierto (Región de Antofagasta): Probabilidad de desgaste: 30%</li>
              <li>Carretera Austral (Región de Aysén): Probabilidad de desgaste: 28%</li>
              <li>Ruta 5 Norte (Coquimbo): Probabilidad de desgaste: 25%</li>
              <li>Ruta 5 Sur (Región de La Araucanía): Probabilidad de desgaste: 23%</li>
              <li>Autopista Central (Santiago): Probabilidad de desgaste: 22%</li>
              <li>Ruta 68 (Valparaíso): Probabilidad de desgaste: 17%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
