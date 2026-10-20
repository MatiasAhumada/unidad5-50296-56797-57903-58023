import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import '../styles/admin.css';

function AdminLayout() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { singout } = useAuth();

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  const logout = () => {
    singout();
    navigate('/login');
  };

  const navClassName = ({ isActive }) =>
    `nav-link${isActive ? ' is-active' : ''}`;

  return (
    <div className="app-shell">
      <button
        className={`mobile-scrim${openMenu ? ' is-visible' : ''}`}
        type="button"
        aria-label="Cerrar menú"
        aria-hidden={!openMenu}
        tabIndex={openMenu ? 0 : -1}
        onClick={() => setOpenMenu(false)}
      />
      <aside
        id="admin-navigation"
        className={`sidebar${openMenu ? ' is-open' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M16 3.5 26 7v7.6c0 6.15-4.03 11.58-10 13.4-5.97-1.82-10-7.25-10-13.4V7l10-3.5Z" />
              <path d="M16 9.8v8.7M11.65 14.15h8.7" />
            </svg>
          </div>
          <div>
            <p>MedPortal</p>
            <span>Gestión de salud</span>
          </div>
          <button
            className="sidebar-close"
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpenMenu(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar__nav">
          <p className="nav-label">Administración</p>
          <NavLink to="/admin/home" className={navClassName}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
            <span>Panel</span>
          </NavLink>
          <a
            className="nav-link"
            href="/admin/home#doctores"
            onClick={() => setOpenMenu(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="7" width="14" height="13" rx="2" />
              <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7M12 11v5M9.5 13.5h5" />
            </svg>
            <span>Doctores</span>
          </a>
          <NavLink to="/admin/specialties" className={navClassName}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 4 3.1 5.2H8.9L12 4ZM6.8 13.2h4.8V18H6.8zM15.2 13.2H20V18h-4.8z" />
              <path d="M12 9.2v2.2" />
            </svg>
            <span>Especialidades</span>
          </NavLink>

          <p className="nav-label nav-label--secondary">
            Prácticas de la unidad
          </p>
          <NavLink to="/admin/products" className={navClassName}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16l-1.5 13h-13L4 7Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span>Productos</span>
          </NavLink>
          <NavLink to="/admin/orders" className={navClassName}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
            </svg>
            <span>Órdenes</span>
          </NavLink>
        </nav>

        <div className="sidebar__bottom">
          <button
            className="nav-link nav-link--button"
            type="button"
            onClick={logout}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14 8l4 4-4 4M9 12h9" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
          <div className="profile">
            <div className="profile__avatar" aria-hidden="true">
              MS
            </div>
            <div>
              <strong>María Solís</strong>
              <span>Administradora</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-wrap">
          <button
            className="menu-toggle mobile-menu-trigger"
            type="button"
            aria-label={openMenu ? 'Cerrar menú' : 'Abrir menú'}
            aria-controls="admin-navigation"
            aria-expanded={openMenu}
            onClick={() => setOpenMenu((isOpen) => !isOpen)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span>Menú</span>
          </button>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
