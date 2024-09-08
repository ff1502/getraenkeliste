import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Zustand für die Authentifizierung
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Benutzer ist eingeloggt
      } else {
        setIsAuthenticated(false); // Benutzer ist ausgeloggt
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
            {!isAuthenticated && ( // Nur anzeigen, wenn der Benutzer nicht eingeloggt ist
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
            {isAuthenticated && ( // Nur anzeigen, wenn der Benutzer eingeloggt ist
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Ausloggen
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
