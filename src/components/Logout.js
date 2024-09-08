import React from 'react';
import { useNavigate } from 'react-router-dom'; // Für die Navigation nach dem Logout
import { signOut } from 'firebase/auth'; // Firebase signOut importieren
import { auth } from '../firebase'; // Die Auth-Instanz aus Firebase importieren

function Logout() {
  const navigate = useNavigate(); // Verwende den useNavigate-Hook für die Navigation

  const handleLogout = async () => {
    try {
      await signOut(auth); // Benutzer ausloggen
      alert('Erfolgreich ausgeloggt!');
      navigate('/'); // Nach dem Ausloggen zur Startseite weiterleiten
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
      alert('Fehler beim Ausloggen. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Logout</h1>
      <button onClick={handleLogout} className="btn btn-danger">
        Ausloggen
      </button>
    </div>
  );
}

export default Logout;
