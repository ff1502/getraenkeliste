import React from 'react';
import ReactDOM from 'react-dom/client'; // Neuer Import in React 18
import App from './App'; // Dein Haupt-App-Komponente
import './styles/index.css'; // Dein Stylesheet
import './styles/styles.css';
import './components/i18n'; // Importiere i18n-Konfiguration

// Hole das Root-Element aus dem DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendere die App-Komponente im Root-Element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
