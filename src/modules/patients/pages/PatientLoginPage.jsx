import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import { frontendErrorMessage } from '../../auth/helpers/backendError';

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
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

      navigate('/appointments');
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Error al conectar con el servicio de pacientes');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-sky-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-blue-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-600 mb-3 shadow-inner">
            <span className="text-2xl font-bold">🩺</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Portal del Paciente
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Inicia sesión para solicitar y revisar tus turnos médicos
          </p>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-4">
          <Input
            label="Usuario o Correo Electrónico"
            placeholder="ejemplo@correo.com"
            {...register('username', {
              required: 'El usuario o correo es obligatorio',
            })}
            error={errors.username?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password', {
              required: 'La contraseña es obligatoria',
            })}
            error={errors.password?.message}
          />

          <div className="flex justify-end text-xs text-blue-600 hover:underline">
            <button
              type="button"
              className="bg-transparent border-none p-0 cursor-pointer text-blue-600 hover:underline"
              onClick={() =>
                alert('Contacte a secretaría para recuperar su clave')
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" className="w-full mt-2">
            Ingresar a mis Turnos
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() =>
              alert(
                'Para registrarse como nuevo paciente, acérquese por recepción o llame al centro médico'
              )
            }
          >
            Registrarse como Paciente
          </Button>

          <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5 text-center text-xs text-sky-800">
            <span className="font-semibold">Credenciales de prueba:</span>
            <br />
            Usuario: <code>paciente</code> | Clave: <code>paciente123</code>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
              {errorMessage}
            </div>
          )}
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <Link
            to="/admin/login"
            className="text-xs text-gray-500 hover:text-blue-700"
          >
            ¿Es personal administrativo o médico? Ingrese aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientLoginPage;
