import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore-Instanz

export const logUserAction = async (userId, action, details) => {
  try {
    // Hole firstName und lastName aus der drinkCounts-Sammlung mit der userId
    const userRef = doc(db, 'drinkCounts', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const firstName = userData.firstName || 'Unbekannt';
      const lastName = userData.lastName || 'Unbekannt';

      // Erstelle den Log-Eintrag mit firstName, lastName und den Aktionen
      await addDoc(collection(db, 'logs'), {
        userId,
        firstName,
        lastName,
        action,
        details,
        timestamp: serverTimestamp(),
      });

      console.log('Log-Eintrag erfolgreich hinzugefügt');
    } else {
      console.error('Benutzer-Dokument existiert nicht.');
    }
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Aktionslogs:', error);
  }
};
