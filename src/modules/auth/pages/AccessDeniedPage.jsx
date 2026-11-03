import { Link } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '../../shared/constants/appConstants';
import useAuth from '../hook/useAuth';

function AccessDeniedPage() {
  const { role } = useAuth();
  const homeRoute =
    role === USER_ROLES.administrator ? ROUTES.adminHome : ROUTES.home;

  return (
    <main className="flex min-h-screen items-center justify-center bg-med-bg px-4 py-8">
      <section
        aria-labelledby="access-denied-title"
        className="w-full max-w-md rounded-2xl border border-med-border bg-white p-6 text-center shadow-lg sm:p-10"
      >
        <h1
          id="access-denied-title"
          className="text-2xl font-bold text-med-primary-900"
        >
          Acceso denegado
        </h1>
        <p className="mt-3 text-sm text-med-text-sub">
          Tu sesión no tiene el rol necesario para ingresar a esta sección.
        </p>
        <Link
          to={homeRoute}
          className="mt-6 inline-flex rounded-lg bg-med-primary-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-med-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700"
        >
          Volver a mi portal
        </Link>
      </section>
    </main>
  );
}

export default AccessDeniedPage;
