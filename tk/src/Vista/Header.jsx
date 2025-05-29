import React from 'react';
import '../Styles/StyleHeader.css';

const Header = () => {
  return (
    <div className="header">
      <h1>Admin Dashboard</h1>
      <div className="user-info">
        <span>Buscar...</span>
        <img src="user-icon.png" alt="Usuario" />
        <span>Usuario</span>
      </div>
    </div>
  );
};

export default Header;
