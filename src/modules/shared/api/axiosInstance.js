import axios from 'axios';
import { normalizeApiError } from './apiError';
import { API_BASE_URL } from '../config/apiConfig';
import { ROUTES, STORAGE_KEYS, USER_ROLES } from '../constants/appConstants';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = config.skipAuthRedirect
      ? null
      : localStorage.getItem(STORAGE_KEYS.token);

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestIsPublic = error.config?.skipAuthRedirect;
    const token = localStorage.getItem(STORAGE_KEYS.token);

    if (error.response?.status === 401 && token && !requestIsPublic) {
      const role = localStorage.getItem(STORAGE_KEYS.role);
      const loginRoute =
        role === USER_ROLES.administrator
          ? ROUTES.adminLogin
          : ROUTES.patientLogin;

      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.role);

      if (window.location.pathname !== loginRoute) {
        window.location.assign(loginRoute);
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export { instance };
