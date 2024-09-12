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
// Neue Seite für Second Floor importieren
import SecondFloor from './components/SecondFloor'; 
import EditUser from './components/EditUser'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        <Route path="/drinklist" element={isLoggedIn ? <DrinkList /> : <Navigate to="/login" />} />
        <Route path="/payment" element={isLoggedIn ? <Payment /> : <Navigate to="/login" />} />
        <Route path="/statistics" element={isLoggedIn ? <Statistics /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/support" element={<Support />} />
        {/* Neue Route für Second Floor */}
        <Route path="/second-floor" element={isLoggedIn ? <SecondFloor /> : <Navigate to="/login" />} />
        <Route path="/edituser/:userId" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;
