import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthEmailField from '../../auth/components/AuthEmailField';
import useAuth from '../../auth/hook/useAuth';
import { AUTH_VALIDATION } from '../../auth/constants/validation';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import Input from '../../shared/components/Input';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  showError,
  showSuccess,
  showWarning,
} from '../../shared/notifications/notifications';

function PatientLoginPage() {
  const isSubmittingRef = useRef(false);
  const sessionNotificationShownRef = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', dni: '' } });

  const navigate = useNavigate();
  const { signInPatient, sessionExpired } = useAuth();
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

  const onValid = async ({ email, dni }) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    const { error } = await signInPatient(email, dni);

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Sesión de paciente iniciada.');
      navigate(ROUTES.home, { replace: true });
    }

    isSubmittingRef.current = false;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Icon icon={ICONS.shieldCheck} size={32} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </div>

      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Portal del Paciente
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-med-text-sub">
            Iniciá sesión para reservar y consultar tus turnos médicos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="flex flex-col gap-4"
        >
          <AuthEmailField
            id="patient-login-email"
            register={register}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          <FormField
            id="patient-login-dni"
            label="DNI"
            error={errors.dni?.message}
            hint="Ingresá tu documento sin puntos."
            required
          >
            {(fieldProps) => (
              <div className="relative">
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted"
                  aria-hidden="true"
                >
                  <Icon icon={ICONS.userSearch} size={16} />
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  disabled={isSubmitting}
                  className="py-2.5 pl-10 pr-3.5 text-sm"
                  {...register('dni', {
                    required: 'El DNI es obligatorio',
                    pattern: AUTH_VALIDATION.dniPattern,
                  })}
                  {...fieldProps}
                />
              </div>
            )}
          </FormField>

          <Button type="submit" disabled={isSubmitting} className="mt-1 w-full">
            {isSubmitting ? 'Ingresando…' : 'Ingresar Paciente'}
          </Button>
        </form>
      </section>

      <div className="mt-6 text-center">
        <Link
          to={ROUTES.adminLogin}
          className="text-xs text-med-primary-200 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          ¿Es personal administrativo o médico? Ingresá aquí →
        </Link>
      </div>
    </main>
  );
}

export default PatientLoginPage;
