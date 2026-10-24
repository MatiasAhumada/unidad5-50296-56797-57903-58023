import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';

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
    <div className="flex min-h-dvh bg-[#eef5f9] text-[15px] text-[#263d54]">
      <button
        className={`pointer-events-none fixed inset-0 z-10 bg-[rgba(2,26,46,.42)] opacity-0 transition-opacity duration-[250ms] md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : ''}`}
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
      <main className="ml-0 min-h-dvh w-full bg-[linear-gradient(135deg,#f8fcfe_0%,#edf6fb_100%)] md:ml-[236px] md:w-[calc(100%-236px)]">
        <div className="mx-auto max-w-[1220px] px-[18px] pt-[27px] pb-[45px] md:px-[25px] md:pt-8 md:pb-[52px] lg:px-[42px] lg:pt-12 lg:pb-[62px]">
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
