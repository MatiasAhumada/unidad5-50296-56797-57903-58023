import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { ROUTES, STORAGE_KEYS, USER_ROLES } from '../constants/appConstants';
import { clearStoredSession } from '../../auth/helpers/session';

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

      sessionStorage.setItem('medportal.sessionExpired', 'true');
      clearStoredSession();

      if (window.location.pathname !== loginRoute) {
        window.location.assign(`${loginRoute}?session=expired`);
      }
    }

    return Promise.reject(error);
  }
);

export { instance };
