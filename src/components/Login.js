import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase-Authentifizierung
import '../styles/styles.css';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Überprüfen, ob der Benutzer bereits eingeloggt ist (nach Seiten-Reload)
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true); // Benutzer ist bereits eingeloggt
        navigate('/drinklist'); // Zur Getränkeliste weiterleiten
      }
    });
  }, [setIsLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Setze die Authentifizierungssitzung auf die lokale Persistenz (auch nach Refresh)
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);

      setIsLoggedIn(true); // Setze den Login-Zustand
      navigate('/drinklist'); // Nach erfolgreichem Login weiterleiten
    } catch (error) {
      setErrorMessage('Ungültige Anmeldedaten, bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
          Einloggen
        </button>

      </form>

      <Link  className={"password-forget"} to="/password-reset">Passwort vergessen?</Link>

    </div>
  );
}

export default Login;
