import React, { useState } from 'react';
import { doc, getDoc, updateDoc, setDoc, getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firebase Firestore
import { auth } from '../firebase'; // Firebase-Authentifizierung
import { useNavigate } from 'react-router-dom';

function FriendsAndFamilyPayment() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  const handleAmountChange = (e) => {
    let value = e.target.value;
    value = value.replace(',', '.'); // Konvertiere Komma in Punkt
    value = value.replace(/[^0-9.]/g, ''); // Entferne ungültige Zeichen
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1]?.length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }
    setAmount(value);
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);

    if (method === 'banktransfer') {
      setShowBankTransfer(true); // Banküberweisung anzeigen
    } else {
      setShowBankTransfer(false); // Verstecke Banküberweisung
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Bitte geben Sie einen gültigen Betrag ein.');
      return;
    }

    if (paymentMethod === 'paypal') {
      window.location.href = `https://paypal.me/PrutheniaBierkasse/${amount}`;
      alert(`Sie werden zu PayPal weitergeleitet, um ${amount}€ zu bezahlen.`);
      await updateBalanceInFirebase(parseFloat(amount));
      setPaymentConfirmed(true); // Zahlung abgeschlossen
    } else if (paymentMethod === 'banktransfer') {
      alert(`Bitte überweisen Sie ${amount}€ gemäß der Banküberweisungsanleitung.`);
      await updateBalanceInFirebase(parseFloat(amount));
      setPaymentConfirmed(true); // Zahlung abgeschlossen
    } else {
      alert('Bitte wählen Sie eine Zahlungsart.');
    }
  };

  const updateBalanceInFirebase = async (amount) => {
    const user = auth.currentUser;  // Prüfe, ob der Benutzer eingeloggt ist

    if (user) {
      const userRef = doc(db, 'drinkCounts', user.uid);  // Referenz auf die drinkCounts-Sammlung

      try {
        console.log('Benutzer-ID:', user.uid); // Log zur Überprüfung

        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const currentBalance = userDoc.data().balance || 0; // Aktuelles Guthaben
          const newBalance = currentBalance + amount; // Guthaben hinzufügen

          // Aktualisiere das Guthaben in Firestore
          await updateDoc(userRef, { balance: newBalance });
          console.log(`Guthaben von ${user.email} wurde um ${amount}€ erhöht. Neues Guthaben: ${newBalance}€.`);

          const firstName = userDoc.data().firstName || 'Unbekannt';
          const lastName = userDoc.data().lastName || 'Unbekannt';

          // Transaktionslog erstellen
          await addDoc(collection(db, 'transactions'), {
            uid: user.uid,
            firstName: firstName,
            lastName: lastName,
            amount: amount,
            timestamp: serverTimestamp(),
          });
          console.log('Transaktionslog wurde hinzugefügt.');
        } else {
          console.error('Benutzer-Dokument existiert nicht.');
        }
      } catch (error) {
        console.error('Fehler beim Abrufen oder Aktualisieren des Guthabens:', error); // Log für den Fehler
      }
    } else {
      console.error('Kein Benutzer eingeloggt.');
    }
  };


  return (
    <div className="container mt-4">
      <h2>Guthaben aufladen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Betrag (€)</label>
          <input
            type="text"
            className="form-control"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Betrag eingeben"
            required
          />
        </div>
        <div className="form-group">
          <label>Zahlungsart</label>
          <select
            className="form-control"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            required
          >
            <option value="">Bitte Zahlungsart wählen</option>
            <option value="paypal">PayPal</option>
            <option value="banktransfer">Banküberweisung</option>
          </select>
        </div>

        {showBankTransfer && (
          <div className="alert alert-info mt-3">
            <h4>Anleitung für Banküberweisung</h4>
            <p>
              Bitte überweisen Sie den Betrag auf folgendes Konto:
              <br />
              Bank: Musterbank
              <br />
              IBAN: DE12345678901234567890
              <br />
              BIC: ABCDEFGH
              <br />
              Verwendungszweck: [Ihr Name]
            </p>
          </div>
        )}

        {paymentConfirmed && (
          <div className="alert alert-success mt-3">
            Zahlung erfolgreich! Ihr Guthaben wurde aktualisiert.
          </div>
        )}

        {/* Button nur anzeigen, wenn die Zahlung nicht bestätigt wurde */}
        {!paymentConfirmed && (
          <button type="submit" className="btn btn-primary mt-3">
            Bestätigen
          </button>
        )}
      </form>
    </div>
  );
}

export default FriendsAndFamilyPayment;
