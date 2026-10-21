import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function PatientLayout() {
  const navigate = useNavigate();
  const { singout } = useAuth();

  const handleLogout = () => {
    singout();
    navigate('/login');
  };

  const getNavLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-blue-700">
              Centro Médico
            </span>
            <nav className="flex gap-2">
              <NavLink to="/" end className={getNavLinkClass}>
                Inicio
              </NavLink>
              <NavLink to="/appointments" className={getNavLinkClass}>
                Mis Turnos
              </NavLink>
            </nav>
          </div>
          <div>
            <Button variant="secondary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
