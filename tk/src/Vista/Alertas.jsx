import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, AlertCircle, Info, CheckCircle, XCircle,
  Clock, MapPin, Car, Truck, Zap, Cloud, TrendingUp,
  Shield, Bell, Filter, Search, Download, RefreshCw,
  Calendar, Eye, EyeOff, Users, BarChart3, Settings,
  HelpCircle, Sliders, Save, RotateCcw
} from 'lucide-react';

const Alertas = () => {
  const [alertas, setAlertas] = useState([]);
  const [datosTrafico, setDatosTrafico] = useState([]);
  const [datosClima, setDatosClima] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroSeveridad, setFiltroSeveridad] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [alertasResueltas, setAlertasResueltas] = useState(new Set());
  const [alertasLeidas, setAlertasLeidas] = useState(new Set());
  const [mostrarConfigUmbrales, setMostrarConfigUmbrales] = useState(false);
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);

  const [umbrales, setUmbrales] = useState({
    trafico: {
      critico: 20,
      alto: 12,
      medio: 8,
      bajo: 3
    },
    clima: {
      desgasteCritico: 8,
      desgasteAlto: 6,
      desgasteMedio: 4,
      desgasteBajo: 2
    },
    capacidad: {
      vehiculosPesadosAlto: 40,
      vehiculosPesadosMedio: 25,
      vehiculosPesadosBajo: 15
    }
  });

  const tiposAlerta = {
    trafico: {
      icon: Car,
      color: '#F59E0B',
      label: 'Tráfico',
      descripcion: 'Alertas relacionadas con el flujo vehicular, congestiones y sobrecargas en los peajes.'
    },
    clima: {
      icon: Cloud,
      color: '#3B82F6',
      label: 'Clima',
      descripcion: 'Alertas meteorológicas que pueden afectar la infraestructura vial.'
    },
    infraestructura: {
      icon: Shield,
      color: '#EF4444',
      label: 'Infraestructura',
      descripcion: 'Alertas críticas sobre daños potenciales o reales en la infraestructura.'
    },
    capacidad: {
      icon: Users,
      color: '#8B5CF6',
      label: 'Capacidad',
      descripcion: 'Alertas sobre la distribución y proporción de diferentes tipos de vehículos.'
    },
    velocidad: {
      icon: TrendingUp,
      color: '#10B981',
      label: 'Velocidad',
      descripcion: 'Alertas sobre el rendimiento y flujo de tráfico.'
    },
    sistema: {
      icon: Zap,
      color: '#6366F1',
      label: 'Sistema',
      descripcion: 'Alertas técnicas sobre el funcionamiento del sistema de monitoreo.'
    },
    mantenimiento: {
      icon: AlertCircle,
      color: '#F97316',
      label: 'Mantenimiento',
      descripcion: 'Alertas programadas sobre necesidades de mantenimiento preventivo o correctivo.'
    }
  };

  const severidades = {
    critica: { color: '#DC2626', label: 'Crítica', icon: XCircle },
    alta: { color: '#EF4444', label: 'Alta', icon: AlertTriangle },
    media: { color: '#F59E0B', label: 'Media', icon: AlertCircle },
    baja: { color: '#10B981', label: 'Baja', icon: Info },
    info: { color: '#3B82F6', label: 'Información', icon: CheckCircle }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 60000);
    return () => clearInterval(interval);
  }, [fechaInicio, fechaFin, umbrales]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Simulación de carga de datos
      const trafico = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        peaje: `Peaje ${i % 5 + 1}`,
        categoria: i % 3 === 0 ? 'camion' : 'auto',
        fecha: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        tarifa: Math.random() * 100
      }));

      const clima = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        tipoClima: ['Tormenta', 'Granizo', 'Nieve', 'Lluvia'][i % 4],
        intensidad: ['Extrema', 'Alta', 'Media'][i % 3],
        ubicacion: `Ubicación ${i % 3 + 1}`,
        fecha: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        desgasteEstimado: Math.floor(Math.random() * 10) + 1,
        temperatura: Math.random() * 30
      }));

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
    const ahora = new Date();

    // Lógica para generar alertas de tráfico
    const traficoPorPeaje = trafico.reduce((acc, item) => {
      acc[item.peaje] = (acc[item.peaje] || []).concat(item);
      return acc;
    }, {});

    Object.entries(traficoPorPeaje).forEach(([peaje, vehiculos]) => {
      const cantidad = vehiculos.length;
      let severidad, titulo, descripcion;

      if (cantidad >= umbrales.trafico.critico) {
        severidad = 'critica';
        titulo = `🚨 Congestión Crítica en ${peaje}`;
        descripcion = `CRÍTICO: ${cantidad} vehículos detectados (umbral: ≥${umbrales.trafico.critico}).`;
      } else if (cantidad >= umbrales.trafico.alto) {
        severidad = 'alta';
        titulo = `⚠️ Alto Flujo Vehicular en ${peaje}`;
        descripcion = `ALTO: ${cantidad} vehículos detectados (umbral: ≥${umbrales.trafico.alto}).`;
      } else if (cantidad >= umbrales.trafico.medio) {
        severidad = 'media';
        titulo = `📈 Incremento de Tráfico en ${peaje}`;
        descripcion = `MEDIO: ${cantidad} vehículos detectados (umbral: ≥${umbrales.trafico.medio}).`;
      } else if (cantidad >= umbrales.trafico.bajo) {
        severidad = 'baja';
        titulo = `📊 Flujo Normal en ${peaje}`;
        descripcion = `BAJO: ${cantidad} vehículos detectados (umbral: ≥${umbrales.trafico.bajo}).`;
      }

      if (severidad) {
        alertasGeneradas.push({
          id: `trafico-${severidad}-${peaje}`,
          tipo: 'trafico',
          severidad,
          titulo,
          descripcion,
          ubicacion: peaje,
          fechaCreacion: new Date(ahora.getTime() - Math.random() * 6 * 60 * 60 * 1000),
          estado: 'activa',
          datos: { vehiculos: cantidad, umbral: umbrales.trafico[severidad] }
        });
      }
    });

    // Lógica para generar alertas climáticas
    clima.forEach(evento => {
      const desgaste = evento.desgasteEstimado || 0;
      const esEventoSevero = ['Tormenta', 'Granizo', 'Nieve', 'Huracán'].includes(evento.tipoClima);
      let severidad, titulo, descripcion;

      if (desgaste >= umbrales.clima.desgasteCritico || (esEventoSevero && evento.intensidad === 'Extrema')) {
        severidad = 'critica';
        titulo = `🌪️ Condición Climática Extrema`;
        descripcion = `CRÍTICO: ${evento.tipoClima} ${evento.intensidad} en ${evento.ubicacion}. Desgaste: ${desgaste}/10.`;
      } else if (desgaste >= umbrales.clima.desgasteAlto || (esEventoSevero && evento.intensidad === 'Alta')) {
        severidad = 'alta';
        titulo = `⛈️ Alerta Climática Severa`;
        descripcion = `ALTO: ${evento.tipoClima} ${evento.intensidad} en ${evento.ubicacion}. Desgaste: ${desgaste}/10.`;
      } else if (desgaste >= umbrales.clima.desgasteMedio) {
        severidad = 'media';
        titulo = `🌦️ Condición Climática Moderada`;
        descripcion = `MEDIO: ${evento.tipoClima} ${evento.intensidad} en ${evento.ubicacion}. Desgaste: ${desgaste}/10.`;
      }

      if (severidad) {
        alertasGeneradas.push({
          id: `clima-${severidad}-${evento.ubicacion}-${evento.tipoClima}`,
          tipo: 'clima',
          severidad,
          titulo,
          descripcion,
          ubicacion: evento.ubicacion,
          fechaCreacion: new Date(evento.fecha),
          estado: 'activa',
          datos: {
            tipoClima: evento.tipoClima,
            intensidad: evento.intensidad,
            desgaste: desgaste,
            temperatura: evento.temperatura
          }
        });
      }
    });

    // Lógica para generar alertas de capacidad
    if (trafico.length > 0) {
      const vehiculosPesados = trafico.filter(v =>
        v.categoria.includes('camion') || v.categoria.includes('bus')
      );
      const porcentajePesados = (vehiculosPesados.length / trafico.length) * 100;
      let severidad, titulo, descripcion;

      if (porcentajePesados >= umbrales.capacidad.vehiculosPesadosAlto) {
        severidad = 'alta';
        titulo = `🚛 Sobrecarga de Vehículos Pesados`;
        descripcion = `ALTO: ${vehiculosPesados.length} vehículos pesados (${porcentajePesados.toFixed(1)}%). Umbral: ≥${umbrales.capacidad.vehiculosPesadosAlto}%.`;
      } else if (porcentajePesados >= umbrales.capacidad.vehiculosPesadosMedio) {
        severidad = 'media';
        titulo = `📊 Incremento de Vehículos Pesados`;
        descripcion = `MEDIO: ${vehiculosPesados.length} vehículos pesados (${porcentajePesados.toFixed(1)}%). Umbral: ≥${umbrales.capacidad.vehiculosPesadosMedio}%.`;
      }

      if (severidad) {
        alertasGeneradas.push({
          id: 'capacidad-vehiculos-pesados',
          tipo: 'capacidad',
          severidad,
          titulo,
          descripcion,
          ubicacion: 'Red Vial',
          fechaCreacion: new Date(ahora.getTime() - Math.random() * 3 * 60 * 60 * 1000),
          estado: 'activa',
          datos: { vehiculosPesados: vehiculosPesados.length, total: trafico.length, porcentaje: porcentajePesados }
        });
      }
    }

    // Ordenar alertas por severidad y fecha
    const ordenSeveridad = { critica: 0, alta: 1, media: 2, baja: 3, info: 4 };
    alertasGeneradas.sort((a, b) => {
      const diferenciaSeveridad = ordenSeveridad[a.severidad] - ordenSeveridad[b.severidad];
      if (diferenciaSeveridad !== 0) return diferenciaSeveridad;
      return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
    });

    setAlertas(alertasGeneradas);
  };

  const guardarUmbrales = () => {
    localStorage.setItem('alertas-umbrales', JSON.stringify(umbrales));
    alert('✅ Umbrales guardados exitosamente');
    cargarDatos();
  };

  const restaurarUmbralesDefecto = () => {
    const umbralDefecto = {
      trafico: { critico: 20, alto: 12, medio: 8, bajo: 3 },
      clima: { desgasteCritico: 8, desgasteAlto: 6, desgasteMedio: 4, desgasteBajo: 2 },
      capacidad: { vehiculosPesadosAlto: 40, vehiculosPesadosMedio: 25, vehiculosPesadosBajo: 15 }
    };
    setUmbrales(umbralDefecto);
  };

  useEffect(() => {
    const umbralGuardado = localStorage.getItem('alertas-umbrales');
    if (umbralGuardado) {
      setUmbrales(JSON.parse(umbralGuardado));
    }
  }, []);

  const alertasFiltradas = alertas.filter(alerta => {
    const cumpleSeveridad = filtroSeveridad === 'todas' || alerta.severidad === filtroSeveridad;
    const cumpleTipo = filtroTipo === 'todas' || alerta.tipo === filtroTipo;
    const cumpleEstado = filtroEstado === 'todas' ||
      (filtroEstado === 'activa' && !alertasResueltas.has(alerta.id)) ||
      (filtroEstado === 'resuelta' && alertasResueltas.has(alerta.id));
    const cumpleBusqueda = !busqueda ||
      alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.ubicacion.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleSeveridad && cumpleTipo && cumpleEstado && cumpleBusqueda;
  });

  const toggleAlertaResuelta = (alertaId) => {
    const nuevasResueltas = new Set(alertasResueltas);
    if (nuevasResueltas.has(alertaId)) {
      nuevasResueltas.delete(alertaId);
    } else {
      nuevasResueltas.add(alertaId);
    }
    setAlertasResueltas(nuevasResueltas);
  };

  const toggleAlertaLeida = (alertaId) => {
    const nuevasLeidas = new Set(alertasLeidas);
    if (nuevasLeidas.has(alertaId)) {
      nuevasLeidas.delete(alertaId);
    } else {
      nuevasLeidas.add(alertaId);
    }
    setAlertasLeidas(nuevasLeidas);
  };

  const estadisticas = {
    total: alertas.length,
    criticas: alertas.filter(a => a.severidad === 'critica').length,
    altas: alertas.filter(a => a.severidad === 'alta').length,
    activas: alertas.filter(a => !alertasResueltas.has(a.id)).length,
    noLeidas: alertas.filter(a => !alertasLeidas.has(a.id)).length
  };

  const cardStyle = {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    padding: '2rem',
    marginBottom: '2rem'
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Bell size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando sistema de alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
              🚨 Centro de Alertas Inteligente
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
              Sistema de monitoreo con umbrales configurables y análisis predictivo
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setMostrarExplicacion(!mostrarExplicacion)}
              style={{
                background: 'linear-gradient(90deg, #10B981, #059669)',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <HelpCircle size={16} />
              {mostrarExplicacion ? 'Ocultar Guía' : 'Ver Guía'}
            </button>
            <button
              onClick={() => setMostrarConfigUmbrales(!mostrarConfigUmbrales)}
              style={{
                background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Sliders size={16} />
              {mostrarConfigUmbrales ? 'Cerrar Config' : 'Configurar Umbrales'}
            </button>
            <button
              onClick={cargarDatos}
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>

        {mostrarExplicacion && (
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              📚 Guía de Tipos de Alertas
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {Object.entries(tiposAlerta).map(([tipo, config]) => {
                const IconComponent = config.icon;
                return (
                  <div key={tipo} style={{
                    backgroundColor: 'rgba(31, 41, 55, 0.4)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    border: `1px solid ${config.color}40`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <IconComponent size={20} color={config.color} />
                      <span style={{ color: config.color, fontWeight: 'bold', fontSize: '1rem' }}>
                        {config.label}
                      </span>
                    </div>
                    <p style={{ color: '#D1D5DB', fontSize: '0.875rem', lineHeight: '1.4', margin: 0 }}>
                      {config.descripcion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mostrarConfigUmbrales && (
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                ⚙️ Configuración de Umbrales de Alerta
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={restaurarUmbralesDefecto}
                  style={{
                    backgroundColor: 'rgba(107, 114, 128, 0.3)',
                    color: '#9CA3AF',
                    border: '1px solid rgba(107, 114, 128, 0.5)',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <RotateCcw size={14} />
                  Restaurar
                </button>
                <button
                  onClick={guardarUmbrales}
                  style={{
                    background: 'linear-gradient(90deg, #10B981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Save size={14} />
                  Guardar
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                <h4 style={{ color: '#F59E0B', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Car size={16} />
                  🚗 Umbrales de Tráfico (vehículos)
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {Object.entries(umbrales.trafico).map(([nivel, valor]) => (
                    <div key={nivel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ color: '#D1D5DB', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {nivel}:
                      </label>
                      <input
                        type="number"
                        value={valor}
                        onChange={(e) => setUmbrales(prev => ({
                          ...prev,
                          trafico: { ...prev.trafico, [nivel]: parseInt(e.target.value) || 0 }
                        }))}
                        style={{
                          width: '70px',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgba(17, 24, 39, 0.6)',
                          border: '1px solid rgba(75, 85, 99, 0.5)',
                          borderRadius: '0.25rem',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <h4 style={{ color: '#3B82F6', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cloud size={16} />
                  🌤️ Umbrales de Clima (desgaste 1-10)
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {Object.entries(umbrales.clima).map(([nivel, valor]) => (
                    <div key={nivel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ color: '#D1D5DB', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {nivel.replace('desgaste', '')}:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={valor}
                        onChange={(e) => setUmbrales(prev => ({
                          ...prev,
                          clima: { ...prev.clima, [nivel]: parseInt(e.target.value) || 0 }
                        }))}
                        style={{
                          width: '70px',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgba(17, 24, 39, 0.6)',
                          border: '1px solid rgba(75, 85, 99, 0.5)',
                          borderRadius: '0.25rem',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <h4 style={{ color: '#8B5CF6', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} />
                  🚛 Umbrales de Capacidad (% vehículos pesados)
                </h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {Object.entries(umbrales.capacidad).map(([nivel, valor]) => (
                    <div key={nivel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ color: '#D1D5DB', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {nivel.replace('vehiculosPesados', '')}:
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={valor}
                          onChange={(e) => setUmbrales(prev => ({
                            ...prev,
                            capacidad: { ...prev.capacidad, [nivel]: parseInt(e.target.value) || 0 }
                          }))}
                          style={{
                            width: '60px',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: 'rgba(17, 24, 39, 0.6)',
                            border: '1px solid rgba(75, 85, 99, 0.5)',
                            borderRadius: '0.25rem',
                            color: 'white',
                            fontSize: '0.875rem'
                          }}
                        />
                        <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '0.5rem',
              padding: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              marginTop: '1rem'
            }}>
              <h5 style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                💡 Información sobre Umbrales:
              </h5>
              <ul style={{ color: '#D1D5DB', fontSize: '0.8rem', margin: 0, paddingLeft: '1rem' }}>
                <li><strong>Tráfico:</strong> Número de vehículos que activa cada nivel de alerta</li>
                <li><strong>Clima:</strong> Nivel de desgaste estimado (1-10) que determina la severidad</li>
                <li><strong>Capacidad:</strong> Porcentaje de vehículos pesados que genera alertas</li>
                <li><strong>Guardar:</strong> Los umbrales se almacenan localmente y persisten entre sesiones</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#A855F7', marginBottom: '0.5rem' }}>
              {estadisticas.total}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Total Alertas</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#DC2626', marginBottom: '0.5rem' }}>
              {estadisticas.criticas}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Críticas</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#EF4444', marginBottom: '0.5rem' }}>
              {estadisticas.altas}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Altas</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B', marginBottom: '0.5rem' }}>
              {estadisticas.activas}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>Activas</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.5rem' }}>
              {estadisticas.noLeidas}
            </div>
            <div style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>No Leídas</div>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
            🔍 Filtros y Búsqueda
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Severidad
              </label>
              <select
                value={filtroSeveridad}
                onChange={(e) => setFiltroSeveridad(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(17, 24, 39, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              >
                <option value="todas">Todas</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
                <option value="info">Información</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(17, 24, 39, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              >
                <option value="todas">Todas</option>
                <option value="trafico">Tráfico</option>
                <option value="clima">Clima</option>
                <option value="infraestructura">Infraestructura</option>
                <option value="capacidad">Capacidad</option>
                <option value="velocidad">Velocidad</option>
                <option value="sistema">Sistema</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(17, 24, 39, 0.6)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
              >
                <option value="todas">Todas</option>
                <option value="activa">Activas</option>
                <option value="resuelta">Resueltas</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#D1D5DB', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Buscar
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Buscar alertas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    backgroundColor: 'rgba(17, 24, 39, 0.6)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Calendar size={16} color="#8B5CF6" />
            <span style={{ color: '#D1D5DB', fontSize: '0.875rem' }}>Período:</span>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>a</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              ({alertasFiltradas.length} alertas)
            </span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
              📋 Alertas Generadas ({alertasFiltradas.length})
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const todasLeidas = new Set([...alertasLeidas, ...alertasFiltradas.map(a => a.id)]);
                  setAlertasLeidas(todasLeidas);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#3B82F6',
                  border: '1px solid #3B82F6',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Marcar todas como leídas
              </button>
            </div>
          </div>
          {alertasFiltradas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#9CA3AF'
            }}>
              <CheckCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ✅ No se encontraron alertas
              </h3>
              <p>No hay alertas que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
              {alertasFiltradas.map((alerta) => {
                const TipoIcon = tiposAlerta[alerta.tipo]?.icon || AlertTriangle;
                const SeveridadIcon = severidades[alerta.severidad]?.icon || AlertTriangle;
                const esResuelta = alertasResueltas.has(alerta.id);
                const esLeida = alertasLeidas.has(alerta.id);

                return (
                  <div
                    key={alerta.id}
                    style={{
                      backgroundColor: 'rgba(17, 24, 39, 0.6)',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      marginBottom: '1rem',
                      transition: 'all 0.2s ease',
                      borderLeft: `4px solid ${severidades[alerta.severidad]?.color}`,
                      opacity: esResuelta ? 0.6 : 1,
                      backgroundColor: esLeida ? 'rgba(17, 24, 39, 0.4)' : 'rgba(17, 24, 39, 0.8)'
                    }}
                    onClick={() => toggleAlertaLeida(alerta.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <div style={{
                          backgroundColor: `${severidades[alerta.severidad]?.color}20`,
                          borderRadius: '50%',
                          padding: '0.75rem',
                          border: `2px solid ${severidades[alerta.severidad]?.color}`
                        }}>
                          <SeveridadIcon size={24} color={severidades[alerta.severidad]?.color} />
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <h3 style={{
                              fontSize: '1.125rem',
                              fontWeight: 'bold',
                              color: 'white',
                              margin: 0
                            }}>
                              {alerta.titulo}
                            </h3>
                            {!esLeida && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#3B82F6'
                              }} />
                            )}
                          </div>

                          <p style={{
                            color: '#D1D5DB',
                            fontSize: '0.9rem',
                            margin: '0 0 0.75rem 0',
                            lineHeight: '1.4'
                          }}>
                            {alerta.descripcion}
                          </p>

                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <TipoIcon size={14} color={tiposAlerta[alerta.tipo]?.color} />
                              <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                                {tiposAlerta[alerta.tipo]?.label}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={14} color="#9CA3AF" />
                              <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                                {alerta.ubicacion}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={14} color="#9CA3AF" />
                              <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                                {new Date(alerta.fechaCreacion).toLocaleString('es-CL')}
                              </span>
                            </div>

                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: `${severidades[alerta.severidad]?.color}20`,
                              color: severidades[alerta.severidad]?.color,
                              border: `1px solid ${severidades[alerta.severidad]?.color}40`
                            }}>
                              {severidades[alerta.severidad]?.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAlertaResuelta(alerta.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: esResuelta ? '#10B981' : 'rgba(16, 185, 129, 0.2)',
                            color: esResuelta ? 'white' : '#10B981',
                            border: `1px solid #10B981`,
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title={esResuelta ? 'Marcar como activa' : 'Marcar como resuelta'}
                        >
                          <CheckCircle size={14} />
                          {esResuelta ? 'Resuelta' : 'Resolver'}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAlertaLeida(alerta.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'rgba(75, 85, 99, 0.2)',
                            color: '#9CA3AF',
                            border: '1px solid rgba(75, 85, 99, 0.5)',
                            borderRadius: '0.375rem',
                            cursor: 'pointer'
                          }}
                          title={esLeida ? 'Marcar como no leída' : 'Marcar como leída'}
                        >
                          {esLeida ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {alerta.datos && Object.keys(alerta.datos).length > 0 && (
                      <div style={{
                        backgroundColor: 'rgba(31, 41, 55, 0.4)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#D1D5DB',
                          marginBottom: '0.5rem'
                        }}>
                          📊 Datos del Sistema:
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '0.5rem'
                        }}>
                          {Object.entries(alerta.datos).map(([key, value]) => (
                            <div key={key} style={{ fontSize: '0.8rem' }}>
                              <span style={{ color: '#9CA3AF' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </span>
                              <span style={{ color: '#D1D5DB', marginLeft: '0.25rem' }}>
                                {typeof value === 'object' ? JSON.stringify(value) : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
            📈 Resumen por Tipo de Alerta
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {Object.entries(tiposAlerta).map(([tipo, config]) => {
              const IconComponent = config.icon;
              const alertasDeTipo = alertas.filter(a => a.tipo === tipo);
              const activasDeTipo = alertasDeTipo.filter(a => !alertasResueltas.has(a.id));

              return (
                <div
                  key={tipo}
                  style={{
                    backgroundColor: 'rgba(17, 24, 39, 0.6)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <IconComponent size={24} color={config.color} />
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: config.color }}>
                        {alertasDeTipo.length}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                        {activasDeTipo.length} activas
                      </div>
                    </div>
                  </div>

                  <div style={{ color: '#D1D5DB', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {config.label}
                  </div>

                  <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'rgba(75, 85, 99, 0.3)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${alertas.length > 0 ? (alertasDeTipo.length / alertas.length) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: config.color,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {alertas.length > 0 ?
                      `${((alertasDeTipo.length / alertas.length) * 100).toFixed(1)}% del total` :
                      '0% del total'
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alertas;
