import React, { useState } from 'react';
import emailjs from 'emailjs-com'; // EmailJS verwenden
import { useNavigate } from 'react-router-dom';
import '../styles/Support.css';

function Support() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  emailjs.init('sXFYSK40kc_zm3Ji-');

  const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: email,
      message: message,
    };

    emailjs.send('service_egus9li', 'template_vm1bsye', templateParams, 'sXFYSK40kc_zm3Ji-')
    .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert('Nachricht erfolgreich gesendet!');
        navigate('/'); // Weiterleitung zur Startseite nach erfolgreichem Senden
      }, (error) => {
        console.log('FAILED...', error);
        alert('Fehler beim Senden der Nachricht.');
      });
  };

  return (
    <div className="container mt-4">
      <h2>Support & Feedback</h2>
      <form onSubmit={sendEmail}>
        <div className="form-group">
          <label>Deine E-Mail-Adresse:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Nachricht:</label>
          <textarea
            className="form-control"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Nachricht senden</button>
      </form>
    </div>
  );
}

export default Support;
