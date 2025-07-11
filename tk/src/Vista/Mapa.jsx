import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Zap, AlertTriangle, Search, Layers, Activity, Clock, Car, Truck, Calendar, ZoomIn, ZoomOut, Move } from 'lucide-react';

const Mapa = ({ profileData, configData }) => {
  const [selectedLayer, setSelectedLayer] = useState('traffic');
  const [searchQuery, setSearchQuery] = useState('');
  const [datosTrafico, setDatosTrafico] = useState([]);
  const [datosClima, setDatosClima] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeaje, setSelectedPeaje] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const peajes = [
    { id: 1, nombre: 'Peaje Angostura', km: 54, x: 80, y: 280 },
    { id: 2, nombre: 'Peaje Troncal Quinta', km: 162, x: 180, y: 300 },
    { id: 3, nombre: 'Peaje Troncal Río Claro', km: 220, x: 280, y: 250 },
    { id: 4, nombre: 'Peaje Troncal Retiro', km: 320, x: 380, y: 280 },
    { id: 5, nombre: 'Peaje Troncal Santa Clara', km: 444, x: 480, y: 320 },
    { id: 6, nombre: 'Peaje Troncal Las Maicas', km: 555, x: 580, y: 290 },
    { id: 7, nombre: 'Peaje Troncal Púa', km: 620, x: 680, y: 310 },
    { id: 8, nombre: 'Peaje Troncal Quepe', km: 693, x: 780, y: 270 },
    { id: 9, nombre: 'Peaje Troncal Lanco', km: 775, x: 880, y: 300 },
    { id: 10, nombre: 'Peaje Troncal La Unión', km: 875, x: 980, y: 250 },
    { id: 11, nombre: 'Peaje Troncal Cuatro Vientos', km: 960, x: 1080, y: 280 },
    { id: 12, nombre: 'Peaje Troncal Puerto Montt', km: 1020, x: 1180, y: 300 }
  ];

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [traficoRes, climaRes] = await Promise.all([
        fetch('http://localhost:5000/api/simulacion-trafico'),
        fetch('http://localhost:5000/api/simulacion-clima')
      ]);

      const trafico = await traficoRes.json();
      const clima = await climaRes.json();

      const traficoFiltrado = trafico.filter(item => {
        const fechaItem = item.fecha.split('T')[0];
        return fechaItem >= fechaInicio && fechaItem <= fechaFin;
      });
      const climaFiltrado = clima.filter(item => {
        const fechaItem = item.fecha.split('T')[0];
        return fechaItem >= fechaInicio && fechaItem <= fechaFin;
      });

      setDatosTrafico(traficoFiltrado);
      setDatosClima(climaFiltrado);
      generarAlertas(traficoFiltrado, climaFiltrado);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarAlertas = (trafico, clima) => {
    const alertasGeneradas = [];

    const trafficoPorPeaje = trafico.reduce((acc, item) => {
      acc[item.peaje] = (acc[item.peaje] || 0) + 1;
      return acc;
    }, {});

    Object.entries(trafficoPorPeaje).forEach(([peaje, cantidad]) => {
      if (cantidad > 8) {
        alertasGeneradas.push({
          id: Date.now() + Math.random(),
          tipo: 'sobrecarga',
          peaje,
          mensaje: `Acumulación alta: ${cantidad} vehículos en período`,
          severidad: cantidad > 15 ? 'alta' : 'media',
          tiempo: new Date().toLocaleTimeString()
        });
      }
    });

    clima.forEach(evento => {
      if (['Tormenta', 'Granizo', 'Nieve'].includes(evento.tipoClima) &&
          (evento.intensidad === 'Extrema' || (evento.intensidad === 'Alta' && evento.desgasteEstimado > 5))) {
        alertasGeneradas.push({
          id: Date.now() + Math.random(),
          tipo: 'clima',
          peaje: evento.ubicacion,
          mensaje: `${evento.tipoClima} ${evento.intensidad} - Desgaste: ${evento.desgasteEstimado}/10`,
          severidad: evento.desgasteEstimado > 7 ? 'alta' : 'media',
          tiempo: new Date().toLocaleTimeString()
        });
      }
    });

    setAlertas(alertasGeneradas);
  };

  const obtenerDatosPeaje = (nombrePeaje) => {
    const vehiculos = datosTrafico.filter(item => item.peaje === nombrePeaje);
    const clima = datosClima.find(item => item.ubicacion === nombrePeaje);
    const alerta = alertas.find(item => item.peaje === nombrePeaje);

    return {
      vehiculos: vehiculos.length,
      ingresos: vehiculos.reduce((sum, v) => sum + v.tarifa, 0),
      clima,
      alerta,
      tiposVehiculos: vehiculos.reduce((acc, v) => {
        acc[v.categoria] = (acc[v.categoria] || 0) + 1;
        return acc;
      }, {})
    };
  };

  const getColorTrafico = (cantidadVehiculos) => {
    if (cantidadVehiculos > 15) return '#dc2626';
    if (cantidadVehiculos > 8) return '#ef4444';
    if (cantidadVehiculos > 4) return '#f59e0b';
    if (cantidadVehiculos > 1) return '#10b981';
    return '#6b7280';
  };

  const getColorClima = (clima) => {
    if (!clima) return '#6b7280';
    const severidad = clima.desgasteEstimado;
    if (severidad > 7) return '#dc2626';
    if (severidad > 5) return '#ef4444';
    if (severidad > 3) return '#f59e0b';
    return '#10b981';
  };

  const getColorSegmento = (peajeIndex) => {
    if (peajeIndex >= peajes.length - 1) return '#4b5563';

    const peaje1 = peajes[peajeIndex];
    const peaje2 = peajes[peajeIndex + 1];
    const datos1 = obtenerDatosPeaje(peaje1.nombre);
    const datos2 = obtenerDatosPeaje(peaje2.nombre);

    const promedioVehiculos = (datos1.vehiculos + datos2.vehiculos) / 2;

    if (selectedLayer === 'traffic') {
      return getColorTrafico(promedioVehiculos);
    } else if (selectedLayer === 'climate') {
      const clima1 = datos1.clima;
      const clima2 = datos2.clima;
      if (clima1 && clima2) {
        const promedioDesgaste = (clima1.desgasteEstimado + clima2.desgasteEstimado) / 2;
        return getColorClima({ desgasteEstimado: promedioDesgaste });
      }
    } else if (selectedLayer === 'alerts') {
      return (datos1.alerta || datos2.alerta) ? '#ef4444' : '#10b981';
    }

    return '#4b5563';
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;

    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(2.5, prev.scale + delta))
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  const calcularDiasRango = () => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;
    return diferencia;
  };

  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Activity size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando datos del mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          🛣️ Mapa de Tráfico - Red Vial Sur de Chile
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)', flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Search size={16} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Buscar peaje</span>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.375rem', color: 'white', fontSize: '0.875rem' }}
            />
          </div>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Calendar size={16} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Rango de fechas</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                style={{ padding: '0.4rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.375rem', color: 'white', fontSize: '0.75rem', width: '130px' }}
              />
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>a</span>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                style={{ padding: '0.4rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.375rem', color: 'white', fontSize: '0.75rem', width: '130px' }}
              />
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Layers size={16} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Vista</span>
            </div>
            <select value={selectedLayer} onChange={(e) => setSelectedLayer(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.375rem', color: 'white', fontSize: '0.875rem' }}>
              <option value="traffic">Tráfico</option>
              <option value="climate">Clima</option>
              <option value="alerts">Alertas</option>
            </select>
          </div>
          <button onClick={cargarDatos} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            <Navigation size={16} style={{ marginRight: '0.5rem' }} />
            Actualizar
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
          <button onClick={() => handleZoom(0.2)} style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(75, 85, 99, 0.5)', cursor: 'pointer' }}>
            <ZoomIn size={16} />
          </button>
          <button onClick={() => handleZoom(-0.2)} style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(75, 85, 99, 0.5)', cursor: 'pointer' }}>
            <ZoomOut size={16} />
          </button>
          <button onClick={resetView} style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(75, 85, 99, 0.5)', cursor: 'pointer' }}>
            <Move size={16} />
          </button>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Zoom: {Math.round(transform.scale * 100)}%
          </span>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem', marginLeft: '1rem' }}>
            📊 {calcularDiasRango()} días de datos
          </span>
        </div>

        <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', border: '1px solid rgba(75, 85, 99, 0.3)', height: '600px', position: 'relative', overflow: 'hidden', marginBottom: '1.5rem', cursor: isDragging ? 'grabbing' : 'grab' }}>
          <svg
            ref={svgRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            viewBox="0 0 1400 600"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              <defs>
                <linearGradient id="cielo" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#065f46', stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              <rect width="1400" height="600" fill="url(#cielo)" />
              <polygon points="0,200 200,150 400,180 600,140 800,160 1000,130 1200,150 1400,140 1400,600 0,600" fill="rgba(75, 85, 99, 0.2)" />

              {peajes.slice(0, -1).map((peaje, index) => {
                const nextPeaje = peajes[index + 1];
                const color = getColorSegmento(index);

                return (
                  <g key={`segment-${index}`}>
                    <line
                      x1={peaje.x}
                      y1={peaje.y}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y}
                      stroke={color}
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <line
                      x1={peaje.x}
                      y1={peaje.y}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y}
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray="15,15"
                      strokeLinecap="round"
                    />
                    <line
                      x1={peaje.x}
                      y1={peaje.y - 12}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y - 12}
                      stroke="#374151"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1={peaje.x}
                      y1={peaje.y + 12}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y + 12}
                      stroke="#374151"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {peajes.map(peaje => {
                const datos = obtenerDatosPeaje(peaje.nombre);
                const color = selectedLayer === 'traffic' ? getColorTrafico(datos.vehiculos) :
                              selectedLayer === 'climate' ? getColorClima(datos.clima) :
                              datos.alerta ? '#ef4444' : '#10b981';

                const shouldShow = !searchQuery || peaje.nombre.toLowerCase().includes(searchQuery.toLowerCase());

                if (!shouldShow) return null;

                const radius = datos.vehiculos > 12 ? 25 : datos.vehiculos > 6 ? 20 : datos.vehiculos > 2 ? 16 : 12;

                return (
                  <g key={peaje.id}>
                    {selectedPeaje === peaje.id && (
                      <circle
                        cx={peaje.x}
                        cy={peaje.y}
                        r={radius + 8}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="4"
                        opacity="0.8"
                      />
                    )}

                    <circle
                      cx={peaje.x}
                      cy={peaje.y}
                      r={radius}
                      fill={color}
                      stroke="white"
                      strokeWidth="4"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPeaje(selectedPeaje === peaje.id ? null : peaje.id);
                      }}
                    />

                    <text
                      x={peaje.x}
                      y={peaje.y + radius + 25}
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {peaje.nombre.replace('Peaje Troncal ', '').replace('Peaje ', '')}
                    </text>

                    <text
                      x={peaje.x}
                      y={peaje.y + radius + 40}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="12"
                      style={{ pointerEvents: 'none' }}
                    >
                      Km {peaje.km}
                    </text>

                    {datos.vehiculos > 0 && (
                      <>
                        <circle
                          cx={peaje.x + radius - 5}
                          cy={peaje.y - radius + 5}
                          r="14"
                          fill="#1f2937"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={peaje.x + radius - 5}
                          y={peaje.y - radius + 11}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                          style={{ pointerEvents: 'none' }}
                        >
                          {datos.vehiculos}
                        </text>
                      </>
                    )}

                    {datos.alerta && (
                      <g>
                        <circle
                          cx={peaje.x - radius + 5}
                          cy={peaje.y - radius + 5}
                          r="12"
                          fill="#ef4444"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={peaje.x - radius + 5}
                          y={peaje.y - radius + 10}
                          textAnchor="middle"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                          style={{ pointerEvents: 'none' }}
                        >
                          !
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.95)', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', minWidth: '180px' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              {selectedLayer === 'traffic' ? '🚗 Nivel de Tráfico' : selectedLayer === 'climate' ? '🌤️ Impacto Climático' : '🚨 Estado de Alertas'}
            </div>
            {selectedLayer === 'traffic' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dc2626' }}></div>
                  <span style={{ color: '#d1d5db' }}>Crítico (&gt;15)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#d1d5db' }}>Alto (8-15)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <span style={{ color: '#d1d5db' }}>Medio (4-8)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#d1d5db' }}>Bajo (&lt;3)</span>
                </div>
              </>
            )}
            {selectedLayer === 'alerts' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#d1d5db' }}>Con alertas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#d1d5db' }}>Normal</span>
                </div>
              </>
            )}
            {selectedLayer === 'climate' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dc2626' }}></div>
                  <span style={{ color: '#d1d5db' }}>Severo (&gt;7)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#d1d5db' }}>Alto (5-7)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <span style={{ color: '#d1d5db' }}>Medio (3-5)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#d1d5db' }}>Bajo (&lt;3)</span>
                </div>
              </>
            )}
          </div>

          <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.95)', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              📅 Período: {calcularDiasRango()} días
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
              🚗 {datosTrafico.length} registros de tráfico
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
              🌤️ {datosClima.length} eventos climáticos
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
              🚨 {alertas.length} alertas activas
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.95)', borderRadius: '0.5rem', padding: '0.5rem', fontSize: '0.75rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              🧭 N
            </div>
            <div style={{ color: '#9ca3af', textAlign: 'center' }}>
              ← O &nbsp;&nbsp;&nbsp; E →
            </div>
            <div style={{ color: '#9ca3af', textAlign: 'center' }}>
              S
            </div>
          </div>
        </div>

        {selectedPeaje && (() => {
          const peaje = peajes.find(p => p.id === selectedPeaje);
          const datos = obtenerDatosPeaje(peaje.nombre);
          return (
            <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                📍 {peaje.nombre} - Km {peaje.km}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Vehículos en período</p>
                  <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>🚗 {datos.vehiculos}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Ingresos acumulados</p>
                  <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    💰 ${datos.ingresos.toLocaleString()}
                  </p>
                </div>
                {datos.clima && (
                  <>
                    <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Condición climática</p>
                      <p style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                        🌤️ {datos.clima.tipoClima} ({datos.clima.intensidad})
                      </p>
                    </div>
                    <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Desgaste estimado</p>
                      <p style={{ color: datos.clima.desgasteEstimado > 6 ? '#ef4444' : datos.clima.desgasteEstimado > 4 ? '#f59e0b' : '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        ⚠️ {datos.clima.desgasteEstimado}/10
                      </p>
                    </div>
                    <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Temperatura</p>
                      <p style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                        🌡️ {datos.clima.temperatura}°C
                      </p>
                    </div>
                  </>
                )}
                {datos.alerta && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #ef4444' }}>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Estado de alerta</p>
                    <p style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 'bold' }}>
                      🚨 {datos.alerta.severidad === 'alta' ? 'CRÍTICA' : 'MEDIA'}
                    </p>
                  </div>
                )}
              </div>

              {Object.keys(datos.tiposVehiculos).length > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>📊 Distribución por categorías:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                    {Object.entries(datos.tiposVehiculos).map(([categoria, cantidad]) => (
                      <div key={categoria} style={{ backgroundColor: 'rgba(75, 85, 99, 0.5)', padding: '0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                        <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>{cantidad}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{categoria}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {alertas.length > 0 && (
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              <AlertTriangle size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              🚨 Centro de Alertas ({alertas.length} activas)
            </h3>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
                {alertas.map(alerta => (
                  <div key={alerta.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', border: `2px solid ${alerta.severidad === 'alta' ? '#ef4444' : '#f59e0b'}` }}>
                    <div style={{ flexShrink: 0 }}>
                      {alerta.tipo === 'sobrecarga' ?
                        <div style={{ backgroundColor: '#f59e0b', borderRadius: '50%', padding: '0.5rem' }}>
                          <Car size={20} color="white" />
                        </div> :
                        <div style={{ backgroundColor: '#ef4444', borderRadius: '50%', padding: '0.5rem' }}>
                          <Zap size={20} color="white" />
                        </div>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        📍 {alerta.peaje}
                      </p>
                      <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{alerta.mensaje}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          backgroundColor: alerta.severidad === 'alta' ? '#ef4444' : '#f59e0b',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          {alerta.severidad === 'alta' ? '🔴 ALTA' : '🟡 MEDIA'}
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          <Clock size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                          {alerta.tiempo}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {alertas.length === 0 && (
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(75, 85, 99, 0.3)', textAlign: 'center' }}>
            <h3 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              ✅ Sistema Operativo Normal
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              No se detectaron alertas en el período seleccionado. Todas las estaciones funcionan dentro de parámetros normales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapa;



//codigo antiguo
/*
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, AlertTriangle, Search, Layers, Activity, Clock, Car, Truck, Calendar, ZoomIn, ZoomOut, Move } from 'lucide-react';

const Mapa = ({ profileData, configData }) => {
  const [selectedLayer, setSelectedLayer] = useState('traffic');
  const [searchQuery, setSearchQuery] = useState('');
  const [datosTrafico, setDatosTrafico] = useState([]);
  const [datosClima, setDatosClima] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeaje, setSelectedPeaje] = useState(null);

  const peajes = [
    { id: 1, nombre: 'Peaje Angostura', km: 54, x: 20, y: 15 },
    { id: 2, nombre: 'Peaje Troncal Quinta', km: 162, x: 35, y: 25 },
    { id: 3, nombre: 'Peaje Troncal Río Claro', km: 220, x: 50, y: 35 },
    { id: 4, nombre: 'Peaje Troncal Retiro', km: 320, x: 65, y: 45 },
    { id: 5, nombre: 'Peaje Troncal Santa Clara', km: 444, x: 80, y: 55 },
    { id: 6, nombre: 'Peaje Troncal Las Maicas', km: 555, x: 25, y: 65 },
    { id: 7, nombre: 'Peaje Troncal Púa', km: 620, x: 40, y: 75 },
    { id: 8, nombre: 'Peaje Troncal Quepe', km: 693, x: 55, y: 85 },
    { id: 9, nombre: 'Peaje Troncal Lanco', km: 775, x: 70, y: 25 },
    { id: 10, nombre: 'Peaje Troncal La Unión', km: 875, x: 85, y: 35 },
    { id: 11, nombre: 'Peaje Troncal Cuatro Vientos', km: 960, x: 30, y: 45 },
    { id: 12, nombre: 'Peaje Troncal Puerto Montt', km: 1020, x: 45, y: 55 }
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [traficoRes, climaRes] = await Promise.all([
        fetch('http://localhost:5000/api/simulacion-trafico'),
        fetch('http://localhost:5000/api/simulacion-clima')
      ]);

      const trafico = await traficoRes.json();
      const clima = await climaRes.json();

      setDatosTrafico(trafico);
      setDatosClima(clima);
      generarAlertas(trafico, clima);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarAlertas = (trafico, clima) => {
    const alertasGeneradas = [];

    const trafficoPorPeaje = trafico.reduce((acc, item) => {
      acc[item.peaje] = (acc[item.peaje] || 0) + 1;
      return acc;
    }, {});

    Object.entries(trafficoPorPeaje).forEach(([peaje, cantidad]) => {
      if (cantidad > 8) {
        alertasGeneradas.push({
          id: Date.now() + Math.random(),
          tipo: 'sobrecarga',
          peaje,
          mensaje: `Sobrecarga de tráfico detectada: ${cantidad} vehículos`,
          severidad: cantidad > 15 ? 'alta' : 'media',
          tiempo: new Date().toLocaleTimeString()
        });
      }
    });

    clima.forEach(evento => {
      if (['Tormenta', 'Granizo', 'Nieve'].includes(evento.tipoClima) && evento.intensidad === 'Alta') {
        alertasGeneradas.push({
          id: Date.now() + Math.random(),
          tipo: 'clima',
          peaje: evento.ubicacion,
          mensaje: `${evento.tipoClima} ${evento.intensidad} - Desgaste: ${evento.desgasteEstimado}/10`,
          severidad: 'alta',
          tiempo: new Date().toLocaleTimeString()
        });
      }
    });

    setAlertas(alertasGeneradas);
  };

  const obtenerDatosPeaje = (nombrePeaje) => {
    const vehiculos = datosTrafico.filter(item => item.peaje === nombrePeaje);
    const clima = datosClima.find(item => item.ubicacion === nombrePeaje);
    const alerta = alertas.find(item => item.peaje === nombrePeaje);

    return {
      vehiculos: vehiculos.length,
      ingresos: vehiculos.reduce((sum, v) => sum + v.tarifa, 0),
      clima,
      alerta,
      tiposVehiculos: vehiculos.reduce((acc, v) => {
        acc[v.categoria] = (acc[v.categoria] || 0) + 1;
        return acc;
      }, {})
    };
  };

  const getColorTrafico = (cantidadVehiculos) => {
    if (cantidadVehiculos > 15) return '#ef4444';
    if (cantidadVehiculos > 8) return '#f59e0b';
    if (cantidadVehiculos > 3) return '#10b981';
    return '#6b7280';
  };

  const getColorClima = (clima) => {
    if (!clima) return '#6b7280';
    const severidad = clima.desgasteEstimado;
    if (severidad > 7) return '#dc2626';
    if (severidad > 4) return '#f59e0b';
    return '#10b981';
  };

  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Activity size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando datos del mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          Mapa de Tráfico en Tiempo Real
        </h1>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)', flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Search size={16} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Buscar peaje</span>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.375rem', color: 'white', fontSize: '0.875rem' }}
            />
          </div>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Layers size={16} color="#8B5CF6" />
              <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Vista</span>
            </div>
            <select value={selectedLayer} onChange={(e) => setSelectedLayer(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.375rem', color: 'white', fontSize: '0.875rem' }}>
              <option value="traffic">Tráfico</option>
              <option value="climate">Clima</option>
              <option value="alerts">Alertas</option>
            </select>
          </div>
          <button onClick={cargarDatos} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            <Navigation size={16} style={{ marginRight: '0.5rem' }} />
            Actualizar
          </button>
        </div>

        <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', border: '1px solid rgba(75, 85, 99, 0.3)', height: '400px', position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <path d="M 50 50 Q 200 100 350 150 Q 500 200 650 250 Q 800 300 950 350" stroke="#4b5563" strokeWidth="8" fill="none" />
            <path d="M 100 100 Q 250 150 400 200 Q 550 250 700 300" stroke="#4b5563" strokeWidth="6" fill="none" />

            {peajes.map(peaje => {
              const datos = obtenerDatosPeaje(peaje.nombre);
              const color = selectedLayer === 'traffic' ? getColorTrafico(datos.vehiculos) :
                            selectedLayer === 'climate' ? getColorClima(datos.clima) :
                            datos.alerta ? '#ef4444' : '#10b981';

              const shouldShow = !searchQuery || peaje.nombre.toLowerCase().includes(searchQuery.toLowerCase());

              if (!shouldShow) return null;

              return (
                <g key={peaje.id}>
                  <circle
                    cx={peaje.x * 10}
                    cy={peaje.y * 4}
                    r={datos.vehiculos > 10 ? 12 : datos.vehiculos > 5 ? 8 : 6}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedPeaje(selectedPeaje === peaje.id ? null : peaje.id)}
                  />
                  <text
                    x={peaje.x * 10}
                    y={peaje.y * 4 + 20}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    style={{ pointerEvents: 'none' }}
                  >
                    {peaje.nombre.split(' ').pop()}
                  </text>
                  {datos.vehiculos > 0 && (
                    <text
                      x={peaje.x * 10}
                      y={peaje.y * 4 - 15}
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {datos.vehiculos}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.9)', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {selectedLayer === 'traffic' ? 'Tráfico' : selectedLayer === 'climate' ? 'Clima' : 'Alertas'}
            </div>
            {selectedLayer === 'traffic' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#d1d5db' }}>Alto (&gt;15)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <span style={{ color: '#d1d5db' }}>Medio (8-15)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#d1d5db' }}>Bajo (&lt;8)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedPeaje && (() => {
          const peaje = peajes.find(p => p.id === selectedPeaje);
          const datos = obtenerDatosPeaje(peaje.nombre);
          return (
            <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                {peaje.nombre} - Km {peaje.km}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Vehículos</p>
                  <p style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>{datos.vehiculos}</p>
                </div>
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Ingresos</p>
                  <p style={{ color: '#10b981', fontSize: '1rem', fontWeight: 'bold' }}>
                    ${datos.ingresos.toLocaleString()}
                  </p>
                </div>
                {datos.clima && (
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Clima</p>
                    <p style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>
                      {datos.clima.tipoClima}
                    </p>
                  </div>
                )}
                {datos.alerta && (
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Estado</p>
                    <p style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 'bold' }}>⚠ Alerta</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {alertas.length > 0 && (
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              <AlertTriangle size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Alertas Activas ({alertas.length})
            </h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {alertas.map(alerta => (
                <div key={alerta.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', marginBottom: '0.5rem', borderLeft: `4px solid ${alerta.severidad === 'alta' ? '#ef4444' : '#f59e0b'}` }}>
                  <div style={{ flexShrink: 0 }}>
                    {alerta.tipo === 'sobrecarga' ? <Car size={16} color="#f59e0b" /> : <Zap size={16} color="#ef4444" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {alerta.peaje}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{alerta.mensaje}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: alerta.severidad === 'alta' ? '#ef4444' : '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {alerta.severidad === 'alta' ? 'Alta' : 'Media'}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      <Clock size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                      {alerta.tiempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapa;
*/