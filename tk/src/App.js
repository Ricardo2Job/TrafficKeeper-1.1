import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inicio from './Vista/Inicio';
import Alertas from './Vista/Alertas';
import Predicciones from './Vista/Predicciones';
import RegistroDelClima from './Vista/RegistroDelClima';
import TransitoVehicular from './Vista/TransitoVehicular';
import Software from './Vista/Software';
import Informacion from './Vista/Informacion';
import Login from './Vista/Login';
import Register from './Vista/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/predicciones" element={<Predicciones />} />
        <Route path="/registro-del-clima" element={<RegistroDelClima />} />
        <Route path="/transito-vehicular" element={<TransitoVehicular />} />
        <Route path="/software" element={<Software />} />
        <Route path="/informacion" element={<Informacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
