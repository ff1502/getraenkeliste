import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'drinkCounts'));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzer:', error);
      }
    };

    fetchUsers();
  }, []);

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
            <Link to={`/edituser/${user.id}`} className="btn btn-primary">
              Bearbeiten
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
