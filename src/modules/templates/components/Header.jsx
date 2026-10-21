function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="dashboard-header">
      <button
        className="menu-toggle mobile-menu-trigger"
        type="button"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-controls="admin-navigation"
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span>Menú</span>
      </button>
    </header>
  );
}

export default Header;
