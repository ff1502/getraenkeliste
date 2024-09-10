import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBalance } from '../utils/balanceUtils'; // Guthaben-Update Funktion
import { auth } from '../firebase';
import { logUserAction } from '../helpers/logging'; // Log-Funktion

function Payment() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Bitte gib einen gültigen Betrag ein.');
      return;
    }

    if (paymentMethod === 'paypal') {
      // Weiterleitung zu PayPal.me für die Zahlung
      alert(`Sie werden zu PayPal weitergeleitet, um ${amount}€ zu bezahlen.`);
      window.location.href = `https://www.paypal.me/PrutheniaBierkasse/${amount}`;
      setPaymentConfirmed(true);

      // Guthaben aktualisieren nach der Zahlung
      await updateBalance(user.uid, parseFloat(amount));
      await logUserAction(user.uid, 'Guthaben aufgeladen', `Betrag: ${amount}€ (PayPal)`);
      
    } else if (paymentMethod === 'banktransfer') {
      alert(`Bitte überweise ${amount}€ gemäß den Banküberweisungsanweisungen.`);
      setPaymentConfirmed(true);

      // Banküberweisung loggen
      await logUserAction(user.uid, 'Guthaben per Banküberweisung angefragt', `Betrag: ${amount}€`);
    } else {
      alert('Bitte wähle eine Zahlungsart.');
    }

    // Nach Bestätigung zur Getränkeliste weiterleiten
    navigate('/drinklist');
  };

  return (
    <div className="container mt-4">
      <h2>Guthaben aufladen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Betrag (€)</label>
          <input
            type="number"
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

        {paymentConfirmed && (
          <div className="alert alert-success mt-3">
            Zahlung erfolgreich! Vielen Dank für Ihre Überweisung.
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-3">
          Bestätigen
        </button>
      </form>
    </div>
  );
}

export default Payment;
