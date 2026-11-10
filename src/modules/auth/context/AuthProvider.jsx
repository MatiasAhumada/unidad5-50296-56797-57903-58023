import { createContext, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';
import {
  clearStoredSession,
  getStoredSession,
  consumeSessionExpired,
  storeSession,
} from '../helpers/session';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);
  const [sessionExpired, setSessionExpired] = useState(() => consumeSessionExpired());
  

  const signOut = () => {
    clearStoredSession();
    setSession(null);
    setSessionExpired(false);
  };

  const saveSession = (response, patientDni = null) => {
    const nextSession = storeSession(response, patientDni);

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

    return saveSession(data, String(dni));
  };

  const value = {
    isAuthenticated: Boolean(session),
    role: session?.role ?? null,
    patientDni: session?.patientDni ?? null,
    sessionExpired,
    signInAdmin,
    signInPatient,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
