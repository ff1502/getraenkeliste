import React, { useState } from 'react';

function Payment() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);

    if (method === 'banktransfer') {
      setShowBankTransfer(true); // Banküberweisung-Anleitung anzeigen
    } else {
      setShowBankTransfer(false); // Banküberweisung-Anleitung verbergen
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Bitte geben Sie einen gültigen Betrag ein.');
      return;
    }

    if (paymentMethod === 'paypal') {
      // PayPal-Zahlungslogik hier hinzufügen
      alert(`Sie werden zu PayPal weitergeleitet, um ${amount}€ zu bezahlen.`);
      setPaymentConfirmed(true);
    } else if (paymentMethod === 'banktransfer') {
      // Banküberweisung-Zahlungslogik
      alert(`Bitte überweisen Sie ${amount}€ gemäß der Banküberweisungsanleitung.`);
      setPaymentConfirmed(true);
    } else {
      alert('Bitte wählen Sie eine Zahlungsart.');
    }
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

        {/* Zeigt Banküberweisungsdetails an, wenn Banküberweisung ausgewählt ist */}
        {showBankTransfer && (
          <div className="alert alert-info mt-3">
            <h4>Anleitung für Banküberweisung</h4>
            <p>
              Bitte überweisen Sie den Betrag auf folgendes Konto:
              <br />
              IBAN: DE12345678901234567890
              <br />
              BIC: ABCDEFGH
              <br />
              Verwendungszweck: [Ihr Name] Bierkassenkonto
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
