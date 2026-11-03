const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();

const backendOrigin = configuredBackendUrl
  ? configuredBackendUrl.replace(/\/+$/, '').replace(/\/api$/i, '')
  : '';

const API_BASE_URL = `${backendOrigin}/api`;

export { API_BASE_URL };
