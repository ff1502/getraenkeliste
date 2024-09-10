import React, { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Setze die Sitzungspersistenz auf lokale Persistenz (bleibt erhalten nach Aktualisierung)
      await setPersistence(auth, browserLocalPersistence);

      // Benutzer anmelden
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true); // Benutzer ist eingeloggt

      // Navigiere zur Getränkeliste
      navigate('/drinklist');

      // Optional: Automatisches Ausloggen nach 15 Minuten
      // setTimeout(() => {
      //   auth.signOut();
      //   setIsLoggedIn(false);
      //   navigate('/login');
      // }, 15 * 60 * 1000); // 15 Minuten in Millisekunden

    } catch (error) {
      setError('Fehler beim Einloggen: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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
        <button type="submit" className="btn btn-primary mt-3">Einloggen</button>
      </form>
    </div>
  );
}

export default Login;
