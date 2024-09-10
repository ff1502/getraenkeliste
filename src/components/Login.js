import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Verwende Link für die Navigation
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Handle successful login
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert('Bitte gib deine E-Mail-Adresse ein, um dein Passwort zurückzusetzen.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Passwort-Reset-E-Mail wurde gesendet!');
    } catch (error) {
      alert('Fehler beim Senden der Passwort-Reset-E-Mail.');
      console.error('Fehler:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>E-Mail-Adresse:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Passwort:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      {/* Passwort-vergessen-Link */}
      <div className="mt-3">
        <Link to="#" onClick={handlePasswordReset}>Passwort vergessen?</Link>
      </div>
    </div>
  );
}

export default Login;
