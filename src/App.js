import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DrinkList from './components/DrinkList';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import FriendsAndFamilyPayment from './components/FriendsAndFamilyPayment';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login-Zustand

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/drinklist"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <DrinkList />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment" element={<FriendsAndFamilyPayment />} />
      </Routes>
    </Router>
  );
}

export default App;
