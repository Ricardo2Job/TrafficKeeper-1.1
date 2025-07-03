import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './Vista/Inicio';
import Login from './Vista/Login';
import Register from './Vista/Register';
import Clima from './Vista/Clima';
import Dashboard from './Vista/Dashboard';
import FlujoVehicular from './Vista/FlujoVehicular';
import Mapa from './Vista/Mapa';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clima" element={<Clima />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flujo-vehicular" element={<FlujoVehicular />} />
        <Route path="/mapa" element={<Mapa />} />     
      </Routes>
    </Router>
  );
};

export default App;
