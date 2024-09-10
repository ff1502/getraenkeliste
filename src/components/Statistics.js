import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Statistics() {
  const [drinkCounts, setDrinkCounts] = useState({
    softdrink: 0,
    bier: 0,
    wasser: 0,
    fassbier: 0,
    wegbier: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrinkData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'drinkCounts', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setDrinkCounts({
              softdrink: data.softdrink || 0,
              bier: data.bier || 0,
              wasser: data.wasser || 0,
              fassbier: data.fassbier || 0,
              wegbier: data.wegbier || 0,
            });
          }
        } catch (error) {
          console.error('Fehler beim Laden der Getränkedaten:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDrinkData();
  }, []);

  const data = {
    labels: ['Softdrink', 'Bier', 'Wasser', 'Fassbier', 'Wegbier'],
    datasets: [
      {
        label: 'Konsumierte Getränke',
        data: [
          drinkCounts.softdrink,
          drinkCounts.bier,
          drinkCounts.wasser,
          drinkCounts.fassbier,
          drinkCounts.wegbier,
        ],
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0', '#9966ff'],
      },
    ],
  };

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Statistiken über deinen Getränkekonsum</h2>
      <Bar data={data} />
    </div>
  );
}

export default Statistics;
