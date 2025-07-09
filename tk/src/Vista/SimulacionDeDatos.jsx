import React, { useState } from 'react';

const SimulacionDeDatos = ({ profileData, configData }) => {
  const [simulacionTrafico, setSimulacionTrafico] = useState([]);
  const [simulacionClima, setSimulacionClima] = useState([]);

  const tiposVehiculos = ['Moto', 'Auto', 'Camión'];
  const peajes = ['Peaje Santiago', 'Peaje Los Ángeles', 'Peaje Chillán'];
  const tiposClima = ['Soleado', 'Nublado', 'Lluvia', 'Tormenta'];

  const generarDatosTrafico = () => {
    const nuevosDatos = [];
    for (let i = 0; i < 30; i++) {
      const tipoVehiculo = tiposVehiculos[Math.floor(Math.random() * tiposVehiculos.length)];
      const peaje = peajes[Math.floor(Math.random() * peajes.length)];
      const hora = `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`;
      const fecha = new Date().toISOString().split('T')[0];
      const pesoPromedio = tipoVehiculo === 'Moto' ? 300 : tipoVehiculo === 'Auto' ? 1500 : 15000;
      const tarifa = Math.floor(Math.random() * 5000) + 1000;
      const distanciaRecorrida = Math.floor(Math.random() * 200) + 50;

      nuevosDatos.push({
        tipoVehiculo,
        peaje,
        hora,
        fecha,
        pesoPromedio,
        tarifa,
        distanciaRecorrida
      });
    }
    setSimulacionTrafico(nuevosDatos);
  };

  const generarDatosClima = () => {
    const nuevosDatos = [];
    const fecha = new Date().toISOString().split('T')[0];
    peajes.forEach(peaje => {
      const tipoClima = tiposClima[Math.floor(Math.random() * tiposClima.length)];
      const intensidad = ['Baja', 'Media', 'Alta'][Math.floor(Math.random() * 3)];
      const desgasteEstimado = tipoClima === 'Lluvia' ? 0.75 : tipoClima === 'Tormenta' ? 1.5 : 0.1;

      nuevosDatos.push({
        tipoClima,
        intensidad,
        fecha,
        ubicacion: peaje,
        desgasteEstimado
      });
    });
    setSimulacionClima(nuevosDatos);
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Simulación de Datos</h1>
      <div>
        <h2>Simulación de Flujo Vehicular</h2>
        <button onClick={generarDatosTrafico}>Generar Nueva Simulación de Tráfico</button>
        <table>
          <thead>
            <tr>
              <th>Tipo Vehículo</th>
              <th>Peaje</th>
              <th>Hora</th>
              <th>Fecha</th>
              <th>Peso Promedio</th>
              <th>Tarifa</th>
              <th>Distancia Recorrida</th>
            </tr>
          </thead>
          <tbody>
            {simulacionTrafico.map((dato, index) => (
              <tr key={index}>
                <td>{dato.tipoVehiculo}</td>
                <td>{dato.peaje}</td>
                <td>{dato.hora}</td>
                <td>{dato.fecha}</td>
                <td>{dato.pesoPromedio}</td>
                <td>{dato.tarifa}</td>
                <td>{dato.distanciaRecorrida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Simulación de Clima</h2>
        <button onClick={generarDatosClima}>Generar Nueva Simulación de Clima</button>
        <table>
          <thead>
            <tr>
              <th>Tipo Clima</th>
              <th>Intensidad</th>
              <th>Fecha</th>
              <th>Ubicación</th>
              <th>Desgaste Estimado</th>
            </tr>
          </thead>
          <tbody>
            {simulacionClima.map((dato, index) => (
              <tr key={index}>
                <td>{dato.tipoClima}</td>
                <td>{dato.intensidad}</td>
                <td>{dato.fecha}</td>
                <td>{dato.ubicacion}</td>
                <td>{dato.desgasteEstimado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimulacionDeDatos;
