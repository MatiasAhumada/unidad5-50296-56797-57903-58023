import { NavLink } from 'react-router-dom';
import Footer from './Footer';

function Sidebar({ isOpen, onClose, onLogout }) {
  const navClassName = ({ isActive }) =>
    `flex min-h-[45px] w-full items-center gap-3 rounded-[4px] px-[13px] text-[13px] no-underline transition-colors hover:bg-[#f0f7fb] hover:text-[#052f5d] ${isActive ? 'bg-white text-[#079f9b] shadow-[0_2px_11px_rgba(22,59,86,.04)] before:mr-[-13px] before:h-[30px] before:w-[3px] before:self-center before:rounded-r-[3px] before:bg-[#11b8aa] before:content-[\"\"]' : 'text-[#4d6278]'}`;

  return (
    <aside
      id="admin-navigation"
      className={`fixed z-20 flex h-dvh w-[236px] flex-col border-r border-[#dbe7ef] bg-[rgba(252,254,255,.95)] shadow-[12px_0_30px_rgba(7,38,60,.12)] transition-transform duration-[250ms] md:translate-x-0 md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      aria-label="Navegación principal"
    >
      <div className="flex min-h-24 items-center gap-[11px] border-b border-[#e9f0f4] px-5 pt-6 pb-5">
        <div className="grid h-[30px] w-[30px] place-items-center rounded-md bg-[#052f5d] text-white" aria-hidden="true">
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 32 32">
            <path d="M16 3.5 26 7v7.6c0 6.15-4.03 11.58-10 13.4-5.97-1.82-10-7.25-10-13.4V7l10-3.5Z" />
            <path d="M16 9.8v8.7M11.65 14.15h8.7" />
          </svg>
        </div>
        <div>
          <p className="mb-[3px] mt-0 font-[Manrope,sans-serif] text-[17px] font-extrabold tracking-[-.03em] text-[#052f5d]">MedPortal</p>
          <span className="text-[10px] tracking-[.03em] text-[#7c8e9f]">Gestión de salud</span>
        </div>
        <button
          className="ml-auto block border-0 bg-transparent text-[26px] leading-none text-[#6d8191] md:hidden"
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <nav className="px-2.5 py-6">
        <p className="mx-[13px] mb-2.5 mt-0 text-[11px] font-bold tracking-[.11em] text-[#9aa8b4] uppercase">Administración</p>
        <NavLink to="/admin/home" className={navClassName}>
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </svg>
          <span>Panel</span>
        </NavLink>
        <a className="flex min-h-[45px] w-full items-center gap-3 rounded-[4px] px-[13px] text-[13px] text-[#4d6278] no-underline transition-colors hover:bg-[#f0f7fb] hover:text-[#052f5d]" href="/admin/home#doctores" onClick={onClose}>
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="7" width="14" height="13" rx="2" />
            <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7M12 11v5M9.5 13.5h5" />
          </svg>
          <span>Doctores</span>
        </a>
        <NavLink to="/admin/specialties" className={navClassName}>
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 4 3.1 5.2H8.9L12 4ZM6.8 13.2h4.8V18H6.8zM15.2 13.2H20V18h-4.8z" />
            <path d="M12 9.2v2.2" />
          </svg>
          <span>Especialidades</span>
        </NavLink>

        <p className="mx-[13px] mb-2.5 mt-0 text-[11px] font-bold tracking-[.11em] text-[#9aa8b4] uppercase mt-6">Prácticas de la unidad</p>
        <NavLink to="/admin/products" className={navClassName}>
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16l-1.5 13h-13L4 7Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          <span>Productos</span>
        </NavLink>
        <NavLink to="/admin/orders" className={navClassName}>
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
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
