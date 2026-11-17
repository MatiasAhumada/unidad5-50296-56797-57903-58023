import { useEffect, useRef, useState } from 'react';
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
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import {
  createDoctor,
  getDoctors,
  updateDoctor,
} from '../services/doctorsService';
import { getDoctorInitials } from '../utils/doctorInitials';

function DoctorFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const isEdit = Boolean(doctorId);

  const initialDoctor = location.state?.doctor;

  const [formData, setFormData] = useState({
    name: initialDoctor?.name || '',
    licenseNumber: initialDoctor?.licenseNumber || '',
    specialtyId: initialDoctor?.specialty?.id || '',
  });

  const isSubmittingRef = useRef(false);
  const [specialties, setSpecialties] = useState([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    setSpecialtiesLoading(true);

    getSpecialties(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setApiError(error.message);

          return;
        }

        setSpecialties(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSpecialtiesLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isEdit || location.state?.doctor) return;

    const controller = new AbortController();

    setIsLoading(true);
    setApiError('');

    getDoctors(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setApiError(error.message);

          return;
        }

        const found = data?.find((d) => String(d.id) === String(doctorId));

        if (found) {
          setFormData({
            name: found.name || '',
            licenseNumber: found.licenseNumber || '',
            specialtyId: found.specialty?.id || '',
          });
        } else {
          setApiError('No se encontró el profesional especificado.');
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setApiError(err.message || 'Error al cargar el profesional');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [doctorId, isEdit, location.state]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedLicense = formData.licenseNumber.trim();

    if (!trimmedName) {
      errors.name = 'El nombre del profesional es obligatorio.';
    } else if (trimmedName.length < 3 || trimmedName.length > 100) {
      errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    if (!trimmedLicense) {
      errors.licenseNumber = 'La matrícula profesional es obligatoria.';
    } else if (trimmedLicense.length < 2 || trimmedLicense.length > 50) {
      errors.licenseNumber = 'La matrícula debe tener entre 2 y 50 caracteres.';
    }

    if (!formData.specialtyId) {
      errors.specialtyId = 'Debe seleccionar una especialidad médica.';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || isSubmittingRef.current) return;

    if (!validate()) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setApiError('');

    const payload = {
      name: formData.name.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      specialtyId: formData.specialtyId,
    };

    try {
      const result = isEdit
        ? await updateDoctor(doctorId, payload)
        : await createDoctor(payload);

      if (result.error) {
        setApiError(result.error.message);
        showError(result.error.message);

        return;
      }

      showSuccess(
        isEdit
          ? `Profesional "${payload.name}" actualizado con éxito.`
          : `Profesional "${payload.name}" agregado con éxito.`
      );

      navigate(ROUTES.adminDoctors);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const specialtyOptions = [
    {
      value: '',
      label: specialtiesLoading
        ? 'Cargando especialidades…'
        : 'Seleccione una especialidad…',
    },
    ...specialties.map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    })),
  ];

  const selectedSpecialtyName =
    specialties.find((s) => s.id === formData.specialtyId)?.name ||
    'Sin especialidad asignada';

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <nav
          className="flex items-center gap-2 text-xs text-med-text-muted"
          aria-label="Migas de pan"
        >
          <Link
            to={ROUTES.adminDoctors}
            className="hover:text-med-primary-900 transition flex items-center gap-1"
          >
            <Icon icon={ICONS.previous} size={12} />
            <span>Doctores</span>
          </Link>
          <span>/</span>
          <span className="font-medium text-med-primary-900">
            {isEdit ? 'Editar Doctor' : 'Nuevo Doctor'}
          </span>
        </nav>

        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          {isEdit ? 'Editar Profesional' : 'Agregar Nuevo Profesional'}
        </h1>
        <p className="text-sm text-med-text-sub">
          {isEdit
            ? 'Modifique los datos personales, matrícula y especialidad del profesional.'
            : 'Complete los datos para registrar un nuevo médico en el centro de salud.'}
        </p>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <p className="p-6 text-sm text-med-text-sub" role="status">
            Cargando datos del profesional…
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

            {/* Vista previa del perfil */}
            <div className="flex items-center gap-4 rounded-xl bg-med-primary-50/60 px-4 py-3 border border-med-primary-100">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-med-primary-700 text-sm font-bold text-white shadow-sm">
                {getDoctorInitials(formData.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-med-primary-900 truncate">
                  {formData.name.trim() || 'Nombre del profesional'}
                </p>
                <p className="text-xs text-med-text-sub truncate">
                  {formData.licenseNumber.trim()
                    ? `Matrícula: ${formData.licenseNumber.trim()}`
                    : 'Sin matrícula ingresada'}{' '}
                  · {selectedSpecialtyName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                id="doctor-name"
                label="Nombre Completo"
                error={formErrors.name}
                className="sm:col-span-2"
                required
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={formData.name}
                    onChange={handleFieldChange('name')}
                    placeholder="Ej. Dra. María González"
                    error={Boolean(formErrors.name)}
                    className="py-2.5 px-3 text-sm"
                  />
                )}
              </FormField>

              <FormField
                id="doctor-license"
                label="Matrícula Profesional"
                error={formErrors.licenseNumber}
                required
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={formData.licenseNumber}
                    onChange={handleFieldChange('licenseNumber')}
                    placeholder="Ej. MP-45821"
                    error={Boolean(formErrors.licenseNumber)}
                    className="py-2.5 px-3 text-sm"
                  />
                )}
              </FormField>

              <FormField
                id="doctor-specialty"
                label="Especialidad Médica"
                error={formErrors.specialtyId}
                required
              >
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    value={formData.specialtyId}
                    onChange={handleFieldChange('specialtyId')}
                    options={specialtyOptions}
                    disabled={specialtiesLoading}
                    error={Boolean(formErrors.specialtyId)}
                  />
                )}
              </FormField>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-med-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.adminDoctors)}
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
                    ? 'Actualizar Profesional'
                    : 'Guardar Profesional'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default DoctorFormPage;
