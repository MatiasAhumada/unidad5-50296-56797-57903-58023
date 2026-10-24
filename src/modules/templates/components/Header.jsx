function Header({ menuOpen, onMenuToggle }) {
  return (
    <header className="block md:contents">
      <button
        className="mb-[22px] mt-[-9px] -ml-[7px] flex items-center gap-2 border-0 bg-transparent p-[6px] text-[#052f5d] md:hidden"
        type="button"
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-controls="admin-navigation"
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        <svg className="h-[23px] w-[23px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span className="text-[13px] font-bold">Menú</span>
      </button>
    </header>
  );
}

export default Header;
