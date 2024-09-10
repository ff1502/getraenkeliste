import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase'; // Firebase-Authentifizierung
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase Firestore

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }

    try {
      // Benutzer registrieren
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Benutzerinformationen in der drinkCounts-Sammlung in Firestore speichern
      await setDoc(doc(db, 'drinkCounts', user.uid), {
        bier: 0,
        fassbier: 0,
        isAdmin: false,
        softdrink: 0,
        uid: user.uid,
        wasser: 0,
        wegbier: 0,
        firstName,
        lastName,
        email,
        balance: 0 // Initiales Guthaben
      });

      // Bestätigungs-E-Mail senden
      await sendEmailVerification(user);
      
      // Nachricht anzeigen und zur Login-Seite weiterleiten
      setMessage('Eine Bestätigungs-E-Mail wurde an deine E-Mail-Adresse gesendet. Bitte bestätige deine E-Mail, bevor du dich einloggst.');
      setTimeout(() => {
        navigate('/login'); // Weiterleitung zur Login-Seite
      }, 3000); // Weiterleitung nach 3 Sekunden

    } catch (error) {
      setError('Fehler bei der Registrierung: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrieren</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vorname</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nachname</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Passwort bestätigen</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Registrieren</button>
      </form>
    </div>
  );
}

export default Register;
