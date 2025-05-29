import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, MapPin } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const RegistroDelClima = () => {
  const [selectedZone, setSelectedZone] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [currentTime, setCurrentTime] = useState(new Date());

  // ===== DATOS DE PRUEBA - REEMPLAZAR CON API REAL =====
  // TODO: Integrar con API meteorológica real (ej: OpenWeatherMap, WeatherAPI)
  const weatherStations = [
    { id: 1, name: 'Santiago Centro', lat: -33.4489, lng: -70.6693, km: 0, temp: 18, humidity: 65, wind: 12, rain: 0, status: 'normal' },
    { id: 2, name: 'Rancagua', lat: -34.1708, lng: -70.7394, km: 87, temp: 16, humidity: 70, wind: 8, rain: 2, status: 'precaucion' },
    { id: 3, name: 'Curicó', lat: -34.9829, lng: -71.2394, km: 192, temp: 14, humidity: 75, wind: 15, rain: 5, status: 'precaucion' },
    { id: 4, name: 'Talca', lat: -35.4264, lng: -71.6554, km: 255, temp: 13, humidity: 80, wind: 18, rain: 8, status: 'critico' },
    { id: 5, name: 'Chillán', lat: -36.6065, lng: -72.1034, km: 407, temp: 11, humidity: 85, wind: 22, rain: 12, status: 'critico' },
    { id: 6, name: 'Los Ángeles', lat: -37.4669, lng: -72.3540, km: 518, temp: 9, humidity: 88, wind: 25, rain: 15, status: 'critico' },
    { id: 7, name: 'Temuco', lat: -38.7359, lng: -72.5904, km: 677, temp: 8, humidity: 90, wind: 28, rain: 18, status: 'critico' },
    { id: 8, name: 'Valdivia', lat: -39.8142, lng: -73.2459, km: 765, temp: 7, humidity: 92, wind: 30, rain: 22, status: 'critico' },
    { id: 9, name: 'Osorno', lat: -40.5736, lng: -73.1344, km: 887, temp: 6, humidity: 94, wind: 32, rain: 25, status: 'critico' },
    { id: 10, name: 'Puerto Montt', lat: -41.4693, lng: -72.9424, km: 1016, temp: 5, humidity: 96, wind: 35, rain: 28, status: 'critico' }
  ];

  // Datos históricos simulados - TODO: Reemplazar con base de datos real
  const historicalData = [
    { time: '00:00', temp: 12, humidity: 85, wind: 20, rain: 5 },
    { time: '03:00', temp: 10, humidity: 88, wind: 22, rain: 8 },
    { time: '06:00', temp: 8, humidity: 90, wind: 25, rain: 12 },
    { time: '09:00', temp: 11, humidity: 82, wind: 18, rain: 3 },
    { time: '12:00', temp: 15, humidity: 75, wind: 15, rain: 0 },
    { time: '15:00', temp: 17, humidity: 70, wind: 12, rain: 0 },
    { time: '18:00', temp: 14, humidity: 78, wind: 16, rain: 2 },
    { time: '21:00', temp: 12, humidity: 83, wind: 19, rain: 4 }
  ];

  // Métricas de impacto en carretera - TODO: Calcular con algoritmos reales
  const roadImpact = [
    { zone: 'Norte', visibility: 95, roadCondition: 90, riskLevel: 15 },
    { zone: 'Centro', visibility: 75, roadCondition: 70, riskLevel: 45 },
    { zone: 'Sur', visibility: 45, roadCondition: 40, riskLevel: 85 }
  ];

  const weatherAlerts = [
    { id: 1, type: 'lluvia', zone: 'Talca-Chillán', severity: 'alta', message: 'Lluvia intensa esperada próximas 3 horas' },
    { id: 2, type: 'viento', zone: 'Sur', severity: 'media', message: 'Vientos fuertes 35+ km/h' },
    { id: 3, type: 'visibilidad', zone: 'Puerto Montt', severity: 'alta', message: 'Visibilidad reducida < 50m' }
  ];
  // ===== FIN DATOS DE PRUEBA =====

  useEffect(() => {
    // TODO: Implementar WebSocket para datos en tiempo real
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
    if (rain > 10) return <CloudRain className="text-blue-500" />;
    if (rain > 0) return <Cloud className="text-gray-500" />;
    return <Sun className="text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro del Clima</h1>
            <p className="text-gray-600">Monitoreo meteorológico en tiempo real - Ruta 5 Sur</p>
            <div className="text-sm text-gray-500">
              Última actualización: {currentTime.toLocaleTimeString()}
              {/* TODO: Mostrar timestamp real de última actualización de API */}
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

          {/* Alertas Meteorológicas */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="mr-2" /> Alertas Meteorológicas Activas
            </h2>
            <div className="space-y-2">
              {weatherAlerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded border-l-4 ${
                  alert.severity === 'alta' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'media' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex justify-between">
                    <span className="font-medium">{alert.zone}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      alert.severity === 'alta' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'media' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa de Estaciones */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" /> Mapa de Estaciones Meteorológicas
            </h2>
            <div className="relative bg-blue-50 rounded-lg p-4 min-h-96">
              {/* Simulación de mapa - TODO: Integrar con Google Maps o Mapbox */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-gray-400 rounded">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                  RUTA 5 SUR
                </div>
              </div>
              
              {getFilteredStations().map((station, index) => (
                <div 
                  key={station.id}
                  className="absolute flex items-center"
                  style={{ 
                    top: `${(station.km / 1100) * 80 + 10}%`,
                    left: index % 2 === 0 ? '45%' : '55%'
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)} mr-2`}></div>
                  <div className="bg-white rounded shadow-md p-2 text-xs min-w-32">
                    <div className="font-medium">{station.name}</div>
                    <div className="flex items-center space-x-2">
                      {getWeatherIcon(station.temp, station.rain)}
                      <span>{station.temp}°C</span>
                      <span>{station.rain}mm</span>
                    </div>
                    <div className="text-gray-500">Km {station.km}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráficos de Tendencias */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Thermometer className="mr-2" /> Temperatura y Precipitaciones
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#ff7300" name="Temperatura (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#8884d8" name="Precipitación (mm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Wind className="mr-2" /> Viento y Humedad
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="wind" stroke="#82ca9d" name="Viento (km/h)" />
                  <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#ffc658" name="Humedad (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Métricas de Impacto */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Impacto en Condiciones de Carretera</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roadImpact.map((zone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">{zone.zone}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Visibilidad</span>
                        <span>{zone.visibility}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${zone.visibility > 80 ? 'bg-green-500' : zone.visibility > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${zone.visibility}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Estado Pavimento</span>
                        <span>{zone.roadCondition}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${zone.roadCondition > 80 ? 'bg-green-500' : zone.roadCondition > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${zone.roadCondition}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Nivel de Riesgo</span>
                        <span>{zone.riskLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${zone.riskLevel < 30 ? 'bg-green-500' : zone.riskLevel < 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${zone.riskLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Thermometer className="mx-auto mb-2 text-red-500" size={24} />
              <div className="text-2xl font-bold">12°C</div>
              <div className="text-sm text-gray-600">Temp. Promedio</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Droplets className="mx-auto mb-2 text-blue-500" size={24} />
              <div className="text-2xl font-bold">8mm</div>
              <div className="text-sm text-gray-600">Precipitación</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Wind className="mx-auto mb-2 text-green-500" size={24} />
              <div className="text-2xl font-bold">23km/h</div>
              <div className="text-sm text-gray-600">Viento</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <Eye className="mx-auto mb-2 text-purple-500" size={24} />
              <div className="text-2xl font-bold">68%</div>
              <div className="text-sm text-gray-600">Visibilidad</div>
            </div>
          </div>

          {/* Nota sobre datos de prueba */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Los datos mostrados son simulaciones para demostración. 
              En producción se integrarán APIs meteorológicas reales y sensores IoT en carretera.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default RegistroDelClima;