import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Stelle sicher, dass auth korrekt importiert ist

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet.');
      setError(''); // Setze den Fehler zurück, falls vorher einer vorhanden war
    } catch (error) {
      setError('Fehler beim Senden der E-Mail. Bitte überprüfe die eingegebene E-Mail-Adresse.');
      setMessage(''); // Setze die Nachricht zurück, falls vorher eine vorhanden war
    }
  };

  return (
    <div className="container mt-4">
      <h2>Passwort vergessen</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email-Adresse</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Gib deine E-Mail-Adresse ein"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Passwort zurücksetzen
        </button>
      </form>
    </div>
  );
}

export default PasswordReset;
