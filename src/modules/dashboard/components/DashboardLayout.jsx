import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/appConstants';
import useAuth from '../../auth/hook/useAuth';

import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';
import IconButton from '../../shared/components/IconButton';

function DashboardLayout() {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate(ROUTES.adminLogin);
  };

  const navItems = [
    {
      to: ROUTES.adminHome,
      label: 'Panel',
      icon: <Icon icon={ICONS.grid} size={20} />,
    },
    {
      to: ROUTES.adminDoctors,
      label: 'Doctores',
      icon: <Icon icon={ICONS.doctor} size={20} />,
    },
    {
      to: ROUTES.adminSpecialties,
      label: 'Especialidades',
      icon: <Icon icon={ICONS.hospital} size={20} />,
    },
    {
      to: ROUTES.adminPatients,
      label: 'Búsqueda de Pacientes',
      icon: <Icon icon={ICONS.userSearch} size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-med-bg flex">
      {/* Sidebar fijo para desktop / retráctil en móvil */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-med-border flex flex-col justify-between transition-transform duration-200 sm:translate-x-0 ${
          openMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-med-border-subtle">
            <h2 className="text-base font-bold text-med-primary-900 leading-tight">
              Admin Portal
            </h2>
            <span className="text-xs font-medium text-med-text-muted">
              Healthcare Management
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpenMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-med-primary-50 text-med-primary-900 border-r-4 border-med-primary-900'
                      : 'text-med-text-sub hover:bg-gray-50 hover:text-med-primary-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Sidebar (Help, Logout & User profile) */}
        <div className="p-4 border-t border-med-border-subtle space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-med-text-sub hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Icon icon={ICONS.logout} size={16} />
            <span>Cerrar Sesión</span>
          </button>

          {/* User Profile Info */}
          <div className="pt-3 border-t border-med-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-med-primary-100 text-med-primary-900 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-med-text-main truncate">
                Admin User
              </p>
              <p className="text-[11px] text-med-text-muted truncate">
                Super Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop para móvil */}
      {openMobileMenu && (
        <div
          onClick={() => setOpenMobileMenu(false)}
          className="fixed inset-0 bg-slate-900/40 z-30 sm:hidden"
        />
      )}

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 sm:pl-64">
        {/* Topbar móvil */}
        <header className="sm:hidden bg-white border-b border-med-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-med-primary-900 text-white flex items-center justify-center font-bold text-xs">
              MC
            </div>
            <span className="font-bold text-sm text-med-primary-900">
              Medical Center
            </span>
          </div>
          <IconButton
            label={openMobileMenu ? 'Cerrar menú' : 'Abrir menú'}
            icon={ICONS.menu}
            size={20}
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
            className="p-1.5 rounded-lg border border-med-border text-med-text-sub"
          />
        </header>

        {/* Contenido de Rutas Hijas */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
