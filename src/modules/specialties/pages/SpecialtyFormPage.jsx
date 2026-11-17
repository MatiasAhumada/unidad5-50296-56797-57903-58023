import { useEffect, useState } from 'react';
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

  const [formData, setFormData] = useState({
    name: initialSpecialty?.name || '',
    description: initialSpecialty?.description || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
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
          setFormData({
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
  }, [isEdit, location.state, specialtyId]);

  const validate = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedDesc = formData.description.trim();

    if (!trimmedName) {
      errors.name = 'El nombre de la especialidad es obligatorio.';
    } else if (trimmedName.length < 3 || trimmedName.length > 100) {
      errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    if (!trimmedDesc) {
      errors.description = 'La descripción es obligatoria.';
    } else if (trimmedDesc.length < 10 || trimmedDesc.length > 100) {
      errors.description =
        'La descripción debe tener entre 10 y 100 caracteres.';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    let result;

    if (isEdit) {
      result = await updateSpecialty(specialtyId, payload);
    } else {
      result = await createSpecialty(payload);
    }

    setIsSubmitting(false);

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
  };

  const previewIcon = getSpecialtyIcon({ name: formData.name });

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {apiError && (
              <div
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200"
                role="alert"
              >
                {apiError}
              </div>
            )}

            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <FormField
                id="specialty-name"
                label="Nombre de la Especialidad"
                required
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));

                      if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: '' }));
                      }
                    }}
                    placeholder="Ej. Cardiología Pediátrica"
                    className="py-2.5 px-3 text-sm"
                  />
                )}
              </FormField>
              {formErrors.name && (
                <p className="text-xs font-medium text-red-600">
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="specialty-description"
                  className="text-xs font-semibold text-med-text-sub"
                >
                  Descripción <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-med-text-muted">
                  {formData.description.length}/100 caracteres
                </span>
              </div>
              <textarea
                id="specialty-description"
                rows={3}
                value={formData.description}
                maxLength={100}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));

                  if (formErrors.description) {
                    setFormErrors((prev) => ({ ...prev, description: '' }));
                  }
                }}
                placeholder="Breve reseña de las afecciones tratadas y servicios brindados (entre 10 y 100 caracteres)..."
                className="w-full rounded-xl border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main placeholder:text-med-text-muted focus:border-med-primary-600 focus:outline-none focus:ring-1 focus:ring-med-primary-600"
              />
              {formErrors.description && (
                <p className="text-xs font-medium text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

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
