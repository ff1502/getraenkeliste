import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditUser() {
  const { id } = useParams(); // Benutzer-ID aus der URL holen
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drinkCounts, setDrinkCounts] = useState({
    softdrink: 0,
    bier: 0,
    wasser: 0,
    fassbier: 0,
    wegbier: 0
  });
  const [balance, setBalance] = useState(0); // Guthabenfeld hinzufügen
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'drinkCounts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          setDrinkCounts({
            softdrink: data.softdrink || 0,
            bier: data.bier || 0,
            wasser: data.wasser || 0,
            fassbier: data.fassbier || 0,
            wegbier: data.wegbier || 0,
          });
          setBalance(data.balance || 0); // Guthaben aus den Daten holen
          setLoading(false);
        } else {
          console.log('Benutzer nicht gefunden');
          navigate('/admin');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'drinkCounts', id);
      await updateDoc(docRef, {
        ...drinkCounts, // Getränkezahlen aktualisieren
        balance: balance // Guthaben aktualisieren
      });
      alert('Änderungen erfolgreich gespeichert');
      navigate('/admin');
    } catch (error) {
      console.error('Fehler beim Speichern der Änderungen:', error);
    }
  };

  const handleBalanceChange = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const handleDrinkCountChange = (key, amount) => {
    setDrinkCounts((prevCounts) => ({
      ...prevCounts,
      [key]: prevCounts[key] + amount,
    }));
  };

  const handleInputChange = (key, value) => {
    setDrinkCounts((prevCounts) => ({
      ...prevCounts,
      [key]: parseInt(value, 10),
    }));
  };

  if (loading) {
    return <div>Lade Benutzerdaten...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Bearbeite die Getränkeliste von {user.firstName} {user.lastName}</h2>
      <ul className="list-group mb-4">
        {Object.keys(drinkCounts).map((key) => (
          <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-danger me-2"
                onClick={() => handleDrinkCountChange(key, -1)}
                disabled={drinkCounts[key] === 0}
              >
                -
              </button>
              <input
                type="number"
                value={drinkCounts[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="form-control"
                style={{ width: '100px' }}
              />
              <button
                className="btn btn-success ms-2"
                onClick={() => handleDrinkCountChange(key, 1)}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Guthaben bearbeiten mit Plus/Minus Knöpfen und Eingabefeld */}
      <div className="form-group mt-4">
        <label>Guthaben:</label>
        <div className="d-flex align-items-center">
          <button className="btn btn-danger me-2" onClick={() => handleBalanceChange(-1)}>
            -
          </button>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value))}
            className="form-control"
            style={{ width: '150px' }}
          />
          <button className="btn btn-success ms-2" onClick={() => handleBalanceChange(1)}>
            +
          </button>
        </div>
      </div>

      <button onClick={handleUpdate} className="btn btn-primary mt-3">
        Änderungen speichern
      </button>
    </div>
  );
}

export default EditUser;
