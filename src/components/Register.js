import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simuliere den Registrierungsprozess
    if (email && password) {
      setIsLoggedIn(true); // Benutzer als eingeloggt setzen
      navigate('/drinklist'); // Nach der Registrierung zur Getränkeliste navigieren
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrieren</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Passwort</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Registrieren
        </button>
      </form>
    </div>
  );
}

export default Register;
