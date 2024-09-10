import React from 'react';
import Payment from './Payment';
import BankTransfer from './BankTransfer';

function PaymentPage() {
  const userId = 'userId'; // Hier wird die tatsächliche Benutzer-ID übergeben

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <Payment userId={userId} />
        </div>
        <div className="col-md-6">
          <BankTransfer userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
