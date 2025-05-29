import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import '../Styles/StyleTransitoVehicular.css';

const TransitoVehicular = () => {
  const [selectedRegion, setSelectedRegion] = useState('Santiago');
  const [selectedTime, setSelectedTime] = useState('24h');

  // Datos simulados de tráfico
  const traficoData = {
    Santiago: { cars: 1200, trucks: 300, buses: 200, total: 1700 },
    Valparaíso: { cars: 1000, trucks: 250, buses: 150, total: 1400 },
    Concepción: { cars: 800, trucks: 200, buses: 100, total: 1100 },
    Temuco: { cars: 600, trucks: 150, buses: 80, total: 830 },
    PuertoMontt: { cars: 400, trucks: 100, buses: 50, total: 550 },
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <div className="transito-vehicular">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h1>Tránsito Vehicular</h1>
          <div className="filters">
            <select value={selectedRegion} onChange={handleRegionChange}>
              <option value="Santiago">Santiago</option>
              <option value="Valparaíso">Valparaíso</option>
              <option value="Concepción">Concepción</option>
              <option value="Temuco">Temuco</option>
              <option value="PuertoMontt">Puerto Montt</option>
            </select>
            <select value={selectedTime} onChange={handleTimeChange}>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
          </div>
          <div className="trafico-data">
            <h2>Datos de Tránsito para {selectedRegion}</h2>
            <p>Autos: {traficoData[selectedRegion].cars}</p>
            <p>Camiones: {traficoData[selectedRegion].trucks}</p>
            <p>Buses: {traficoData[selectedRegion].buses}</p>
            <p>Total: {traficoData[selectedRegion].total}</p>
          </div>
          <div className="trafico-chart">
            {/* TODO: Agregar gráfico de tráfico */}
            <p>Gráfico de tráfico para {selectedRegion} en las últimas {selectedTime}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TransitoVehicular;
