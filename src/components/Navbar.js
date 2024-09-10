import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import prutheniaLogo from '../images/pruthenia.jpeg'; // Stelle sicher, dass der Pfad korrekt ist
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownButton } from 'react-bootstrap'; // Bootstrap-Komponenten für Dropdown

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); // Ändere die Sprache
  };

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isAdmin, setIsAdmin] = useState(false); // Admin-Status
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'drinkCounts', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsAdmin(data.isAdmin || false); // Admin-Status aus Firestore laden
        }
      }
    };
    if (isLoggedIn) {
      fetchAdminStatus();
    }
  }, [isLoggedIn]);

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
      <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        <img src={prutheniaLogo} alt="Home" style={{ height: '40px', width: '40px' }} />
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/drinklist">{t('drink_list')}</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/payment">{t('balance')}</Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/statistics">{t('statistics')}</Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/support">Support</Link>
              </li>
            </>
          )}
        </ul>
        
        <div className="ml-auto d-flex">
          {!isLoggedIn ? (
            <>
              <Link className="btn btn-outline-primary mr-2" to="/login">{t('login')}</Link>
              <Link className="btn btn-outline-success" to="/register">{t('register')}</Link>
              <Link className="nav-link" to="/support">Support</Link>
            </>
          ) : (
            <button className="btn btn-danger ml-auto" onClick={handleLogout}>{t('logout')}</button>
          )}

          {/* Sprachumschaltung Dropdown */}
          <DropdownButton
            id="dropdown-language-button"
            title={i18n.language.toUpperCase()} // Zeige die aktuelle Sprache (EN oder DE)
            className="ml-3"
            align="end" // Dropdown nach rechts ausrichten
            variant="light" // Setze die Schriftfarbe auf Schwarz
            style={{ color: 'black', backgroundColor: 'transparent', border: 'none' }} // Schwarze Schrift, transparentes Dropdown
          >
            <Dropdown.Item onClick={() => changeLanguage('en')} style={{ color: 'black' }}>EN</Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage('de')} style={{ color: 'black' }}>DE</Dropdown.Item>
          </DropdownButton>

          {/* Darkmode Toggle Switch */}
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
      </div>
    </nav>
  );
}

export default Navbar;
