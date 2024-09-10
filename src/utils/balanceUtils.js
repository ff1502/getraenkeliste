import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore-Instanz importieren

export async function updateBalance(userId, amount) {
  const userRef = doc(db, 'drinkCounts', userId);
  try {
    await updateDoc(userRef, {
      balance: increment(amount) // Guthaben um den angegebenen Betrag erhöhen
    });
    console.log('Guthaben erfolgreich aktualisiert');
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Guthabens:', error);
  }
}
