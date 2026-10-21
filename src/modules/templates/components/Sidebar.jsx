import { NavLink } from 'react-router-dom';
import Footer from './Footer';

function Sidebar({ isOpen, onClose, onLogout }) {
  const navClassName = ({ isActive }) =>
    `nav-link${isActive ? ' is-active' : ''}`;

  return (
    <aside
      id="admin-navigation"
      className={`sidebar${isOpen ? ' is-open' : ''}`}
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
          onClick={onClose}
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
        <a className="nav-link" href="/admin/home#doctores" onClick={onClose}>
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

        <p className="nav-label nav-label--secondary">Prácticas de la unidad</p>
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

      <Footer onLogout={onLogout} />
    </aside>
  );
}

export default Sidebar;
