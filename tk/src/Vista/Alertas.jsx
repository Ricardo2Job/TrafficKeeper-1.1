import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Car, 
  Truck, 
  Zap, 
  Cloud, 
  TrendingUp, 
  Shield, 
  Bell, 
  Filter, 
  Search, 
  Download,
  RefreshCw,
  Calendar,
  Eye,
  EyeOff,
  Users,
  BarChart3
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

  const tiposAlerta = {
    trafico: { icon: Car, color: '#F59E0B', label: 'Tráfico' },
    clima: { icon: Cloud, color: '#3B82F6', label: 'Clima' },
    infraestructura: { icon: Shield, color: '#EF4444', label: 'Infraestructura' },
    capacidad: { icon: Users, color: '#8B5CF6', label: 'Capacidad' },
    velocidad: { icon: TrendingUp, color: '#10B981', label: 'Velocidad' },
    sistema: { icon: Zap, color: '#6366F1', label: 'Sistema' },
    mantenimiento: { icon: AlertCircle, color: '#F97316', label: 'Mantenimiento' }
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
    const interval = setInterval(cargarDatos, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
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

      // Filtrar por fechas
      const traficoFiltrado = trafico.filter(item => {
        const fechaItem = item.fecha ? item.fecha.split('T')[0] : new Date().toISOString().split('T')[0];
        return fechaItem >= fechaInicio && fechaItem <= fechaFin;
      });

      const climaFiltrado = clima.filter(item => {
        const fechaItem = item.fecha ? item.fecha.split('T')[0] : new Date().toISOString().split('T')[0];
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

    // 1. Alertas de Tráfico por Sobrecarga
    const trafficoPorPeaje = trafico.reduce((acc, item) => {
      acc[item.peaje] = (acc[item.peaje] || []).concat(item);
      return acc;
    }, {});

    Object.entries(trafficoPorPeaje).forEach(([peaje, vehiculos]) => {
      const cantidad = vehiculos.length;
      if (cantidad > 20) {
        alertasGeneradas.push({
          id: `trafico-critica-${peaje}`,
          tipo: 'trafico',
          severidad: 'critica',
          titulo: `Congestión Crítica en ${peaje}`,
          descripcion: `Se detectaron ${cantidad} vehículos, superando ampliamente la capacidad normal.`,
          ubicacion: peaje,
          fechaCreacion: new Date(ahora.getTime() - Math.random() * 2 * 60 * 60 * 1000),
          estado: 'activa',
          datos: { vehiculos: cantidad, umbral: 20 }
        });
      } else if (cantidad > 12) {
        alertasGeneradas.push({
          id: `trafico-alta-${peaje}`,
          tipo: 'trafico',
          severidad: 'alta',
          titulo: `Alto Flujo Vehicular en ${peaje}`,
          descripcion: `Flujo elevado de ${cantidad} vehículos detectado.`,
          ubicacion: peaje,
          fechaCreacion: new Date(ahora.getTime() - Math.random() * 4 * 60 * 60 * 1000),
          estado: 'activa',
          datos: { vehiculos: cantidad, umbral: 12 }
        });
      } else if (cantidad > 8) {
        alertasGeneradas.push({
          id: `trafico-media-${peaje}`,
          tipo: 'trafico',
          severidad: 'media',
          titulo: `Incremento de Tráfico en ${peaje}`,
          descripcion: `Se registra un incremento en el flujo vehicular (${cantidad} vehículos).`,
          ubicacion: peaje,
          fechaCreacion: new Date(ahora.getTime() - Math.random() * 6 * 60 * 60 * 1000),
          estado: 'activa',
          datos: { vehiculos: cantidad, umbral: 8 }
        });
      }
    });

    // 2. Alertas Climáticas
    clima.forEach(evento => {
      const desgaste = evento.desgasteEstimado || 0;
      const esEventoSevero = ['Tormenta', 'Granizo', 'Nieve', 'Huracán'].includes(evento.tipoClima);
      
      if (desgaste > 8 || (esEventoSevero && evento.intensidad === 'Extrema')) {
        alertasGeneradas.push({
          id: `clima-critica-${evento.ubicacion}-${evento.tipoClima}`,
          tipo: 'clima',
          severidad: 'critica',
          titulo: `Condición Climática Extrema`,
          descripcion: `${evento.tipoClima} ${evento.intensidad} en ${evento.ubicacion}. Desgaste estimado: ${desgaste}/10.`,
          ubicacion: evento.ubicacion,
          fechaCreacion: new Date(evento.fecha),
          estado: 'activa',
          datos: { 
            tipoClima: evento.tipoClima, 
            intensidad: evento.intensidad,
            desgaste: desgaste,
            temperatura: evento.temperatura,
            viento: evento.viento
          }
        });
      } else if (desgaste > 6 || (esEventoSevero && evento.intensidad === 'Alta')) {
        alertasGeneradas.push({
          id: `clima-alta-${evento.ubicacion}-${evento.tipoClima}`,
          tipo: 'clima',
          severidad: 'alta',
          titulo: `Alerta Climática`,
          descripcion: `${evento.tipoClima} de intensidad ${evento.intensidad} afectando ${evento.ubicacion}.`,
          ubicacion: evento.ubicacion,
          fechaCreacion: new Date(evento.fecha),
          estado: 'activa',
          datos: { 
            tipoClima: evento.tipoClima, 
            intensidad: evento.intensidad,
            desgaste: desgaste 
          }
        });
      }
    });

    // 3. Alertas de Capacidad por Tipo de Vehículo
    const vehiculosPesados = trafico.filter(v => 
      v.categoria?.includes('camion') || v.categoria?.includes('bus')
    );
    
    if (vehiculosPesados.length > trafico.length * 0.4) {
      alertasGeneradas.push({
        id: 'capacidad-vehiculos-pesados',
        tipo: 'capacidad',
        severidad: 'alta',
        titulo: 'Alto Porcentaje de Vehículos Pesados',
        descripcion: `${vehiculosPesados.length} vehículos pesados (${((vehiculosPesados.length/trafico.length)*100).toFixed(1)}% del tráfico total).`,
        ubicacion: 'Red Vial',
        fechaCreacion: new Date(ahora.getTime() - Math.random() * 3 * 60 * 60 * 1000),
        estado: 'activa',
        datos: { vehiculosPesados: vehiculosPesados.length, total: trafico.length }
      });
    }

    // 4. Alertas de Velocidad/Rendimiento
    const peajesConBajoRendimiento = Object.entries(trafficoPorPeaje)
      .filter(([peaje, vehiculos]) => vehiculos.length < 3)
      .map(([peaje]) => peaje);

    if (peajesConBajoRendimiento.length > 0) {
      alertasGeneradas.push({
        id: 'velocidad-bajo-rendimiento',
        tipo: 'velocidad',
        severidad: 'media',
        titulo: 'Bajo Flujo en Múltiples Peajes',
        descripcion: `${peajesConBajoRendimiento.length} peajes con flujo por debajo del promedio.`,
        ubicacion: peajesConBajoRendimiento.join(', '),
        fechaCreacion: new Date(ahora.getTime() - Math.random() * 8 * 60 * 60 * 1000),
        estado: 'activa',
        datos: { peajes: peajesConBajoRendimiento }
      });
    }

    // 5. Alertas de Infraestructura (basadas en clima extremo)
    const eventosExtremos = clima.filter(e => 
      e.desgasteEstimado > 7 || ['Terremoto', 'Huracán', 'Tornado'].includes(e.eventosCatastroficos)
    );

    eventosExtremos.forEach(evento => {
      alertasGeneradas.push({
        id: `infraestructura-${evento.ubicacion}-${evento.eventosCatastroficos}`,
        tipo: 'infraestructura',
        severidad: 'critica',
        titulo: 'Riesgo de Infraestructura',
        descripcion: `${evento.eventosCatastroficos} detectado en ${evento.ubicacion}. Requiere inspección inmediata.`,
        ubicacion: evento.ubicacion,
        fechaCreacion: new Date(evento.fecha),
        estado: 'activa',
        datos: { evento: evento.eventosCatastroficos, desgaste: evento.desgasteEstimado }
      });
    });

    // 6. Alertas de Sistema/Mantenimiento
    const peajesActivos = new Set(trafico.map(t => t.peaje));
    const todosPeajes = [
      'Peaje Angostura', 'Peaje Troncal Quinta', 'Peaje Troncal Río Claro',
      'Peaje Troncal Retiro', 'Peaje Troncal Santa Clara', 'Peaje Troncal Las Maicas',
      'Peaje Troncal Púa', 'Peaje Troncal Quepe', 'Peaje Troncal Lanco',
      'Peaje Troncal La Unión', 'Peaje Troncal Cuatro Vientos', 'Peaje Troncal Puerto Montt'
    ];

    const peajesSinDatos = todosPeajes.filter(peaje => !peajesActivos.has(peaje));
    
    peajesSinDatos.forEach(peaje => {
      alertasGeneradas.push({
        id: `sistema-sin-datos-${peaje}`,
        tipo: 'sistema',
        severidad: 'baja',
        titulo: 'Sin Datos de Tráfico',
        descripcion: `No se recibieron datos de tráfico de ${peaje} en el período seleccionado.`,
        ubicacion: peaje,
        fechaCreacion: new Date(ahora.getTime() - Math.random() * 12 * 60 * 60 * 1000),
        estado: 'activa',
        datos: { ultimoReporte: 'No disponible' }
      });
    });

    // 7. Alertas Informativas
    if (trafico.length > 0) {
      const ingresosTotales = trafico.reduce((sum, v) => sum + (v.tarifa || 0), 0);
      alertasGeneradas.push({
        id: 'info-ingresos-diarios',
        tipo: 'sistema',
        severidad: 'info',
        titulo: 'Reporte de Ingresos',
        descripcion: `Ingresos acumulados en el período: $${ingresosTotales.toLocaleString()}`,
        ubicacion: 'Red Vial',
        fechaCreacion: new Date(ahora.getTime() - 1 * 60 * 60 * 1000),
        estado: 'activa',
        datos: { ingresos: ingresosTotales, vehiculos: trafico.length }
      });
    }

    // Ordenar por severidad y fecha
    const ordenSeveridad = { critica: 0, alta: 1, media: 2, baja: 3, info: 4 };
    alertasGeneradas.sort((a, b) => {
      const diferenciaSeveridad = ordenSeveridad[a.severidad] - ordenSeveridad[b.severidad];
      if (diferenciaSeveridad !== 0) return diferenciaSeveridad;
      return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
    });

    setAlertas(alertasGeneradas);
  };

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
    nuevasLeidas.add(alertaId);
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

  const alertCardStyle = {
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid rgba(75, 85, 99, 0.3)',
    marginBottom: '1rem',
    transition: 'all 0.2s ease'
  };

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Bell size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando sistema de alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
              🚨 Centro de Alertas
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
              Sistema de monitoreo y gestión de alertas en tiempo real
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Estadísticas */}
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
      </div>

      {/* Filtros y Controles */}
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

        {/* Rango de Fechas */}
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

      {/* Lista de Alertas */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
            📋 Alertas ({alertasFiltradas.length})
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
              No se encontraron alertas
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
                    ...alertCardStyle,
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
                  
                  {/* Datos adicionales */}
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
                        📊 Datos Adicionales:
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

      {/* Resumen por Tipo */}
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

      {/* Acciones Rápidas */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1.5rem' }}>
          ⚡ Acciones Rápidas
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={() => {
              const criticas = alertas.filter(a => a.severidad === 'critica' && !alertasResueltas.has(a.id));
              criticas.forEach(a => toggleAlertaResuelta(a.id));
            }}
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              color: '#DC2626',
              border: '2px solid #DC2626',
              borderRadius: '0.75rem',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <XCircle size={24} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Resolver Críticas
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {alertas.filter(a => a.severidad === 'critica' && !alertasResueltas.has(a.id)).length} alertas críticas
              </div>
            </div>
          </button>
          
          <button
            onClick={() => {
              const trafico = alertas.filter(a => a.tipo === 'trafico' && !alertasResueltas.has(a.id));
              trafico.forEach(a => toggleAlertaResuelta(a.id));
            }}
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              color: '#F59E0B',
              border: '2px solid #F59E0B',
              borderRadius: '0.75rem',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Car size={24} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Resolver Tráfico
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {alertas.filter(a => a.tipo === 'trafico' && !alertasResueltas.has(a.id)).length} alertas de tráfico
              </div>
            </div>
          </button>
          
          <button
            onClick={() => {
              const noLeidas = alertas.filter(a => !alertasLeidas.has(a.id));
              noLeidas.forEach(a => toggleAlertaLeida(a.id));
            }}
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
              border: '2px solid #3B82F6',
              borderRadius: '0.75rem',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Eye size={24} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Marcar Leídas
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {estadisticas.noLeidas} alertas no leídas
              </div>
            </div>
          </button>
          
          <button
            onClick={() => {
              const data = JSON.stringify(alertasFiltradas, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `alertas-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#10B981',
              border: '2px solid #10B981',
              borderRadius: '0.75rem',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Download size={24} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Exportar Datos
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Descargar como JSON
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alertas;