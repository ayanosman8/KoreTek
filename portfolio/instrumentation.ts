// This file runs before EVERYTHING in Next.js
// Perfect place for localStorage polyfill

export async function register() {
  if (typeof window === 'undefined') {
    // Server-side: Mock localStorage completely
    const storage = new Map<string, string>();

    global.localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() { return storage.size; },
      key: (index: number) => Array.from(storage.keys())[index] ?? null,
    } as Storage;

    console.log('[instrumentation] localStorage polyfill installed');
  }
}
