import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm({ redirectPath, title }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

      const defaultRedirect = location.pathname.startsWith('/admin')
        ? '/admin/home'
        : '/appointments';

      navigate(redirectPath || defaultRedirect);
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

  const formTitle =
    title ||
    (location.pathname.startsWith('/admin')
      ? 'Acceso Administración'
      : 'Acceso Pacientes');

  return (
    <form
      className="
        flex
        flex-col
        gap-6
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      "
      onSubmit={handleSubmit(onValid)}
    >
      <h2 className="text-xl font-bold text-center text-gray-800">
        {formTitle}
      </h2>
      <Input
        label="Usuario"
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />
      <Input
        label="Contraseña"
        {...register('password', {
          required: 'Contraseña es obligatorio',
        })}
        type="password"
        error={errors.password?.message}
      />

      <Button type="submit">Iniciar Sesión</Button>
      <Button
        variant="secondary"
        onClick={() => alert('Debe impletar navegacion y pagina de registro')}
      >
        Registrar Usuario
      </Button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}

export default LoginForm;
