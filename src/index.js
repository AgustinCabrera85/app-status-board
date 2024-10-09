import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/reset.css';  // Importamos los estilos de Ant Design
import './index.css';  // Puedes agregar estilos personalizados aquí

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
