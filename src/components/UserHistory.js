import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

function UserHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (user) {
        const q = query(
          collection(db, 'activityLogs'),
          where('uid', '==', user.uid)
        );

        try {
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map((doc) => doc.data());
          setHistory(historyData);
          setLoading(false);
        } catch (error) {
          console.error('Fehler beim Laden der Historie:', error);
        }
      }
    };

    fetchUserHistory();
  }, [user]);

  if (loading) {
    return <div>Lade deine Historie...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Verlauf deiner Aktionen</h2>
      {history.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Aktion</th>
              <th>Details</th>
              <th>Zeitpunkt</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.actionType}</td>
                <td>{item.details}</td>
                <td>{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Es wurden bisher keine Aktionen durchgeführt.</p>
      )}
    </div>
  );
}

export default UserHistory;
sons