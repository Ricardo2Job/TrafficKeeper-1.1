import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Inicio from './Vista/Inicio';
import Login from './Vista/Login';
import Register from './Vista/Register';
import Dashboard from './Vista/Dashboard';
import SimulacionDeDatos from './Vista/SimulacionDeDatos'; // Asegúrate de que la ruta sea correcta

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/simulacion" element={<SimulacionDeDatos />} /> {/* Ruta para SimulacionDeDatos */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
