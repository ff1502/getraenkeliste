// Optional: Importiere hier globale Mocks, Setups oder Konfigurationen
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Beispiel: mocke den localStorage
beforeAll(() => {
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });
  