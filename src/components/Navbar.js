import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import prutheniaLogo from '../images/pruthenia.jpeg';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/js/dist/collapse'; // Bootstrap's Collapse

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecondFloor, setIsSecondFloor] = useState(false);
  const navigate = useNavigate();
  const navbarCollapseRef = useRef(null); // Ref for the collapsible navbar

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'drinkCounts', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsAdmin(data.isAdmin || false);
          setIsSecondFloor(data.isSecondFloor || false);
        }
      }
    };
    if (isLoggedIn) {
      fetchUserRoles();
    }
  }, [isLoggedIn]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Fehler beim Ausloggen:', error);
    }
  };

  // Function to close the navbar on link click
  const handleLinkClick = () => {
    const collapseElement = navbarCollapseRef.current;
    if (collapseElement && collapseElement.classList.contains('show')) {
      collapseElement.classList.remove('show');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={prutheniaLogo} alt="Home" style={{ height: '40px', width: '40px' }} />
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
        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/drinklist" onClick={handleLinkClick}>
                    {t('drink_list')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/payment" onClick={handleLinkClick}>
                    {t('balance')}
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/statistics" onClick={handleLinkClick}>
                      {t('statistics')}
                    </Link>
                  </li>
                )}
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin" onClick={handleLinkClick}>
                      Admin
                    </Link>
                  </li>
                )}
                {isSecondFloor && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/second-floor" onClick={handleLinkClick}>
                      Zweite Etage
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/support" onClick={handleLinkClick}>
                    Support
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="ml-auto d-flex">
            {!isLoggedIn ? (
              <>
                <Link className="btn btn-outline-primary mr-2" to="/login" onClick={handleLinkClick}>
                  {t('login')}
                </Link>
                <Link className="btn btn-outline-success" to="/register" onClick={handleLinkClick}>
                  {t('register')}
                </Link>
                <Link className="nav-link" to="/support" onClick={handleLinkClick}>
                  Support
                </Link>
              </>
            ) : (
              <button className="btn btn-danger ml-auto" onClick={handleLogout}>
                {t('logout')}
              </button>
            )}

            <DropdownButton
              id="dropdown-language-button"
              title={i18n.language.toUpperCase()}
              className="ml-3"
              align="end"
              variant="light"
              style={{ color: 'black', backgroundColor: 'transparent', border: 'none' }}
            >
              <Dropdown.Item onClick={() => i18n.changeLanguage('en')} style={{ color: 'black' }}>
                EN
              </Dropdown.Item>
              <Dropdown.Item onClick={() => i18n.changeLanguage('de')} style={{ color: 'black' }}>
                DE
              </Dropdown.Item>
            </DropdownButton>

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
