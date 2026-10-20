function Footer({ onLogout }) {
  return (
    <footer className="sidebar__bottom">
      <button
        className="nav-link nav-link--button"
        type="button"
        onClick={onLogout}
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
    </footer>
  );
}

export default Footer;
