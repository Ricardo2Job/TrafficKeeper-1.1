// src/Register.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para manejar el registro
    console.log('Username:', username, 'Password:', password);
  };

  return React.createElement(
    'div',
    { className: 'register-container' },
    React.createElement(
      'h2',
      null,
      'Register'
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
        'Register'
      )
    ),
    React.createElement(
      'div',
      { className: 'register-link' },
      React.createElement(
        Link,
        { to: '/' },
        'Go to Login'
      )
    )
  );
}

export default Register;
