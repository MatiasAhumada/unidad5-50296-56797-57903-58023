import { STORAGE_KEYS, USER_ROLES } from '../../shared/constants/appConstants';

const PATIENT_DNI_SESSION_KEY = 'medportal.patientDni';
const SESSION_EXPIRED_KEY = 'medportal.sessionExpired';

function normalizeRole(role) {
  if (typeof role !== 'string') {
    return null;
  }

  return (
    Object.values(USER_ROLES).find(
      (supportedRole) => supportedRole.toLowerCase() === role.toLowerCase()
    ) ?? null
  );
}

function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.role);
  sessionStorage.removeItem(PATIENT_DNI_SESSION_KEY);
}

function getStoredSession() {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const role = normalizeRole(localStorage.getItem(STORAGE_KEYS.role));

  if (!token || !role) {
    clearStoredSession();

    return null;
  }

  const patientDni =
    role === USER_ROLES.patient
      ? sessionStorage.getItem(PATIENT_DNI_SESSION_KEY)
      : null;

  return { token, role, patientDni };
}

function createSession(response, patientDni = null) {
  const token = response?.token;
  const role = normalizeRole(response?.role);

  if (typeof token !== 'string' || !token || !role) {
    throw new Error('El servidor no devolvió una sesión válida.');
  }

  return { token, role, patientDni };
}

function storeSession(response, patientDni = null) {
  const nextSession = createSession(response, patientDni);

  localStorage.setItem(STORAGE_KEYS.token, nextSession.token);
  localStorage.setItem(STORAGE_KEYS.role, nextSession.role);

  if (nextSession.patientDni) {
    sessionStorage.setItem(
      PATIENT_DNI_SESSION_KEY,
      String(nextSession.patientDni)
    );
  } else {
    sessionStorage.removeItem(PATIENT_DNI_SESSION_KEY);
  }

  return nextSession;
}

function consumeSessionExpired() {
  const expired = sessionStorage.getItem(SESSION_EXPIRED_KEY) === 'true';

  if (expired) {
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
  }

  return expired;
}

export {
  clearStoredSession,
  getStoredSession,
  storeSession,
  consumeSessionExpired,
};
