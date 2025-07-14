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
  const [showUmbrales, setShowUmbrales] = useState(false);
  const [tipoConexion, setTipoConexion] = useState('desconocido'); // 'real', 'generado', 'simulado', 'sin-datos'
  const [umbrales, setUmbrales] = useState({
    trafico: {
      critico: 15,
      alto: 8,
      medio: 4,
      bajo: 1
    },
    clima: {
      severo: 7,
      alto: 5,
      medio: 3,
      bajo: 1
    },
    alertas: {
      sobrecarga: 8,
      climaAlta: 5
    }
  });
  const svgRef = useRef(null);

  // Posiciones mejoradas y más realistas para los peajes
  const peajes = [
    { id: 1, nombre: 'Peaje Angostura', km: 54, x: 100, y: 180 },
    { id: 2, nombre: 'Peaje Troncal Quinta', km: 162, x: 200, y: 200 },
    { id: 3, nombre: 'Peaje Troncal Río Claro', km: 220, x: 300, y: 190 },
    { id: 4, nombre: 'Peaje Troncal Retiro', km: 320, x: 400, y: 210 },
    { id: 5, nombre: 'Peaje Troncal Santa Clara', km: 444, x: 500, y: 230 },
    { id: 6, nombre: 'Peaje Troncal Las Maicas', km: 555, x: 600, y: 220 },
    { id: 7, nombre: 'Peaje Troncal Púa', km: 620, x: 700, y: 240 },
    { id: 8, nombre: 'Peaje Troncal Quepe', km: 693, x: 800, y: 250 },
    { id: 9, nombre: 'Peaje Troncal Lanco', km: 775, x: 900, y: 260 },
    { id: 10, nombre: 'Peaje Troncal La Unión', km: 875, x: 1000, y: 270 },
    { id: 11, nombre: 'Peaje Troncal Cuatro Vientos', km: 960, x: 1100, y: 280 },
    { id: 12, nombre: 'Peaje Troncal Puerto Montt', km: 1020, x: 1200, y: 290 }
  ];

  // Simulación de datos cuando no hay API
  const generarDatosSimulados = () => {
    const traficoSimulado = [];
    const climaSimulado = [];

    peajes.forEach(peaje => {
      // Generar tráfico aleatorio para cada peaje
      const cantidadVehiculos = Math.floor(Math.random() * 20) + 1;
      for (let i = 0; i < cantidadVehiculos; i++) {
        traficoSimulado.push({
          peaje: peaje.nombre,
          categoria: ['Automóvil', 'Motocicleta', 'Camión', 'Bus'][Math.floor(Math.random() * 4)],
          tarifa: Math.floor(Math.random() * 10000) + 2000,
          fecha: new Date().toISOString()
        });
      }

      // Generar clima aleatorio
      if (Math.random() > 0.3) {
        climaSimulado.push({
          ubicacion: peaje.nombre,
          tipoClima: ['Soleado', 'Nublado', 'Lluvia', 'Tormenta', 'Nieve'][Math.floor(Math.random() * 5)],
          intensidad: ['Baja', 'Media', 'Alta', 'Extrema'][Math.floor(Math.random() * 4)],
          temperatura: Math.floor(Math.random() * 30) + 5,
          desgasteEstimado: Math.floor(Math.random() * 10) + 1,
          fecha: new Date().toISOString()
        });
      }
    });

    return { trafico: traficoSimulado, clima: climaSimulado };
  };

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar datos desde las APIs
      try {
        const [traficoRes, climaRes] = await Promise.all([
          fetch('http://localhost:5000/api/simulacion-trafico'),
          fetch('http://localhost:5000/api/simulacion-clima')
        ]);

        if (traficoRes.ok && climaRes.ok) {
          const trafico = await traficoRes.json();
          const clima = await climaRes.json();

          // Verificar el tipo de datos que estamos recibiendo
          if (trafico.length === 0 && clima.length === 0) {
            setTipoConexion('sin-datos');
          } else {
            // Verificar si hay datos reales (con ID, timestamp, o que no cambien entre llamadas)
            const tienenDatosReales = trafico.length > 0 && 
              (trafico[0].id !== undefined || 
               trafico[0]._id !== undefined ||
               trafico[0].created_at !== undefined ||
               trafico[0].timestamp !== undefined);
            
            setTipoConexion(tienenDatosReales ? 'real' : 'generado');
          }

          // Filtrar datos por rango de fechas
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
          
          if (tipoConexion === 'real') {
            console.log(`✅ Datos reales desde BD: ${traficoFiltrado.length} tráfico, ${climaFiltrado.length} clima`);
          } else {
            console.log(`⚠️ Datos generados por API: ${traficoFiltrado.length} tráfico, ${climaFiltrado.length} clima`);
          }
        } else {
          throw new Error('Error en la respuesta de la API');
        }
      } catch (apiError) {
        console.warn('⚠️ API no disponible, usando datos simulados locales:', apiError.message);
        setTipoConexion('simulado');
        
        // Fallback: usar datos simulados locales
        const datosSimulados = generarDatosSimulados();
        setDatosTrafico(datosSimulados.trafico);
        setDatosClima(datosSimulados.clima);
        generarAlertas(datosSimulados.trafico, datosSimulados.clima);
        
        console.log('📊 Usando datos simulados locales como fallback');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      setTipoConexion('sin-datos');
      // En caso de error total, mostrar datos vacíos
      setDatosTrafico([]);
      setDatosClima([]);
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el indicador visual según el tipo de conexión
  const getIndicadorConexion = () => {
    switch (tipoConexion) {
      case 'real':
        return { color: '#10b981', icon: '🟢', text: 'BD Real' };
      case 'generado':
        return { color: '#f59e0b', icon: '🟡', text: 'API Gen.' };
      case 'simulado':
        return { color: '#ef4444', icon: '🔴', text: 'Simulado' };
      case 'sin-datos':
        return { color: '#6b7280', icon: '⚫', text: 'Sin Datos' };
      default:
        return { color: '#6b7280', icon: '❓', text: 'Cargando' };
    }
  };

  const generarAlertas = (trafico, clima) => {
    const alertasGeneradas = [];

    const trafficoPorPeaje = trafico.reduce((acc, item) => {
      acc[item.peaje] = (acc[item.peaje] || 0) + 1;
      return acc;
    }, {});

    Object.entries(trafficoPorPeaje).forEach(([peaje, cantidad]) => {
      if (cantidad > umbrales.alertas.sobrecarga) {
        alertasGeneradas.push({
          id: Date.now() + Math.random(),
          tipo: 'sobrecarga',
          peaje,
          mensaje: `Acumulación alta: ${cantidad} vehículos en período`,
          severidad: cantidad > umbrales.trafico.critico ? 'alta' : 'media',
          tiempo: new Date().toLocaleTimeString()
        });
      }
    });

    clima.forEach(evento => {
      if (['Tormenta', 'Granizo', 'Nieve'].includes(evento.tipoClima) &&
          (evento.intensidad === 'Extrema' || (evento.intensidad === 'Alta' && evento.desgasteEstimado > umbrales.alertas.climaAlta))) {
        alertasGeneradas.push({
          id: Date.now() + Math.random(),
          tipo: 'clima',
          peaje: evento.ubicacion,
          mensaje: `${evento.tipoClima} ${evento.intensidad} - Desgaste: ${evento.desgasteEstimado}/10`,
          severidad: evento.desgasteEstimado > umbrales.clima.severo ? 'alta' : 'media',
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
    if (cantidadVehiculos > umbrales.trafico.critico) return '#dc2626';
    if (cantidadVehiculos > umbrales.trafico.alto) return '#ef4444';
    if (cantidadVehiculos > umbrales.trafico.medio) return '#f59e0b';
    if (cantidadVehiculos > umbrales.trafico.bajo) return '#10b981';
    return '#6b7280';
  };

  const getColorClima = (clima) => {
    if (!clima) return '#6b7280';
    const severidad = clima.desgasteEstimado;
    if (severidad > umbrales.clima.severo) return '#dc2626';
    if (severidad > umbrales.clima.alto) return '#ef4444';
    if (severidad > umbrales.clima.medio) return '#f59e0b';
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

  // Funciones de interacción mejoradas
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle' && e.target.getAttribute('data-peaje')) {
      return; // No hacer pan si se hace clic en un peaje
    }
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
    e.preventDefault();
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
      scale: Math.max(0.3, Math.min(3, prev.scale + delta))
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

  const resetUmbrales = () => {
    setUmbrales({
      trafico: {
        critico: 15,
        alto: 8,
        medio: 4,
        bajo: 1
      },
      clima: {
        severo: 7,
        alto: 5,
        medio: 3,
        bajo: 1
      },
      alertas: {
        sobrecarga: 8,
        climaAlta: 5
      }
    });
  };

  const actualizarUmbral = (categoria, tipo, valor) => {
    setUmbrales(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [tipo]: parseInt(valor)
      }
    }));
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

        {/* Controles */}
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
          
          <button 
            onClick={() => setShowUmbrales(!showUmbrales)} 
            style={{ 
              backgroundColor: showUmbrales ? '#8b5cf6' : '#6b21a8', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '0.875rem' 
            }}
          >
            <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} />
            Umbrales
          </button>
        </div>

        {/* Panel de configuración de umbrales */}
        {showUmbrales && (
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(75, 85, 99, 0.3)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                ⚙️ Configuración de Umbrales
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={resetUmbrales}
                  style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  🔄 Restablecer
                </button>
                <button 
                  onClick={() => {
                    setShowUmbrales(false);
                    cargarDatos();
                  }}
                  style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  ✅ Aplicar
                </button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Umbrales de Tráfico */}
              <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ color: '#8B5CF6', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🚗 Umbrales de Tráfico
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 'bold' }}>🔴 Crítico (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.trafico.critico}
                      onChange={(e) => actualizarUmbral('trafico', 'critico', e.target.value)}
                      min="1"
                      max="50"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}>🟠 Alto (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.trafico.alto}
                      onChange={(e) => actualizarUmbral('trafico', 'alto', e.target.value)}
                      min="1"
                      max="30"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 'bold' }}>🟡 Medio (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.trafico.medio}
                      onChange={(e) => actualizarUmbral('trafico', 'medio', e.target.value)}
                      min="1"
                      max="20"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 'bold' }}>🟢 Bajo (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.trafico.bajo}
                      onChange={(e) => actualizarUmbral('trafico', 'bajo', e.target.value)}
                      min="0"
                      max="10"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Umbrales de Clima */}
              <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ color: '#8B5CF6', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🌤️ Umbrales de Clima
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 'bold' }}>🔴 Severo (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.clima.severo}
                      onChange={(e) => actualizarUmbral('clima', 'severo', e.target.value)}
                      min="1"
                      max="10"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}>🟠 Alto (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.clima.alto}
                      onChange={(e) => actualizarUmbral('clima', 'alto', e.target.value)}
                      min="1"
                      max="9"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 'bold' }}>🟡 Medio (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.clima.medio}
                      onChange={(e) => actualizarUmbral('clima', 'medio', e.target.value)}
                      min="1"
                      max="8"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 'bold' }}>🟢 Bajo (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.clima.bajo}
                      onChange={(e) => actualizarUmbral('clima', 'bajo', e.target.value)}
                      min="0"
                      max="7"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Umbrales de Alertas */}
              <div style={{ backgroundColor: 'rgba(31, 41, 55, 0.5)', borderRadius: '0.5rem', padding: '1rem' }}>
                <h4 style={{ color: '#8B5CF6', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🚨 Umbrales de Alertas
                </h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 'bold' }}>🚗 Sobrecarga (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.alertas.sobrecarga}
                      onChange={(e) => actualizarUmbral('alertas', 'sobrecarga', e.target.value)}
                      min="1"
                      max="30"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}>🌤️ Clima Alto (&gt;)</span>
                    <input
                      type="number"
                      value={umbrales.alertas.climaAlta}
                      onChange={(e) => actualizarUmbral('alertas', 'climaAlta', e.target.value)}
                      min="1"
                      max="10"
                      style={{ width: '60px', padding: '0.25rem', backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(75, 85, 99, 0.5)', borderRadius: '0.25rem', color: 'white', fontSize: '0.75rem' }}
                    />
                  </div>
                </div>
                
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.25rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <p style={{ color: '#93c5fd', fontSize: '0.75rem', margin: 0 }}>
                    💡 <strong>Tip:</strong> Los umbrales determinan cuándo se activan las alertas y los colores del mapa. Valores más bajos = sistema más sensible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controles de zoom */}
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

        {/* Mapa mejorado */}
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
              {/* Fondo del mapa */}
              <defs>
                <linearGradient id="cielo" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#065f46', stopOpacity: 0.1 }} />
                </linearGradient>
                <linearGradient id="montañas" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#374151', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: '#1f2937', stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>
              
              {/* Cielo y terreno */}
              <rect width="1400" height="600" fill="url(#cielo)" />
              
              {/* Montañas de fondo */}
              <polygon points="0,100 300,80 600,120 900,90 1200,110 1400,100 1400,600 0,600" fill="url(#montañas)" />
              <polygon points="0,150 400,130 800,160 1200,140 1400,150 1400,600 0,600" fill="rgba(75, 85, 99, 0.2)" />

              {/* Carretera principal (segmentos entre peajes) */}
              {peajes.slice(0, -1).map((peaje, index) => {
                const nextPeaje = peajes[index + 1];
                const color = getColorSegmento(index);

                return (
                  <g key={`segment-${index}`}>
                    {/* Carretera base */}
                    <line
                      x1={peaje.x}
                      y1={peaje.y}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y}
                      stroke={color}
                      strokeWidth="24"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    
                    {/* Línea divisoria central */}
                    <line
                      x1={peaje.x}
                      y1={peaje.y}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y}
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray="20,20"
                      strokeLinecap="round"
                    />
                    
                    {/* Bordes de la carretera */}
                    <line
                      x1={peaje.x}
                      y1={peaje.y - 14}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y - 14}
                      stroke="#374151"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1={peaje.x}
                      y1={peaje.y + 14}
                      x2={nextPeaje.x}
                      y2={nextPeaje.y + 14}
                      stroke="#374151"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* Peajes */}
              {peajes.map(peaje => {
                const datos = obtenerDatosPeaje(peaje.nombre);
                const color = selectedLayer === 'traffic' ? getColorTrafico(datos.vehiculos) :
                              selectedLayer === 'climate' ? getColorClima(datos.clima) :
                              datos.alerta ? '#ef4444' : '#10b981';

                const shouldShow = !searchQuery || peaje.nombre.toLowerCase().includes(searchQuery.toLowerCase());

                if (!shouldShow) return null;

                const radius = Math.max(12, Math.min(30, 12 + datos.vehiculos * 1.2));
                const isSelected = selectedPeaje === peaje.id;

                return (
                  <g key={peaje.id}>
                    {/* Indicador de selección */}
                    {isSelected && (
                      <circle
                        cx={peaje.x}
                        cy={peaje.y}
                        r={radius + 12}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="4"
                        opacity="0.8"
                        strokeDasharray="8,4"
                      >
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from={`0 ${peaje.x} ${peaje.y}`}
                          to={`360 ${peaje.x} ${peaje.y}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Círculo principal del peaje */}
                    <circle
                      cx={peaje.x}
                      cy={peaje.y}
                      r={radius}
                      fill={color}
                      stroke="white"
                      strokeWidth="4"
                      style={{ cursor: 'pointer', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                      data-peaje={peaje.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPeaje(selectedPeaje === peaje.id ? null : peaje.id);
                      }}
                    />

                    {/* Nombre del peaje */}
                    <text
                      x={peaje.x}
                      y={peaje.y + radius + 25}
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}
                    >
                      {peaje.nombre.replace('Peaje Troncal ', '').replace('Peaje ', '')}
                    </text>

                    {/* Kilómetro */}
                    <text
                      x={peaje.x}
                      y={peaje.y + radius + 42}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="12"
                      style={{ pointerEvents: 'none' }}
                    >
                      Km {peaje.km}
                    </text>

                    {/* Contador de vehículos */}
                    {datos.vehiculos > 0 && (
                      <>
                        <circle
                          cx={peaje.x + radius - 8}
                          cy={peaje.y - radius + 8}
                          r="16"
                          fill="#1f2937"
                          stroke="white"
                          strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        />
                        <text
                          x={peaje.x + radius - 8}
                          y={peaje.y - radius + 14}
                          textAnchor="middle"
                          fill="white"
                          fontSize="13"
                          fontWeight="bold"
                          style={{ pointerEvents: 'none' }}
                        >
                          {datos.vehiculos}
                        </text>
                      </>
                    )}

                    {/* Indicador de alerta */}
                    {datos.alerta && (
                      <g>
                        <circle
                          cx={peaje.x - radius + 8}
                          cy={peaje.y - radius + 8}
                          r="14"
                          fill="#ef4444"
                          stroke="white"
                          strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        >
                          <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <text
                          x={peaje.x - radius + 8}
                          y={peaje.y - radius + 14}
                          textAnchor="middle"
                          fill="white"
                          fontSize="16"
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

          {/* Leyenda */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.95)', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', minWidth: '180px', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              {selectedLayer === 'traffic' ? '🚗 Nivel de Tráfico' : selectedLayer === 'climate' ? '🌤️ Impacto Climático' : '🚨 Estado de Alertas'}
            </div>
            {selectedLayer === 'traffic' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#dc2626' }}></div>
                  <span style={{ color: '#d1d5db' }}>Crítico (&gt;{umbrales.trafico.critico})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#d1d5db' }}>Alto ({umbrales.trafico.alto}-{umbrales.trafico.critico})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <span style={{ color: '#d1d5db' }}>Medio ({umbrales.trafico.medio}-{umbrales.trafico.alto})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#d1d5db' }}>Bajo (&lt;{umbrales.trafico.medio})</span>
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
                  <span style={{ color: '#d1d5db' }}>Severo (&gt;{umbrales.clima.severo})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: '#d1d5db' }}>Alto ({umbrales.clima.alto}-{umbrales.clima.severo})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <span style={{ color: '#d1d5db' }}>Medio ({umbrales.clima.medio}-{umbrales.clima.alto})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ color: '#d1d5db' }}>Bajo (&lt;{umbrales.clima.medio})</span>
                </div>
              </>
            )}
          </div>

          {/* Información del período con estado de conexión mejorado */}
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.95)', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.875rem', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 Período: {calcularDiasRango()} días
              <span style={{ color: getIndicadorConexion().color, fontSize: '0.75rem', fontWeight: 'bold' }}>
                {getIndicadorConexion().icon} {getIndicadorConexion().text}
              </span>
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
            
            {/* Explicación del estado */}
            <div style={{ marginTop: '0.5rem', padding: '0.4rem', backgroundColor: 'rgba(75, 85, 99, 0.3)', borderRadius: '0.25rem', fontSize: '0.65rem' }}>
              {tipoConexion === 'real' && (
                <span style={{ color: '#10b981' }}>✅ Datos persistidos en base de datos</span>
              )}
              {tipoConexion === 'generado' && (
                <span style={{ color: '#f59e0b' }}>⚠️ API genera datos aleatorios por petición</span>
              )}
              {tipoConexion === 'simulado' && (
                <span style={{ color: '#ef4444' }}>🔴 Datos simulados localmente</span>
              )}
              {tipoConexion === 'sin-datos' && (
                <span style={{ color: '#6b7280' }}>❌ No hay datos disponibles</span>
              )}
            </div>
          </div>

          {/* Instrucciones de uso */}
          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', backgroundColor: 'rgba(31, 41, 55, 0.95)', borderRadius: '0.5rem', padding: '0.5rem', fontSize: '0.75rem', maxWidth: '200px', border: '1px solid rgba(75, 85, 99, 0.3)' }}>
            <div style={{ color: '#8B5CF6', fontWeight: 'bold', marginBottom: '0.25rem' }}>💡 Interacción:</div>
            <div style={{ color: '#9ca3af' }}>• Clic en peaje para detalles</div>
            <div style={{ color: '#9ca3af' }}>• Arrastrar para mover mapa</div>
            <div style={{ color: '#9ca3af' }}>• Usar zoom para acercar</div>
          </div>
        </div>

        {/* Panel de detalles del peaje seleccionado */}
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
                      <p style={{ color: datos.clima.desgasteEstimado > umbrales.clima.severo ? '#ef4444' : datos.clima.desgasteEstimado > umbrales.clima.alto ? '#f59e0b' : '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>
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

        {/* Centro de alertas */}
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

        {/* Estado con mejor detección del tipo de datos */}
        {alertas.length === 0 && (
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(75, 85, 99, 0.3)', textAlign: 'center' }}>
            {tipoConexion === 'real' && (
              <>
                <h3 style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  ✅ Sistema Operativo Normal
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  No se detectaron alertas en el período seleccionado. Todas las estaciones funcionan dentro de parámetros normales.
                </p>
                <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  🟢 Datos reales desde base de datos • Información persistida
                </p>
              </>
            )}
            {tipoConexion === 'generado' && (
              <>
                <h3 style={{ color: '#f59e0b', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  ⚠️ Datos Generados Dinámicamente
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Los datos cambian en cada actualización porque la API está generando información aleatoria por petición.
                </p>
                <p style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  🟡 Para datos reales, usa el simulador para guardar registros en la BD
                </p>
              </>
            )}
            {tipoConexion === 'simulado' && (
              <>
                <h3 style={{ color: '#ef4444', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  🔴 Modo Simulación Local
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  API no disponible. Se están generando datos localmente para demostración.
                </p>
                <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  🔴 Datos simulados • Verificar conexión con servidor
                </p>
              </>
            )}
            {tipoConexion === 'sin-datos' && (
              <>
                <h3 style={{ color: '#6b7280', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  ❌ Sin Datos Disponibles
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  No hay registros disponibles para el período seleccionado.
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  ⚫ Genera datos usando el simulador o ajusta el rango de fechas
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapa;