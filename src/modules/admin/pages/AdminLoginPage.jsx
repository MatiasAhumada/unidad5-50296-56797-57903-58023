import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import { frontendErrorMessage } from '../../auth/helpers/backendError';

function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singinAdmin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singinAdmin(formData.username, formData.password);

      if (error) {
        setErrorMessage(
          error.frontendErrorMessage || 'Credenciales administrativas inválidas'
        );

        return;
      }

      navigate('/admin/home');
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Error al conectar con el servicio administrativo');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 sm:p-10 text-white">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/80 border border-slate-600 text-xs text-amber-400 font-semibold mb-3">
            <span>🛡️</span> Acceso Restringido
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Centro Médico
          </h1>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mt-1">
            Panel de Administración
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Control de consultorios, médicos y agenda general de turnos
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col gap-4 text-slate-800"
        >
          <Input
            label="Usuario Administrador"
            placeholder="admin.usuario"
            {...register('username', {
              required: 'Usuario administrador es requerido',
            })}
            error={errors.username?.message}
          />

          <Input
            label="Clave de Seguridad"
            type="password"
            placeholder="••••••••"
            {...register('password', {
              required: 'La contraseña es obligatoria',
            })}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
          >
            Acceder al Sistema
          </Button>

          <div className="bg-slate-700/60 border border-slate-600 rounded-lg p-2.5 text-center text-xs text-slate-300">
            <span className="font-semibold text-amber-300">
              Credenciales de prueba:
            </span>
            <br />
            Usuario: <code>admin</code> | Clave: <code>admin123</code>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-xs text-red-200 text-center">
              {errorMessage}
            </div>
          )}
        </form>

        <div className="mt-8 pt-4 border-t border-slate-700/70 text-center">
          <Link
            to="/login"
            className="text-xs text-slate-400 hover:text-indigo-300 transition"
          >
            ← Volver al Portal de Pacientes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
