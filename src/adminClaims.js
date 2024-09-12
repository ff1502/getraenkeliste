const admin = require("firebase-admin");
const serviceAccount = require("./getraenkeliste-app-firebase-adminsdk-yv9fy-fac2c82a2d.json");

// Initialisiere die Firebase Admin App
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://getraenkeliste-app.firebaseio.com"
});

// Setze Custom Claims
const uid = "yoyAcGWtKzf5XzL9MijLBCjYFo42";  // Hier die UID des Benutzers eingeben

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Admin-Claim für Benutzer ${uid} wurde gesetzt.`);
  })
  .catch((error) => {
    console.error("Fehler beim Setzen der Admin-Claims:", error);
  });
