import React, { useState } from 'react';
import { auth } from '../firebase';
import { logUserAction } from '../helpers/logging';

function BankTransfer({ userId }) {
  const [amount, setAmount] = useState(0);
  const user = auth.currentUser;

  const handleBankTransfer = async () => {
    if (amount > 0) {
      // Logge die Banküberweisungsanfrage
      await logUserAction(user.uid, 'Guthaben per Überweisung angefragt', `Betrag: ${amount}€`);
      alert(`Bitte überweisen Sie ${amount}€ an das angegebene Bankkonto.`);
    } else {
      alert('Bitte geben Sie einen gültigen Betrag ein.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Guthaben per Überweisung aufladen</h2>
      <p>Bitte überweisen Sie den gewünschten Betrag an folgendes Bankkonto, es wird wöchentlich nachgeprüft und Guthaben dann zugewiesen:</p>
      <p>IBAN: DE74 3101 0833 9912 9527 13</p>
      <p>BIC: SCFBDE33XXX</p>

      <div className="form-group mt-3">
        <label>Betrag (€)</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button onClick={handleBankTransfer} className="btn btn-primary mt-3">
        Bestätigen
      </button>
    </div>
  );
}

export default BankTransfer;
