import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import '../Styles/StyleInicio.css';

const Inicio = () => {
  return (
    <div className="inicio">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <div className="add-widget">
            <button className="add-widget-button">+</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inicio;
