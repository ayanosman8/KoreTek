// Polyfill localStorage for SSR
// This prevents "localStorage.getItem is not a function" errors during server-side rendering
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { LocalStorage } = require('node-localstorage');
  global.localStorage = new LocalStorage('./tmp/localStorage');
}

export {};
