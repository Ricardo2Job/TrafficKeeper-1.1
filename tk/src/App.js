import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Vista/Dashboard';
import Alertas from './Vista/Alertas';
import Predicciones from './Vista/Predicciones';
import RegistroDelClima from './Vista/RegistroDelClima';
import TransitoVehicular from './Vista/TransitoVehicular';
import Software from './Vista/Software';
import Informacion from './Vista/Informacion';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/predicciones" element={<Predicciones />} />
        <Route path="/registro-del-clima" element={<RegistroDelClima />} />
        <Route path="/transito-vehicular" element={<TransitoVehicular />} />
        <Route path="/software" element={<Software />} />
        <Route path="/informacion" element={<Informacion />} />
      </Routes>
    </Router>
  );
};

export default App;
