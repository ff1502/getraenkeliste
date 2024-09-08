import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase'; // Firestore importieren
import { doc, getDoc } from 'firebase/firestore'; // Firestore-Daten abrufen

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin-Status
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Überprüfe, ob der Benutzer Admin ist
        const docRef = doc(db, 'drinkCounts', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().isAdmin) {
          setIsAdmin(true); // Benutzer ist Admin
        } else {
          setIsAdmin(false); // Benutzer ist kein Admin
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Erfolgreich ausgeloggt!');
      navigate('/login');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Getränke-App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Startseite
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/drinklist">
                Getränkeliste
              </Link>
            </li>
            {isAuthenticated && isAdmin && ( // Admin-Reiter nur anzeigen, wenn der Benutzer Admin ist
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Ausloggen
                </button>
              </li>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registrieren
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
