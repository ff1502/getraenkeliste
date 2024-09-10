import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase-Datenbank-Referenz

// Funktion zum Protokollieren von Benutzeraktionen
export const logUserAction = async (userId, actionType, details) => {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      userId: userId,
      actionType: actionType,
      details: details,
      timestamp: serverTimestamp(), // Firebase-Server-Timestamp
    });
    console.log('Aktionslog erfolgreich hinzugefügt.');
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Aktionslogs:', error);
  }
};
