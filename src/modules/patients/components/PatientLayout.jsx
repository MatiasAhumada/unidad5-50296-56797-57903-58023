import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Icon from '../../shared/components/Icon';
import IconButton from '../../shared/components/IconButton';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import { showSuccess } from '../../shared/notifications/notifications';
import { PATIENT_NAVIGATION } from '../constants/navigation';

function PatientLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    showSuccess('Sesión de paciente cerrada.');
    navigate(ROUTES.patientLogin);
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
      isActive
        ? 'bg-med-primary-900 text-white'
        : 'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-med-bg">
      <header className="sticky top-0 z-30 border-b border-med-border bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6 sm:gap-8">
            <NavLink to={ROUTES.home} className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-med-primary-900 text-xs font-bold text-white shadow-xs">
                <Icon icon={ICONS.doctor} size={16} />
              </span>
              <span className="text-lg font-bold tracking-tight text-med-primary-900">
                Portal Salud
              </span>
            </NavLink>

            <nav
              aria-label="Navegación del paciente"
              className="hidden items-center gap-2 md:flex"
            >
              {PATIENT_NAVIGATION.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={navLinkClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-med-text-sub sm:inline">
              Sesión de paciente
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-lg border border-med-border px-2.5 py-1.5 text-xs font-semibold text-med-text-sub transition hover:bg-red-50/40 hover:text-red-600 sm:inline-flex"
            >
              Cerrar sesión
            </button>
            <IconButton
              type="button"
              label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              icon={ICONS.menu}
              size={20}
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              className="rounded-lg border border-med-border p-1.5 text-med-text-sub md:hidden"
            />
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            aria-label="Navegación del paciente"
            className="space-y-2 border-t border-med-border bg-white px-4 py-3 md:hidden"
          >
            {PATIENT_NAVIGATION.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-med-primary-900 text-white'
                      : 'text-med-text-sub hover:bg-med-primary-50'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full border-t border-med-border-subtle pt-3 text-left text-xs font-bold text-red-600"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
