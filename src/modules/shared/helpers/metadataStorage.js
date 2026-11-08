/**
 * Helper genérico para almacenamiento de metadatos en localStorage
 * con tolerancia a errores de JSON y entornos sin almacenamiento.
 */
export function createMetadataStore(storageKey) {
  function getAll() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function get(key) {
    if (!key) return null;
    const store = getAll();
    return store[key] || store[key.toString().trim().toLowerCase()] || null;
  }

  function set(keys, value) {
    try {
      const store = getAll();
      const keyList = Array.isArray(keys) ? keys : [keys];

      if (value === null || value === undefined) {
        for (const k of keyList) {
          if (k) {
            delete store[k];
            delete store[k.toString().trim().toLowerCase()];
          }
        }
      } else {
        for (const k of keyList) {
          if (k) {
            store[k] = value;
            store[k.toString().trim().toLowerCase()] = value;
          }
        }
      }

      localStorage.setItem(storageKey, JSON.stringify(store));
    } catch (err) {
      console.warn(`Error guardando en ${storageKey}:`, err);
    }
  }

  return { getAll, get, set };
}
