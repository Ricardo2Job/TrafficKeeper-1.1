// src/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para manejar el inicio de sesión
    console.log('Username:', username, 'Password:', password);
  };

  return React.createElement(
    'div',
    { className: 'login-container' },
    React.createElement(
      'h2',
      null,
      'Login'
    ),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          null,
          'Username:'
        ),
        React.createElement('input', {
          type: 'text',
          value: username,
          onChange: (e) => setUsername(e.target.value)
        })
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          null,
          'Password:'
        ),
        React.createElement('input', {
          type: 'password',
          value: password,
          onChange: (e) => setPassword(e.target.value)
        })
      ),
      React.createElement(
        'button',
        { type: 'submit' },
        'Login'
      )
    ),
    React.createElement(
      'div',
      { className: 'register-link' },
      React.createElement(
        Link,
        { to: '/register' },
        'Go to Register'
      )
    )
  );
}

export default Login;
