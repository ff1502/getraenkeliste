import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import Payment from './Payment';
import { updateBalance } from '../utils/balanceUtils'; // Importiere die Guthaben-Aktualisierungsfunktion
import { useNavigate } from 'react-router-dom';
import { logUserAction } from '../helpers/logging'; // Importiere die Log-Funktion
import '../styles/DrinkList.css';

function DrinkList() {
  const [drinkCounts, setDrinkCounts] = useState({
    softdrink: 0,
    bier: 0,
    wasser: 0,
    fassbier: 0,
    wegbier: 0,
  });

  const [balance, setBalance] = useState(0);
  const [drinkPrices, setDrinkPrices] = useState({});
  const [sortedDrinks, setSortedDrinks] = useState([]); // Sortierte Getränke
  const [userDetails, setUserDetails] = useState({ firstName: '', lastName: '' });
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserDetailsAndDrinkCounts = async () => {
      if (user) {
        try {
          // Getränkedaten und Vor- und Nachname des Benutzers abrufen
          const docRef = doc(db, 'drinkCounts', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setDrinkCounts({
              softdrink: data.softdrink || 0,
              bier: data.bier || 0,
              wasser: data.wasser || 0,
              fassbier: data.fassbier || 0,
              wegbier: data.wegbier || 0,
            });
            setBalance(data.balance || 0);
            setUserDetails({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
            });
          }

          // Getränkepreise aus Firestore abrufen
          const priceRef = doc(db, 'drinkPrices', 'defaultPrices');
          const priceSnap = await getDoc(priceRef);

          if (priceSnap.exists()) {
            const prices = priceSnap.data();
            setDrinkPrices(prices);

            // Getränke nach Preis sortieren
            const sortedDrinksArray = Object.keys(prices).sort((a, b) => prices[a] - prices[b]);
            setSortedDrinks(sortedDrinksArray);
          }
        } catch (error) {
          console.error('Fehler beim Laden der Daten:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetailsAndDrinkCounts();
  }, [user]);

  const handlePaymentSuccess = async (details) => {
    const amount = parseFloat(details.purchase_units[0].amount.value);
    updateBalance(user.uid, amount); // Aktualisiere das Guthaben nach erfolgreicher Zahlung

    // Logge die Guthabenaufladung
    await logUserAction(user.uid, 'Guthaben aufgeladen', `Betrag: ${amount}€`);
  };

  const updateDrinkCount = async (type, change) => {
    const price = drinkPrices[type] || 0;
  
    setDrinkCounts((prevCounts) => ({
      ...prevCounts,
      [type]: prevCounts[type] + change,
    }));
  
    setBalance((prevBalance) => prevBalance + price * -change);
  
    // Logge die Aktion des Benutzers
    await logUserAction(user.uid, `Getränk ${change > 0 ? 'hinzugefügt' : 'entfernt'}`, `${type.charAt(0).toUpperCase() + type.slice(1)}: ${change > 0 ? '1' : '-1'}`);
  };

  const handleBankTransfer = async (amount) => {
    updateBalance(user.uid, amount); // Aktualisiere das Guthaben nach bestätigter Überweisung

    // Logge die Banküberweisung
    await logUserAction(user.uid, 'Guthaben per Banküberweisung aufgeladen', `Betrag: ${amount}€`);
  };

  const saveCounts = async () => {
    if (user) {
      try {
        const docRef = doc(db, 'drinkCounts', user.uid);
  
        await updateDoc(docRef, {
          softdrink: drinkCounts.softdrink,
          bier: drinkCounts.bier,
          wasser: drinkCounts.wasser,
          fassbier: drinkCounts.fassbier,
          wegbier: drinkCounts.wegbier,
          balance: balance,
        });
  
        alert('Änderungen wurden gespeichert!');
  
        // Logge das Speichern der Änderungen
        await logUserAction(user.uid, 'Änderungen gespeichert', 'Getränkezähler und Guthaben wurden aktualisiert');
      } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern der Daten.');
      }
    }
  };

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  return (
    <div className="container mt-4">
      {/* Überschrift mit Benutzername */}
      <h2 className="text-center">
        Deine Getränkeliste, {userDetails.firstName} {userDetails.lastName}
      </h2>
      <h3 className="text-center">Guthaben: {balance.toFixed(2)} €</h3>

      {/* Sortierte Getränkeliste */}
      <div className="mt-4">
        <h4>Getränkeliste</h4>
        <ul className="list-group mb-4">
          {sortedDrinks.map((key) => (
            <li
              key={key}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-danger me-2"
                  onClick={() => updateDrinkCount(key, -1)}
                  disabled={drinkCounts[key] === 0}
                >
                  -
                </button>
                <span className="me-2">{drinkCounts[key]}</span>
                <button
                  className="btn btn-success"
                  onClick={() => updateDrinkCount(key, 1)}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={saveCounts} className="btn btn-primary btn-block mt-3">
          Speichern
        </button>
      </div>
      <div className="mt-4">
        <Link to="/payment" className="btn btn-primary">
          Guthaben aufladen
        </Link>
      </div>
      {/* Sortierte Preisliste */}
      <div className="mt-4">
        <h4>Preisliste</h4>
        <ul className="list-group mb-4">
          {sortedDrinks.map((key) => (
            <li
              key={key}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span>{drinkPrices[key].toFixed(2)} €</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DrinkList;
