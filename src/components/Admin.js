import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionSums, setTransactionSums] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin-Status überprüfen
  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdTokenResult();
          if (token.claims.admin) {
            setIsAdmin(true);
          } else {
            alert('Sie haben keine Admin-Rechte.');
          }
        } catch (error) {
          console.error("Fehler beim Abrufen des Admin-Status:", error);
        }
      }
    };

    checkAdminStatus();
  }, []);

  // Benutzer und Transaktionen laden
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsersAndTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'drinkCounts'));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(userList);
        setLoading(false);

        userList.forEach(async (user) => {
          try {
            const userLogs = await getDocs(
              query(collection(db, 'logs'), where('userId', '==', user.id))
            );
            let totalAmount = 0;
            userLogs.forEach((log) => {
              const logDetails = log.data().details;
              const amountMatch = logDetails.match(/Betrag: (\d+(?:\.\d+)?)/);
              if (amountMatch) {
                totalAmount += parseFloat(amountMatch[1]);
              }
            });

            setTransactionSums((prevSums) => ({
              ...prevSums,
              [user.id]: totalAmount,
            }));
          } catch (error) {
            console.error('Fehler beim Abrufen der Logs:', error);
          }
        });
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzer oder Transaktionen:', error);
      }
    };

    fetchUsersAndTransactions();
  }, [isAdmin]);

  // Logs für einen Benutzer bereinigen und Summe auf 0 setzen
  const clearLogsForUser = async (userId) => {
    try {
      const logsSnapshot = await getDocs(query(collection(db, 'logs'), where('userId', '==', userId)));
      logsSnapshot.forEach(async (logDoc) => {
        await deleteDoc(doc(db, 'logs', logDoc.id)); // Löscht den Log-Eintrag
      });

      // Setze die Transaktionssumme für den Benutzer auf 0 €
      setTransactionSums((prevSums) => ({
        ...prevSums,
        [userId]: 0,
      }));

      alert(`Die Logs von Benutzer ${userId} wurden bereinigt und die Transaktionssumme wurde auf 0 € gesetzt.`);
    } catch (error) {
      console.error('Fehler beim Bereinigen der Logs:', error);
      alert('Fehler beim Bereinigen der Logs.');
    }
  };

  if (!isAdmin) {
    return <div>Sie haben keine Admin-Rechte.</div>;
  }

  if (loading) {
    return <div>Lade Benutzerliste...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Benutzerverwaltung</h2>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {user.firstName} {user.lastName}
            </span>

            {/* Summe der Transaktionen anzeigen */}
            <span className="me-4">
              Gesamte Aufladung: {transactionSums[user.id] !== undefined ? `${transactionSums[user.id].toFixed(2)} €` : '0.00 €'}
            </span>

            <Link to={`/edituser/${user.id}`} className="btn btn-primary">
              Bearbeiten
            </Link>

            {/* Button zum Bereinigen der Logs für diesen Benutzer */}
            <button onClick={() => clearLogsForUser(user.id)} className="btn btn-danger ms-3">
              Logs bereinigen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
