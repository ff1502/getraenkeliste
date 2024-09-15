import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App'; // Überprüfe, ob dieser Pfad korrekt ist

test('renders App component without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Startseite/i); // Passe den Text an, der auf der Startseite gerendert wird
  expect(linkElement).toBeInTheDocument();
});
