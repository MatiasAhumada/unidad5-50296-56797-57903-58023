import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import FormField from '../../shared/components/FormField';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';
import { ROUTES } from '../../shared/constants/appConstants';

function LoginForm({ redirectPath, title }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const location = useLocation();

  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }

      const defaultRedirect = location.pathname.startsWith(ROUTES.admin)
        ? ROUTES.adminHome
        : ROUTES.patientAppointments;

      navigate(redirectPath || defaultRedirect);
    } catch (error) {
      setErrorMessage(frontendErrorMessage(error));
    }
  };

  const formTitle =
    title ||
    (location.pathname.startsWith(ROUTES.admin)
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
      noValidate
    >
      <h2 className="text-xl font-bold text-center text-gray-800">
        {formTitle}
      </h2>
      <FormField
        id="login-form-username"
        label="Usuario"
        error={errors.username?.message}
        required
      >
        {(fieldProps) => (
          <Input
            type="text"
            error={errors.username?.message}
            {...register('username', { required: 'Usuario es obligatorio' })}
            {...fieldProps}
          />
        )}
      </FormField>
      <FormField
        id="login-form-password"
        label="Contraseña"
        error={errors.password?.message}
        required
      >
        {(fieldProps) => (
          <Input
            type="password"
            error={errors.password?.message}
            {...register('password', { required: 'Contraseña es obligatorio' })}
            {...fieldProps}
          />
        )}
      </FormField>

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
