import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, MapPin } from 'lucide-react';
import '../Styles/StyleRegistroDelClima.css';

const SimpleChart = ({ data, title, color = "blue" }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="flex items-end space-x-1 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full ${color}-500 rounded-t`}
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: '4px'
              }}
            ></div>
            <div className="text-xs mt-1 text-gray-600 transform -rotate-45 origin-top-left">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegistroDelClima = () => {
  const [selectedZone, setSelectedZone] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Datos de estaciones meteorológicas
  const weatherStations = [
    { id: 1, name: 'Santiago Centro', lat: -33.4489, lng: -70.6693, km: 0, temp: 18, humidity: 65, wind: 12, rain: 0, status: 'normal' },
    { id: 2, name: 'Rancagua', lat: -34.1708, lng: -70.7394, km: 87, temp: 16, humidity: 70, wind: 8, rain: 2, status: 'precaucion' },
    // Más datos...
  ];

  // Datos para gráficos simples
  const tempData = [
    { label: '00:00', value: 12 },
    { label: '03:00', value: 10 },
    // Más datos...
  ];

  const rainData = [
    { label: '00:00', value: 5 },
    { label: '03:00', value: 8 },
    // Más datos...
  ];

  const windData = [
    { label: '00:00', value: 20 },
    { label: '03:00', value: 22 },
    // Más datos...
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const getFilteredStations = () => {
    if (selectedZone === 'all') return weatherStations;
    return weatherStations.filter(station => {
      if (selectedZone === 'norte') return station.km < 300;
      if (selectedZone === 'centro') return station.km >= 300 && station.km < 600;
      if (selectedZone === 'sur') return station.km >= 600;
      return true;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'precaucion': return 'bg-yellow-500';
      case 'critico': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getWeatherIcon = (temp, rain) => {
    if (rain > 10) return <CloudRain className="text-blue-500" size={16} />;
    if (rain > 0) return <Cloud className="text-gray-500" size={16} />;
    return <Sun className="text-yellow-500" size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Contenido principal */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro del Clima</h1>
            <p className="text-gray-600">Monitoreo meteorológico en tiempo real - Ruta 5 Sur</p>
            <div className="text-sm text-gray-500">
              Última actualización: {currentTime.toLocaleTimeString()}
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="all">Todas las zonas</option>
                  <option value="norte">Norte (Santiago-Talca)</option>
                  <option value="centro">Centro (Talca-Temuco)</option>
                  <option value="sur">Sur (Temuco-Pto.Montt)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="1h">Última hora</option>
                  <option value="24h">Últimas 24 horas</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gráficos de Tendencias Simples */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <SimpleChart
                data={tempData}
                title="Temperatura (°C)"
                color="red"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <SimpleChart
                data={rainData}
                title="Precipitación (mm)"
                color="blue"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <SimpleChart
                data={windData}
                title="Viento (km/h)"
                color="green"
              />
            </div>
          </div>

          {/* Tabla de Datos de Estaciones */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Datos Detallados por Estación</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2">Estación</th>
                    <th className="text-left p-2">Km</th>
                    <th className="text-left p-2">Temp</th>
                    <th className="text-left p-2">Humedad</th>
                    <th className="text-left p-2">Viento</th>
                    <th className="text-left p-2">Lluvia</th>
                    <th className="text-left p-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredStations().map(station => (
                    <tr key={station.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-medium">{station.name}</td>
                      <td className="p-2">{station.km}</td>
                      <td className="p-2">{station.temp}°C</td>
                      <td className="p-2">{station.humidity}%</td>
                      <td className="p-2">{station.wind} km/h</td>
                      <td className="p-2">{station.rain} mm</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(station.status)}`}>
                          {station.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RegistroDelClima;
