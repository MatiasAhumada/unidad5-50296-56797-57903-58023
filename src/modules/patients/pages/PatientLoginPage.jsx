import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import IconButton from '../../shared/components/IconButton';
import useAuth from '../../auth/hook/useAuth';
import { frontendErrorMessage } from '../../auth/helpers/backendError';

import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singinPatient } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singinPatient(
        formData.username,
        formData.password
      );

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Credenciales inválidas');

        return;
      }

      navigate('/');
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Error al conectar con el servicio de pacientes');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8 sm:p-6">
      {/* Brand Header idéntico a admin-login */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <Icon icon={ICONS.shieldCheck} size={32} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-med-primary-900">
            Portal del Paciente
          </h2>
          <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
            Inicia sesión para reservar y consultar tus turnos médicos
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Correo Electrónico */}
          <FormField
            id="login-email"
            label="Correo Electrónico"
            error={errors.username?.message}
            required
          >
            {(fieldProps) => (
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted"
                  aria-hidden="true"
                >
                  <Icon icon={ICONS.mail} size={16} />
                </span>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="paciente@medportal.com"
                  className="pl-10 pr-3.5 py-2.5 text-sm"
                  error={errors.username?.message}
                  {...register('username', {
                    required: 'El correo electrónico es obligatorio',
                  })}
                  {...fieldProps}
                />
              </div>
            )}
          </FormField>

          {/* Contraseña con botón mostrar/ocultar */}
          <FormField
            id="login-password"
            label="Contraseña"
            error={errors.password?.message}
            required
          >
            {(fieldProps) => (
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-med-text-muted"
                  aria-hidden="true"
                >
                  <Icon icon={ICONS.lock} size={16} />
                </span>
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 py-2.5 text-sm"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                  })}
                  {...fieldProps}
                />
                <IconButton
                  type="button"
                  icon={showPassword ? ICONS.eyeOff : ICONS.eye}
                  label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  size={16}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 text-med-text-muted hover:text-med-text-main"
                />
              </div>
            )}
          </FormField>

          <Button type="submit" className="w-full mt-1">
            Ingresar Paciente
          </Button>

          <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-lg p-2.5 text-center text-xs text-med-primary-900">
            <span className="font-semibold">Credenciales de prueba:</span>
            <br />
            Email: <code>paciente@medportal.com</code> | Clave:{' '}
            <code>paciente123</code>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center">
              {errorMessage}
            </div>
          )}
        </form>
      </div>

      {/* Switch to Admin Portal */}
      <div className="mt-6 text-center">
        <Link
          to="/admin/login"
          className="text-xs text-med-primary-200 hover:text-white transition"
        >
          ¿Es personal administrativo o médico? Ingrese aquí →
        </Link>
      </div>
    </div>
  );
}

export default PatientLoginPage;
