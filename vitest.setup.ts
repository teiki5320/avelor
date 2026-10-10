import '@testing-library/jest-dom/vitest';

// Node 25+ expose son propre `localStorage` (vide sans --localstorage-file),
// qui masque celui de jsdom : on remet celui de jsdom dans les tests de composants.
const jsdomGlobal = (globalThis as { jsdom?: { window: Window } }).jsdom;
if (jsdomGlobal && !globalThis.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: jsdomGlobal.window.localStorage,
    configurable: true,
  });
}
