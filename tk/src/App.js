import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Vista/Login';
import Register from './Vista/Register';
import Dashboard from './Vista/Dashboard';
import SimulacionDeDatos from './Vista/SimulacionDeDatos';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto que redirige a /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulacion" element={<SimulacionDeDatos />} />
        {/* Ruta para manejar cualquier otra ruta no definida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
