import { createContext, useState } from 'react';
import { login } from '../services/login';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';
import { STORAGE_KEYS, USER_ROLES } from '../../shared/constants/appConstants';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);

    return Boolean(token);
  });

  const singout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.role);
    setIsAuthenticated(false);
  };

  const setAuthSession = (session, defaultRole) => {
    localStorage.setItem(STORAGE_KEYS.token, session.token);
    localStorage.setItem(STORAGE_KEYS.role, session.role ?? defaultRole);
    setIsAuthenticated(true);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    setAuthSession(data, USER_ROLES.administrator);

    return { error: null };
  };

  const singinAdmin = async (username, password) => {
    const { data, error } = await loginAdmin(username, password);

    if (error) {
      return { error };
    }

    setAuthSession(data, USER_ROLES.administrator);

    return { error: null };
  };

  const singinPatient = async (username, password) => {
    const { data, error } = await loginPatient(username, password);

    if (error) {
      return { error };
    }

    setAuthSession(data, USER_ROLES.patient);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        singin,
        singinAdmin,
        singinPatient,
        singout,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
