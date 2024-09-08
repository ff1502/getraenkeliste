import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Überprüfen, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein!');
      return;
    }

    try {
      // Benutzer in Firebase Auth erstellen
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Benutzerdaten in Firestore speichern
      await setDoc(doc(db, 'drinkCounts', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        balance: 0, // Setze das Startguthaben auf 0
        softdrink: 0,
        bier: 0,
        wasser: 0,
        fassbier: 0,
        wegbier: 0,
        isAdmin: false // Adminstatus standardmäßig auf false setzen
      });

      alert('Registrierung erfolgreich!');
      navigate('/login'); // Nach erfolgreicher Registrierung zum Login weiterleiten
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrieren</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Vorname:</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nachname:</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
