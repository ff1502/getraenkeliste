import React from 'react';
import '../styles/Home.css'; // Importiere die CSS-Datei für die Home-Komponente

function Home() {
  return (
    <div className="home-background">
        <div className="with-blur-backdrop">
            <h1>Willkommen zur Getränke-App!</h1>
            <h3>Bei Verbesserungsvorschlägen gerne über den Support eine E-Mail da lassen</h3>
        </div>
    </div>
  );
}

export default Home;
