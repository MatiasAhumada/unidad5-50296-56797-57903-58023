function Footer({ onLogout }) {
  return (
    <footer className="mt-auto border-t border-[#e6eef3] px-2.5 pt-[14px] pb-[17px]">
      <button
        className="flex min-h-[45px] w-full items-center gap-3 rounded-[4px] px-[13px] text-[13px] text-[#4d6278] no-underline transition-colors hover:bg-[#f0f7fb] hover:text-[#052f5d] border-0 bg-transparent text-left"
        type="button"
        onClick={onLogout}
      >
        <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14 8l4 4-4 4M9 12h9" />
        </svg>
        <span>Cerrar sesión</span>
      </button>
      <div className="mt-3 flex items-center gap-[9px] px-[7px] pt-2">
        <div className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-full border-2 border-[#c7e8f0] bg-[linear-gradient(145deg,#246a87,#df9b79)] text-[9px] font-bold text-white" aria-hidden="true">
          MS
        </div>
        <div>
          <strong className="block max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#263f57]">María Solís</strong>
          <span className="mt-[3px] block max-w-[130px] overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#8292a1]">Administradora</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
