import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';
import {
  createSpecialty,
  getSpecialties,
  updateSpecialty,
} from '../services/specialtiesService';
import { getSpecialtyIcon } from '../constants/specialtyIcons';

function SpecialtyFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const specialtyId = searchParams.get('specialtyId');
  const isEdit = Boolean(specialtyId);

  const initialSpecialty = location.state?.specialty;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialSpecialty?.name || '',
      description: initialSpecialty?.description || '',
    },
  });

  const isSubmittingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Si se está editando y no vinieron los datos por state, cargarlos por ID
  useEffect(() => {
    if (!isEdit || location.state?.specialty) return;

    const controller = new AbortController();

    setIsLoading(true);
    setApiError('');

    getSpecialties(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setApiError(error.message);

          return;
        }

        const found = data?.find((s) => String(s.id) === String(specialtyId));

        if (found) {
          reset({
            name: found.name || '',
            description: found.description || '',
          });
        } else {
          setApiError('No se encontró la especialidad especificada.');
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setApiError(err.message || 'Error al cargar la especialidad');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isEdit, location.state, reset, specialtyId]);

  const onValid = async (values) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setApiError('');

    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
    };

    try {
      const result = isEdit
        ? await updateSpecialty(specialtyId, payload)
        : await createSpecialty(payload);

      if (result.error) {
        setApiError(result.error.message);
        showError(result.error.message);

        return;
      }

      showSuccess(
        isEdit
          ? `Especialidad "${payload.name}" actualizada con éxito.`
          : `Especialidad "${payload.name}" agregada con éxito.`
      );

      navigate(ROUTES.adminSpecialties);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const watchedName = watch('name', '');
  const watchedDescription = watch('description', '');
  const previewIcon = getSpecialtyIcon({ name: watchedName });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Navegación y encabezado */}
      <div className="flex flex-col gap-2">
        <nav
          className="flex items-center gap-2 text-xs text-med-text-muted"
          aria-label="Migas de pan"
        >
          <Link
            to={ROUTES.adminSpecialties}
            className="hover:text-med-primary-900 transition flex items-center gap-1"
          >
            <Icon icon={ICONS.previous} size={12} />
            <span>Especialidades</span>
          </Link>
          <span>/</span>
          <span className="font-medium text-med-primary-900">
            {isEdit ? 'Editar Especialidad' : 'Nueva Especialidad'}
          </span>
        </nav>

        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          {isEdit ? 'Editar Especialidad' : 'Agregar Nueva Especialidad'}
        </h1>
        <p className="text-sm text-med-text-sub">
          {isEdit
            ? 'Modifique los datos de la especialidad médica.'
            : 'Complete los datos para dar de alta una nueva especialidad en el centro de salud.'}
        </p>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <p className="p-6 text-sm text-med-text-sub" role="status">
            Cargando datos de la especialidad…
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onValid)}
            noValidate
            className="flex flex-col gap-6"
          >
            {apiError && (
              <div
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200"
                role="alert"
              >
                {apiError}
              </div>
            )}

            {/* Nombre */}
            <FormField
              id="specialty-name"
              label="Nombre de la Especialidad"
              error={errors.name?.message}
              required
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  {...register('name', {
                    validate: {
                      required: (value) =>
                        value.trim().length > 0 ||
                        'El nombre de la especialidad es obligatorio.',
                      length: (value) => {
                        const length = value.trim().length;

                        return (
                          (length >= 3 && length <= 100) ||
                          'El nombre debe tener entre 3 y 100 caracteres.'
                        );
                      },
                    },
                  })}
                  placeholder="Ej. Cardiología Pediátrica"
                  className="py-2.5 px-3 text-sm"
                />
              )}
            </FormField>

            {/* Descripción */}
            <FormField
              id="specialty-description"
              label="Descripción"
              hint={`${watchedDescription.length}/100 caracteres`}
              error={errors.description?.message}
              required
            >
              {(fieldProps) => (
                <textarea
                  {...fieldProps}
                  rows={3}
                  maxLength={100}
                  {...register('description', {
                    validate: {
                      required: (value) =>
                        value.trim().length > 0 ||
                        'La descripción es obligatoria.',
                      length: (value) => {
                        const length = value.trim().length;

                        return (
                          (length >= 10 && length <= 100) ||
                          'La descripción debe tener entre 10 y 100 caracteres.'
                        );
                      },
                    },
                  })}
                  placeholder="Breve reseña de las afecciones tratadas y servicios brindados (entre 10 y 100 caracteres)..."
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-med-text-main placeholder:text-med-text-muted focus:border-med-primary-600 focus:outline-none focus:ring-1 focus:ring-med-primary-600 ${
                    errors.description
                      ? 'border-red-400 bg-red-50/20'
                      : 'border-med-border'
                  }`}
                />
              )}
            </FormField>

            {/* Vista previa del icono asignado automáticamente */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-med-primary-50/60 px-4 py-3 border border-med-primary-100">
              <div>
                <p className="text-xs font-semibold text-med-primary-900">
                  Icono representativo
                </p>
                <p className="text-xs text-med-text-sub">
                  Se asigna automáticamente según el nombre de la especialidad.
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-700 text-white shadow-sm">
                <Icon icon={previewIcon} size={20} />
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-med-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.adminSpecialties)}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-semibold shadow-sm"
              >
                {isSubmitting
                  ? 'Guardando…'
                  : isEdit
                    ? 'Actualizar Especialidad'
                    : 'Guardar Especialidad'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default SpecialtyFormPage;
