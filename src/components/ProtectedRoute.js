import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Lade...</div>; // Ladeanzeige, solange der Auth-Zustand ermittelt wird
  }

  // Wenn kein Benutzer eingeloggt ist, weiterleiten
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
