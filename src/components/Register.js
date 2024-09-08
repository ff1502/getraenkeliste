import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth-Methode
import { auth } from '../firebase'; // Importiere Firebase Auth-Instanz

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Überprüfe, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password); // Benutzer registrieren
      alert('Registrierung erfolgreich!');
      navigate('/login'); // Nach erfolgreicher Registrierung weiterleiten
    } catch (error) {
      alert('Fehler bei der Registrierung: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrieren</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Email-Adresse:</label>
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
        <div className="form-group">
          <label>Passwort bestätigen:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
