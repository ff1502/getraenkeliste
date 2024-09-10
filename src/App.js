import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import DrinkList from './components/DrinkList';
import Statistics from './components/Statistics';
import Payment from './components/Payment';
import Admin from './components/Admin';
import Support from './components/Support';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Überprüfe den Authentifizierungsstatus, wenn die App startet
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Aufräumen des Listeners
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        {/* Route zur Startseite */}
        <Route path="/" element={<Home />} />
        
        {/* Route für das Login, aber wenn der Benutzer eingeloggt ist, weiter zur Startseite */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        
        {/* Route für die Registrierung, aber wenn der Benutzer eingeloggt ist, weiter zur Startseite */}
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        
        {/* Route für die Getränkeliste, nur sichtbar, wenn der Benutzer eingeloggt ist */}
        <Route path="/drinklist" element={isLoggedIn ? <DrinkList /> : <Navigate to="/login" />} />
        
        {/* Route für die Zahlungsseite, nur sichtbar, wenn der Benutzer eingeloggt ist */}
        <Route path="/payment" element={isLoggedIn ? <Payment /> : <Navigate to="/login" />} />
        
        {/* Route für die Statistiken, nur sichtbar, wenn der Benutzer eingeloggt ist */}
        <Route path="/statistics" element={isLoggedIn ? <Statistics /> : <Navigate to="/login" />} />
        
        {/* Route für den Admin-Bereich, nur sichtbar, wenn der Benutzer eingeloggt ist */}
        <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
        
        {/* Route für den Support-Bereich, ohne Login zugänglich */}
        <Route path="/support" element={<Support />} />
      </Routes>
    </Router>
  );
}

export default App;
