import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/dashboard.css';

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { singout } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const logout = () => {
    singout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <button
        className={`mobile-scrim${menuOpen ? ' is-visible' : ''}`}
        type="button"
        aria-label="Cerrar menú"
        aria-hidden={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={logout}
      />
      <main className="main-content">
        <div className="content-wrap">
          <Header
            menuOpen={menuOpen}
            onMenuToggle={() => setMenuOpen((isOpen) => !isOpen)}
          />
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
