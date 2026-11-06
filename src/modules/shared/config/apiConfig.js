const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

// Solo el origen (sin /api al final), para que las rutas de servicio que
// ya incluyen /api/... no generen duplicación /api/api/...
const API_BASE_URL = configuredBackendUrl
  ? configuredBackendUrl.replace(/\/+$/, '').replace(/\/api$/i, '')
  : '';

export { API_BASE_URL };
