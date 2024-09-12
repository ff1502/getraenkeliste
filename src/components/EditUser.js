import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function EditUser() {
  const { userId } = useParams(); // Holen Sie die Benutzer-ID aus der URL
  const [user, setUser] = useState(null);
  const [drinkCounts, setDrinkCounts] = useState({
    softdrink: 0,
    bier: 0,
    wasser: 0,
    fassbier: 0,
    wegbier: 0,
  });
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  // Benutzerinformationen und Getränkezähler laden
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'drinkCounts', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setDrinkCounts({
            softdrink: userData.softdrink || 0,
            bier: userData.bier || 0,
            wasser: userData.wasser || 0,
            fassbier: userData.fassbier || 0,
            wegbier: userData.wegbier || 0,
          });
          setBalance(userData.balance || 0);
        } else {
          alert('Benutzer nicht gefunden');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Änderungen speichern
  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'drinkCounts', userId);
      await updateDoc(userDocRef, {
        softdrink: drinkCounts.softdrink,
        bier: drinkCounts.bier,
        wasser: drinkCounts.wasser,
        fassbier: drinkCounts.fassbier,
        wegbier: drinkCounts.wegbier,
        balance: balance,
      });

      // Log-Eintrag in die Logs-Sammlung hinzufügen
      await addDoc(collection(db, 'logs'), {
        action: 'Guthaben und Striche bearbeitet',
        details: `Neues Guthaben: ${balance}€, Getränke aktualisiert.`,
        firstName: user.firstName,
        lastName: user.lastName,
        timestamp: serverTimestamp(),
        userId: userId
      });

      alert('Änderungen erfolgreich gespeichert und geloggt!');
      navigate('/admin'); // Zurück zur Admin-Seite nach dem Speichern
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
      alert('Fehler beim Speichern der Daten');
    }
  };

  // Eingabewert für Getränkezähler ändern
  const handleDrinkCountChange = (type, value) => {
    const parsedValue = parseInt(value, 10);
    setDrinkCounts((prevCounts) => ({
      ...prevCounts,
      [type]: isNaN(parsedValue) ? 0 : parsedValue,
    }));
  };

  // Eingabewert für Guthaben ändern
  const handleBalanceChange = (value) => {
    const parsedValue = parseFloat(value);
    setBalance(isNaN(parsedValue) ? 0 : parsedValue);
  };

  if (!user) {
    return <div>Lade Benutzerdaten...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Bearbeite Getränkeliste für {user.firstName} {user.lastName}</h2>
      <h3>Guthaben: {balance.toFixed(2)} €</h3>

      <div className="mt-4">
        <h4>Getränkeliste</h4>
        <ul className="list-group mb-4">
          {Object.keys(drinkCounts).map((key) => (
            <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <input
                type="number"
                className="form-control"
                value={drinkCounts[key]}
                onChange={(e) => handleDrinkCountChange(key, e.target.value)}
              />
            </li>
          ))}
        </ul>

        <h4>Guthaben anpassen</h4>
        <div className="mb-3">
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={balance}
            onChange={(e) => handleBalanceChange(e.target.value)}
            placeholder="Guthaben eingeben"
          />
        </div>

        <div className="d-flex justify-content-between">
          {/* Zurück-Button */}
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">
            Zurück
          </button>

          {/* Speichern-Button */}
          <button onClick={handleSave} className="btn btn-primary">
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
