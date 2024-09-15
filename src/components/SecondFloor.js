import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function SecondFloor() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Darkmode-Status von localStorage abrufen
  const darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

  const tasks = ['Wischen', 'Küche', 'Treppe', 'Bad']; // 4 Aufgaben

  // Bewohner und Aufgaben laden
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const residentCollection = collection(db, 'secondFloorResidents'); // Sammlung der Bewohner
        const residentSnapshot = await getDocs(residentCollection);
        const residentList = residentSnapshot.docs.map((doc) => ({
          id: doc.id, // UID als Dokumentenname
          ...doc.data(),
        }));
        setResidents(residentList);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    };

    fetchResidents();
  }, []);

  // Berechne den aktuellen und den nächsten Dienst für jeden Bewohner basierend auf der Woche
  const calculateTaskForResident = (index, weeksOffset = 0) => {
    const currentWeek = new Date().getWeekNumber() + weeksOffset;
    return tasks[(index + currentWeek) % tasks.length];
  };

  // Berechne die aktuelle Woche (um zu bestimmen, welche Aufgaben für diese Woche sind)
  Date.prototype.getWeekNumber = function () {
    const oneJan = new Date(this.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((this - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((this.getDay() + 1 + numberOfDays) / 7);
  };

  if (loading) {
    return <div>Lade Daten...</div>;
  }

  return (
    <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2>Putzplan für die 2. Etage</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Bewohner</th>
            <th>Aktueller Dienst</th>
            <th>Nächster Dienst</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident, index) => (
            <tr key={resident.id}>
              <td>{resident.firstName} {resident.lastName}</td>
              <td>{calculateTaskForResident(index)}</td>
              <td>{calculateTaskForResident(index, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>-Treppendienst beeinhaltet Staubsaugen,Wischen und Altglas wegbringen wenn über die hälfte des Mülleimers voll ist. <br></br>
        -Küchendienst beinhaltet alle oberflächen reinigen,Ofen und Mikrowelle reinigen<br></br>
        -Badezimmer beinhaltet Dusche,Waschbecken und Klo reinigen und Bodenwischen<br></br>
        -Wischen der gesamten Etage vorher Straubsaugen<br></br>
      </p>
    </div>
  );
}

export default SecondFloor;
