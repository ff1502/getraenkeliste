import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function EditUser() {
  const { userId } = useParams(); // Holen Sie die Benutzer-ID aus der URL
  const [user, setUser] = useState(null);
  const [drinkCounts, setDrinkCounts] = useState({
    softdrink: '',
    bier: '',
    wasser: '',
    fassbier: '',
    wegbier: '',
  });
  const [balance, setBalance] = useState('');
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
            softdrink: userData.softdrink || '',
            bier: userData.bier || '',
            wasser: userData.wasser || '',
            fassbier: userData.fassbier || '',
            wegbier: userData.wegbier || '',
          });
          setBalance((userData.balance || 0).toFixed(2));
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
        softdrink: drinkCounts.softdrink === '' ? 0 : parseInt(drinkCounts.softdrink, 10),
        bier: drinkCounts.bier === '' ? 0 : parseInt(drinkCounts.bier, 10),
        wasser: drinkCounts.wasser === '' ? 0 : parseInt(drinkCounts.wasser, 10),
        fassbier: drinkCounts.fassbier === '' ? 0 : parseInt(drinkCounts.fassbier, 10),
        wegbier: drinkCounts.wegbier === '' ? 0 : parseInt(drinkCounts.wegbier, 10),
        balance: balance === '' ? 0 : parseFloat(balance).toFixed(2),
      });

      // Log-Eintrag in die Logs-Sammlung hinzufügen
      await addDoc(collection(db, 'logs'), {
        action: 'Guthaben und Striche bearbeitet',
        details: `Neues Guthaben: ${balance === '' ? '0.00' : balance}€, Getränke aktualisiert.`,
        firstName: user.firstName,
        lastName: user.lastName,
        timestamp: serverTimestamp(),
        userId: userId,
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
    setDrinkCounts((prevCounts) => ({
      ...prevCounts,
      [type]: value === '' ? '' : value,
    }));
  };

  // Eingabewert für Guthaben ändern (negative Werte zulassen)
  const handleBalanceChange = (value) => {
    const parsedValue = parseFloat(value);
    setBalance(isNaN(parsedValue) ? '' : parsedValue.toFixed(2));
  };

  if (!user) {
    return <div>Lade Benutzerdaten...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Bearbeite Getränkeliste für {user.firstName} {user.lastName}</h2>
      <h3>Guthaben: {balance === '' ? '0.00' : balance} €</h3>

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
                placeholder="0"
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
            placeholder="Guthaben eingeben (kann negativ sein)"
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
