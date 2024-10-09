import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';  // Importamos los estilos de Ant Design
import './index.css';  // Puedes agregar estilos personalizados aquí

// Obtener el contenedor donde se va a renderizar la aplicación
const container = document.getElementById('root');

// Crear el root usando el nuevo método createRoot
const root = createRoot(container);

// Renderizar la aplicación con React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
