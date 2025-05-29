import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import '../Styles/StyleInformacion.css';

const Informacion = () => {
  return (
    <div className="informacion">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <div className="content-header">
            <h2>Simulación de Tráfico en Tiempo Real</h2>
            <p>Monitoreo avanzado del flujo vehicular bidireccional</p>
          </div>

          <div className="traffic-simulation">
            <div className="road-container">
              <div className="road">
                <div className="road-marking center-line"></div>
                <div className="road-marking lane-line lane-1"></div>
                <div className="road-marking lane-line lane-2"></div>
                <div className="road-edge top-edge"></div>
                <div className="road-edge bottom-edge"></div>
              </div>

              <div className="direction-indicators">
                <div className="direction-arrow right-arrow">→</div>
                <div className="direction-arrow left-arrow">←</div>
              </div>
            </div>

            <div className="traffic-stats">
              <div className="stat-card">
                <h3>Vehículos Activos</h3>
                <span className="stat-number">0</span>
              </div>
              <div className="stat-card">
                <h3>Flujo Vehicular</h3>
                <span className="stat-number">Normal</span>
              </div>
              <div className="stat-card">
                <h3>Estado de Vía</h3>
                <span className="stat-number">Óptimo</span>
              </div>
            </div>
          </div>

          <div className="info-sections">
            <div className="info-card">
              <h3>🔍 Análisis en Tiempo Real</h3>
              <p>
                Nuestro sistema utiliza algoritmos avanzados para analizar patrones de tráfico,
                detectar congestiones y predecir posibles problemas en la infraestructura vial.
              </p>
            </div>

            <div className="info-card">
              <h3>⚡ Alertas Inteligentes</h3>
              <p>
                Recibe notificaciones automáticas sobre condiciones adversas del clima,
                alto flujo vehicular y riesgos potenciales de cedimiento en carreteras.
              </p>
            </div>

            <div className="info-card">
              <h3>📈 Predicciones Avanzadas</h3>
              <p>
                Proyecciones basadas en datos históricos y condiciones actuales para
                mantener la seguridad y eficiencia de la red vial.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Informacion;
