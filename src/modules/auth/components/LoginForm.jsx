import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../core/components/molecules/InputField';
import useAuth from '../hooks/useAuth';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'password',
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { singin } = useAuth();

  const updateCredential = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setErrorMessage('');
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      username: credentials.username.trim() ? '' : 'Ingresá tu usuario.',
      password: credentials.password ? '' : 'Ingresá tu contraseña.',
    };
    setErrors(nextErrors);

    if (nextErrors.username || nextErrors.password) return;

    setErrorMessage('');
    const { error } = singin(credentials.username.trim(), credentials.password);

    if (error) {
      setErrorMessage(error.frontendErrorMessage);
      return;
    }

    navigate('/admin/home');
  };

  return (
    <form
      className="overflow-hidden rounded-[7px] border border-[rgba(206,222,234,.8)] bg-[#fdfefe] shadow-[0_16px_48px_rgba(0,15,32,.25)]"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="px-7 pt-8 pb-5 sm:px-9 sm:pt-9 sm:pb-6">
        <p className="mb-2 mt-0 text-sm font-bold text-[#164777]">
          Bienvenido de nuevo
        </p>
        <h1
          className="m-0 font-[Manrope,sans-serif] text-[clamp(28px,5vw,32px)] leading-[1.18] tracking-[-.035em] text-[#082f59]"
          id="login-title"
        >
          Ingresá a tu cuenta
        </h1>
        <p className="mt-3 mb-0 max-w-[360px] text-[15px] leading-[1.55] text-[#536579]">
          Autenticá tus datos para acceder al portal administrativo.
        </p>
      </div>

      <InputField
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="Ingrese ID de admin"
        label="Nombre de usuario"
        containerClassName="mt-5 px-7 first:mt-0 sm:px-9"
        labelClassName="mb-2 text-sm"
        inputClassName="h-[52px] rounded-lg pl-[42px] pr-11 text-base"
        value={credentials.username}
        onChange={updateCredential}
        error={errors.username}
        before={
          <span
            className="pointer-events-none absolute top-0 left-3 grid h-[52px] w-5 place-items-center text-[#718497]"
            aria-hidden="true"
          >
            <svg
              className="h-[18px] w-[18px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="3.25" />
              <path d="M5.5 19.2c.8-3.1 3.03-4.7 6.5-4.7s5.7 1.6 6.5 4.7" />
            </svg>
          </span>
        }
      />

      <InputField
        id="password"
        name="password"
        type={isPasswordVisible ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="••••••••"
        label="Contraseña"
        containerClassName="mt-5 px-7 first:mt-0 sm:px-9"
        labelClassName="mb-2 text-sm"
        inputClassName="h-[52px] rounded-lg pl-[42px] pr-12 text-base"
        value={credentials.password}
        onChange={updateCredential}
        error={errors.password}
        before={
          <span
            className="pointer-events-none absolute top-0 left-3 grid h-[52px] w-5 place-items-center text-[#718497]"
            aria-hidden="true"
          >
            <svg
              className="h-[18px] w-[18px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]"
              viewBox="0 0 24 24"
            >
              <rect x="6.7" y="10.3" width="10.6" height="8.2" rx="1.5" />
              <path d="M9 10.3V8a3 3 0 0 1 6 0v2.3" />
            </svg>
          </span>
        }
        after={
          <button
            className="absolute top-0 right-2 grid h-[52px] w-8 place-items-center border-0 bg-transparent p-0 text-[#718497] hover:text-[#0a4b7d] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,160,218,.35)]"
            type="button"
            aria-label={
              isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            <svg
              className={`${isPasswordVisible ? 'hidden' : 'block'} h-[17px] w-[17px] fill-none stroke-current [stroke-width:1.45]`}
              viewBox="0 0 24 24"
            >
              <path d="M2.8 12s3.1-5 9.2-5 9.2 5 9.2 5-3.1 5-9.2 5-9.2-5-9.2-5Z" />
              <circle cx="12" cy="12" r="2.1" />
            </svg>
            <svg
              className={`${isPasswordVisible ? 'block' : 'hidden'} h-[17px] w-[17px] fill-none stroke-current [stroke-width:1.45]`}
              viewBox="0 0 24 24"
            >
              <path d="m3.5 3.5 17 17M10.6 6.1c.45-.07.91-.1 1.4-.1 6.1 0 9.2 6 9.2 6a16 16 0 0 1-3.17 3.5M6.2 6.5C3.9 8.1 2.8 12 2.8 12s3.1 6 9.2 6c1.12 0 2.12-.2 3.02-.52" />
              <path d="M9.9 9.9a2.1 2.1 0 0 0 2.96 2.96" />
            </svg>
          </button>
        }
      />

      <button
        className="mx-7 mt-6 mb-5 flex min-h-[52px] w-[calc(100%-56px)] items-center justify-center gap-3 rounded-lg border-0 bg-[#043c6a] text-[15px] font-semibold text-white shadow-[0_4px_8px_rgba(2,38,69,.2)] transition hover:-translate-y-px hover:bg-[#075487] hover:shadow-[0_7px_16px_rgba(2,38,69,.25)] active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[rgba(31,160,218,.35)] sm:mx-9 sm:w-[calc(100%-72px)]"
        type="submit"
      >
        <span>Iniciar sesión</span>
        <svg
          className="h-[18px] w-[18px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M5 12h13M13.5 7.5 18 12l-4.5 4.5" />
        </svg>
      </button>
      <p
        className="mx-7 mt-[-7px] mb-5 min-h-0 text-center text-[13px] text-[#b4232d] sm:mx-9"
        role="status"
        aria-live="polite"
      >
        {errorMessage}
      </p>

      <div className="flex gap-3 bg-[#e6f5ff] px-7 pt-4 pb-5 text-[13px] leading-[1.55] text-[#284358] sm:px-9">
        <svg
          className="mt-px h-[18px] w-[18px] shrink-0 fill-none stroke-[#0a6b9f] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.5]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3.5 19 6v5.3c0 4.3-2.82 8.1-7 9.2-4.18-1.1-7-4.9-7-9.2V6l7-2.5Z" />
          <path d="m9.5 12 1.7 1.7 3.5-3.5" />
        </svg>
        <p>
          <strong>Acceso seguro:</strong> Sistema exclusivo para personal médico
          autorizado.
        </p>
      </div>
    </form>
  );
}

export default LoginForm;
