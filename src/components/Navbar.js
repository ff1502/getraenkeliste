import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import prutheniaLogo from '../images/pruthenia.jpeg'; // Stelle sicher, dass der Pfad korrekt ist

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false); // Setze den Zustand zurück, wenn der Benutzer ausgeloggt ist
      navigate('/login'); // Leite zur Login-Seite weiter
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      {/* Home Button mit Bild */}
      <Link className="navbar-brand" to="/">
        <img src={prutheniaLogo} alt="Home" style={{ height: '40px', width: '40px' }} />
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {/* Zeige diese Links nur an, wenn der Benutzer eingeloggt ist */}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/drinklist">Getränkeliste</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/payment">Guthaben aufladen</Link>
              </li>
            </>
          )}
        </ul>

        <div className="ml-auto d-flex">
          {/* Zeige Einloggen/Registrieren nur, wenn der Benutzer nicht eingeloggt ist */}
          {!isLoggedIn ? (
            <>
              <Link className="btn btn-outline-primary mr-2" to="/login">Einloggen</Link>
              <Link className="btn btn-outline-success" to="/register">Registrieren</Link>
            </>
          ) : (
            /* Zeige Ausloggen-Button, wenn der Benutzer eingeloggt ist */
            <button className="btn btn-danger ml-auto" onClick={handleLogout}>Ausloggen</button>
          )}

          {/* Darkmode Toggle Switch ganz rechts */}
          <div className="form-check form-switch ml-3 dark-mode-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="darkModeSwitch"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <label className="form-check-label" htmlFor="darkModeSwitch">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
