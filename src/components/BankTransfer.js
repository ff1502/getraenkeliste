import React, { useState } from 'react';

function BankTransfer({ userId }) {
  const [amount, setAmount] = useState(0);

  return (
    <div>
      <h2>Guthaben per Überweisung aufladen</h2>
      <p>Bitte überweisen Sie den gewünschten Betrag an folgendes Bankkonto, es wird wöchentlich nachgeprüft und Guthaben dann zugewiesen:</p>
      <p>IBAN: DE74 3101 0833 9912 9527 13</p>
      <p>BIC: SCFBDE33XXX</p>
    </div>
  );
}

export default BankTransfer;
