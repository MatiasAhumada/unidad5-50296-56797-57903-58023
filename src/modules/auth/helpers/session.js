import { STORAGE_KEYS, USER_ROLES } from '../../shared/constants/appConstants';

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const PATIENT_DNI_SESSION_KEY = 'medportal.patientDni';

function getTokenPayload(token) {
  try {
    const encodedPayload = token.split('.')[1];
    const normalizedPayload = encodedPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const payload = atob(
      normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=')
    );

    return JSON.parse(payload);
  } catch {
    return null;
  }
}

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

function getSessionRole(token) {
  const payload = getTokenPayload(token);

  return normalizeRole(payload?.role ?? payload?.[ROLE_CLAIM]);
}

function getSessionExpiration(token) {
  const expiration = getTokenPayload(token)?.exp;

  return Number.isFinite(expiration) ? expiration * 1000 : null;
}

function isSupportedRole(role) {
  return Object.values(USER_ROLES).includes(role);
}

function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.role);
  sessionStorage.removeItem(PATIENT_DNI_SESSION_KEY);
}

function getStoredSession() {
  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (!token) {
    return null;
  }

  const role =
    getSessionRole(token) ??
    normalizeRole(localStorage.getItem(STORAGE_KEYS.role));
  const expiresAt = getSessionExpiration(token);

  if (expiresAt && expiresAt <= Date.now()) {
    sessionStorage.setItem('medportal.sessionExpired', 'true');
    clearStoredSession();

    return null;
  }

  if (!isSupportedRole(role) || !expiresAt) {
    clearStoredSession();

    return null;
  }

  localStorage.setItem(STORAGE_KEYS.role, role);

  const patientDni =
    role === USER_ROLES.patient
      ? sessionStorage.getItem(PATIENT_DNI_SESSION_KEY)
      : null;

  return { token, role, expiresAt, patientDni };
}

function createSession(response, patientDni = null) {
  const token = response?.token;
  const tokenRole = typeof token === 'string' ? getSessionRole(token) : null;
  const responseRole = normalizeRole(response?.role);
  const role = response?.role == null ? tokenRole : responseRole;
  const expiresAt =
    typeof token === 'string' ? getSessionExpiration(token) : null;

  if (
    typeof token !== 'string' ||
    !token ||
    (response?.role != null && !responseRole) ||
    !isSupportedRole(role) ||
    (tokenRole && tokenRole !== role) ||
    !expiresAt ||
    expiresAt <= Date.now()
  ) {
    throw new Error('El servidor no devolvió una sesión válida.');
  }

  return { token, role, expiresAt, patientDni };
}

export {
  clearStoredSession,
  createSession,
  getSessionExpiration,
  getSessionRole,
  getStoredSession,
  PATIENT_DNI_SESSION_KEY,
};
