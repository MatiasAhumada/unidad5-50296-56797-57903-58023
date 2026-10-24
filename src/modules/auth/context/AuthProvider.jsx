import { createContext, useState } from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const singout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const singin = (username, password) => {
    if (username !== 'admin' || password !== 'password') {
      return {
        error: {
          frontendErrorMessage: 'El usuario o la contraseña no son correctos.',
        },
      };
    }

    localStorage.setItem('token', 'mock-admin-session');
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        singin,
        singout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
