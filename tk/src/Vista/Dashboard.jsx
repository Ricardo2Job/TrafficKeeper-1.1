import React from 'react';
import '../Styles/StyleDashboard.css';

const DashboardContent = () => {
  return (
    <div className="dashboard-content">
      <div className="road-status">
        <h2>Estado de carretera</h2>
        <p>162.9km</p>
        <p>25%</p>
        <div className="chart-placeholder">
          {/* TODO: Agregar gráfico de simulación */}
        </div>
      </div>
      <div className="map-placeholder">
        {/* TODO: Agregar mapa de simulación */}
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
  );
};

export default DashboardContent;
