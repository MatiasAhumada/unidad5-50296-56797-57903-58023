import { createContext, useEffect, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';
import {
  clearStoredSession,
  createSession,
  getStoredSession,
} from '../helpers/session';
import { STORAGE_KEYS } from '../../shared/constants/appConstants';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);
  const [sessionExpired, setSessionExpired] = useState(() => {
    const expired =
      sessionStorage.getItem('medportal.sessionExpired') === 'true';

    sessionStorage.removeItem('medportal.sessionExpired');

    return expired;
  });

  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const timeout = window.setTimeout(
      () => {
        clearStoredSession();
        setSession(null);
        setSessionExpired(true);
      },
      Math.max(session.expiresAt - Date.now(), 0)
    );

    return () => window.clearTimeout(timeout);
  }, [session]);

  const signOut = () => {
    clearStoredSession();
    setSession(null);
    setSessionExpired(false);
  };

  const saveSession = (response) => {
    const nextSession = createSession(response);

    localStorage.setItem(STORAGE_KEYS.token, nextSession.token);
    localStorage.setItem(STORAGE_KEYS.role, nextSession.role);
    setSession(nextSession);
    setSessionExpired(false);

    return nextSession;
  };

  const signInAdmin = async (email, password) => {
    const { data } = await loginAdmin(email, password);

    return saveSession(data);
  };

  const signInPatient = async (email, dni) => {
    const { data } = await loginPatient(email, dni);

    return saveSession(data);
  };

  const value = {
    isAuthenticated: Boolean(session),
    role: session?.role ?? null,
    sessionExpired,
    signInAdmin,
    signInPatient,
    signOut,
    sessionExpiresAt: session?.expiresAt ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
