import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { logUserAction } from '../helpers/logging'; // Log-Funktion

function Payment() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
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
      alert(`Sie werden zu PayPal weitergeleitet, um ${amount}€ zu bezahlen.`);
      window.location.href = `https://www.paypal.me/PrutheniaBierkasse/${amount}`;
      setPaymentConfirmed(true);

      await logUserAction(auth.currentUser.uid, 'Guthaben aufgeladen', `Betrag: ${amount}€ (PayPal)`);
      
    } else if (paymentMethod === 'banktransfer') {
      alert(`Bitte überweise ${amount}€ gemäß den Banküberweisungsanweisungen.`);
      setPaymentConfirmed(true);

      await logUserAction(auth.currentUser.uid, 'Guthaben per Banküberweisung angefragt', `Betrag: ${amount}€`);
    } else {
      alert('Bitte wähle eine Zahlungsart.');
    }

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

        {paymentMethod === 'banktransfer' && (
          <div className="alert alert-info mt-3">
            <h4>Wichtige Hinweise zur Banküberweisung</h4>
            <p>
              Dein Guthaben wird aktualisiert, sobald das Geld auf dem Bankkonto eingegangen ist. <br></br>
              Bitte überweise den Betrag auf das angegebene Konto. Die Bearbeitung kann einige Tage dauern. <br></br>

              Kontoinhaber: Florian Förster <br></br>
              IBAN: DE74 3101 0833 9912 9527 13 <br></br>
              BIC: SCFBDE33XXX        <br></br>

            </p>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="alert alert-info mt-3">
            <h4>Hinweis zu PayPal</h4>
            <p>
              Dein Guthaben wird aktualisiert, sobald die Zahlung auf dem PayPal-Konto eingegangen ist. <br></br>
              Nach Abschluss der Zahlung wirst du automatisch zur Getränkeliste weitergeleitet.<br></br>
            </p>
          </div>
        )}

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
