import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthEmailField from '../components/AuthEmailField';
import AuthPasswordField from '../components/AuthPasswordField';
import useAuth from '../hook/useAuth';
import Button from '../../shared/components/Button';
import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  showError,
  showSuccess,
  showWarning,
} from '../../shared/notifications/notifications';

function AdminLoginPage() {
  const isSubmittingRef = useRef(false);
  const sessionNotificationShownRef = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const navigate = useNavigate();
  const { signInAdmin, sessionExpired } = useAuth();
  const expiredQuery = searchParams.get('session') === 'expired';

  useEffect(() => {
    if (
      (sessionExpired || expiredQuery) &&
      !sessionNotificationShownRef.current
    ) {
      sessionNotificationShownRef.current = true;
      showWarning('Tu sesión venció. Iniciá sesión nuevamente.');
    }

    if (expiredQuery) {
      setSearchParams(
        (currentParams) => {
          currentParams.delete('session');

          return currentParams;
        },
        { replace: true }
      );
    }
  }, [expiredQuery, sessionExpired, setSearchParams]);

  const onValid = async ({ email, password }) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    const { error } = await signInAdmin(email, password);

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Sesión de administrador iniciada.');
      navigate(ROUTES.adminHome, { replace: true });
    }

    isSubmittingRef.current = false;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-med-primary-950 px-4 py-8">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Icon icon={ICONS.shieldCheck} size={32} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </div>

      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-med-primary-900">
              Bienvenido de nuevo
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-med-text-sub">
              Autenticáte para acceder al portal de proveedores.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onValid)}
            noValidate
            className="flex flex-col gap-4"
          >
            <AuthEmailField
              id="admin-login-email"
              register={register}
              error={errors.email?.message}
              disabled={isSubmitting}
            />
            <AuthPasswordField
              id="admin-login-password"
              register={register}
              error={errors.password?.message}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2"
            >
              {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </Button>
          </form>
        </div>

        <div className="flex items-start gap-3 border-t border-med-primary-100 bg-med-primary-50 p-4 sm:p-5">
          <Icon icon={ICONS.shieldCheck} size={20} />
          <p className="text-xs leading-relaxed text-med-text-sub">
            <strong className="font-semibold text-med-text-main">
              Solo acceso seguro:
            </strong>{' '}
            este sistema es para personal médico autorizado. Los intentos de
            acceso no autorizados son registrados y monitoreados.
          </p>
        </div>
      </section>

      <div className="mt-6 text-center">
        <Link
          to={ROUTES.patientLogin}
          className="text-xs text-med-primary-200 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          ← Volver al Portal de Pacientes
        </Link>
      </div>
    </main>
  );
}

export default AdminLoginPage;
