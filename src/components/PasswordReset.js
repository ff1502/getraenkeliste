import React, { useState } from 'react';
import { auth } from '../firebase'; // Firebase-Auth importieren
import { sendPasswordResetEmail } from 'firebase/auth';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('E-Mail zum Zurücksetzen des Passworts wurde gesendet. Bitte überprüfe dein Postfach.');
    } catch (error) {
      console.error('Fehler beim Senden der Passwort-Reset-E-Mail:', error);
      setMessage('Fehler beim Senden der E-Mail. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Passwort vergessen</h2>
      <form onSubmit={handlePasswordReset}>
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
        <button type="submit" className="btn btn-primary mt-3">
          Passwort zurücksetzen
        </button>
      </form>

      {message && (
        <div className="mt-3 alert alert-info" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

export default PasswordReset;
