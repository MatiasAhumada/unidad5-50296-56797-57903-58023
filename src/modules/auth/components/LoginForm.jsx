import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../shared/components/molecules/InputField';
import useAuth from '../hooks/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { singin } = useAuth();

  const updateCredential = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setErrorMessage('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      username: credentials.username.trim() ? '' : 'Ingresá tu usuario.',
      password: credentials.password ? '' : 'Ingresá tu contraseña.',
    };
    setErrors(nextErrors);

    if (nextErrors.username || nextErrors.password) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const { error } = await singin(
        credentials.username.trim(),
        credentials.password
      );
      if (error) {
        setErrorMessage(
          error.frontendErrorMessage ||
            'El usuario o la contraseña no son correctos.'
        );
        return;
      }

      console.info('El formulario de acceso se validó correctamente.');
      navigate('/admin/home');
    } catch (error) {
      const code = error?.response?.data?.code;
      setErrorMessage(
        frontendErrorMessage[code] ||
          'No se pudo iniciar sesión. Intentá nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="login-card" onSubmit={onSubmit} noValidate>
      <div className="login-card__intro">
        <p className="eyebrow">Bienvenido de nuevo</p>
        <h1 id="login-title">Ingresá a tu cuenta</h1>
        <p>Autenticá tus datos para acceder al portal administrativo.</p>
      </div>

      <InputField
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="Ingrese ID de admin"
        label="Nombre de usuario"
        containerClassName="field-group"
        value={credentials.username}
        onChange={updateCredential}
        error={errors.username}
        before={
          <span className="input-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
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
        containerClassName="field-group"
        value={credentials.password}
        onChange={updateCredential}
        error={errors.password}
        before={
          <span className="input-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="6.7" y="10.3" width="10.6" height="8.2" rx="1.5" />
              <path d="M9 10.3V8a3 3 0 0 1 6 0v2.3" />
            </svg>
          </span>
        }
        after={
          <button
            className={`password-toggle ${isPasswordVisible ? 'is-visible' : ''}`}
            type="button"
            aria-label={
              isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            <svg className="eye-icon eye-icon--show" viewBox="0 0 24 24">
              <path d="M2.8 12s3.1-5 9.2-5 9.2 5 9.2 5-3.1 5-9.2 5-9.2-5-9.2-5Z" />
              <circle cx="12" cy="12" r="2.1" />
            </svg>
            <svg className="eye-icon eye-icon--hide" viewBox="0 0 24 24">
              <path d="m3.5 3.5 17 17M10.6 6.1c.45-.07.91-.1 1.4-.1 6.1 0 9.2 6 9.2 6a16 16 0 0 1-3.17 3.5M6.2 6.5C3.9 8.1 2.8 12 2.8 12s3.1 6 9.2 6c1.12 0 2.12-.2 3.02-.52" />
              <path d="M9.9 9.9a2.1 2.1 0 0 0 2.96 2.96" />
            </svg>
          </button>
        }
      />

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        <span>{isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13.5 7.5 18 12l-4.5 4.5" />
        </svg>
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {errorMessage}
      </p>

      <div className="security-note">
        <svg viewBox="0 0 24 24" aria-hidden="true">
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
