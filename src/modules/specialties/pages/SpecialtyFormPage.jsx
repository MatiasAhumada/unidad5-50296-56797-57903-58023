import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import BreadcrumbNav from '../../shared/components/BreadcrumbNav';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  createSpecialty,
  getSpecialties,
  updateSpecialty,
} from '../services/specialtiesService';
import {
  SPECIALTY_ICON_PRESETS,
  getSpecialtyIcon,
  saveSpecialtyIcon,
} from '../constants/specialtyIcons';

export default function SpecialtyFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const specialtyId = searchParams.get('specialtyId');
  const isEdit = Boolean(specialtyId);

  const initialSpecialty = location.state?.specialty;
  const initialIconData = getSpecialtyIcon(initialSpecialty);

  const [formData, setFormData] = useState({
    name: initialSpecialty?.name || '',
    description: initialSpecialty?.description || '',
  });

  const [selectedIconKey, setSelectedIconKey] = useState(
    initialIconData.key || 'hospital'
  );
  const [customIconUrl, setCustomIconUrl] = useState(
    initialIconData.customUrl || ''
  );

  const fileInputRef = useRef(null);
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

    getSpecialties(controller.signal, true)
      .then((specialties) => {
        const found = specialties.find((s) => s.id === specialtyId);

        if (found) {
          setFormData({
            name: found.name || '',
            description: found.description || '',
          });
          const loadedIcon = getSpecialtyIcon(found);

          setSelectedIconKey(loadedIcon.key);
          setCustomIconUrl(loadedIcon.customUrl || '');
        } else {
          setApiError('No se encontró la especialidad especificada.');
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setApiError(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [isEdit, location.state, specialtyId]);

  // Manejador para subir archivo de icono (SVG, PNG, JPG)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setApiError('El archivo de icono no debe superar los 2MB.');

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setCustomIconUrl(reader.result);
      setSelectedIconKey('custom');
    };
    reader.readAsDataURL(file);
  };

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

    try {
      let savedSpecialty = null;

      if (isEdit) {
        savedSpecialty = await updateSpecialty(specialtyId, payload);
      } else {
        savedSpecialty = await createSpecialty(payload);
      }

      // Guardar la configuración de icono para esta especialidad
      saveSpecialtyIcon({
        id: savedSpecialty?.id || specialtyId,
        name: payload.name,
        iconKey: selectedIconKey,
        customUrl: selectedIconKey === 'custom' ? customIconUrl : null,
      });

      navigate(ROUTES.adminSpecialties, {
        state: {
          actionSuccess: isEdit
            ? `Especialidad "${payload.name}" actualizada con éxito.`
            : `Especialidad "${payload.name}" registrada exitosamente.`,
        },
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);

      if (
        err?.errorCode === 'DUPLICATE_SPECIALTY_NAME' ||
        err?.status === 409 ||
        msg.toLowerCase().includes('nombre') ||
        msg.toLowerCase().includes('existe')
      ) {
        setFormErrors((prev) => ({ ...prev, name: msg }));
      } else {
        setApiError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icono actualmente seleccionado para la cabecera
  const currentPreset = SPECIALTY_ICON_PRESETS.find(
    (p) => p.key === selectedIconKey
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Navegación Breadcrumb */}
      <BreadcrumbNav
        parentLabel="Especialidades"
        parentRoute={ROUTES.adminSpecialties}
        currentLabel={
          isEdit ? 'Editar Especialidad' : 'Agregar Nueva Especialidad'
        }
      />

      {/* Tarjeta de Formulario Principal */}
      <Card className="max-w-4xl p-6 sm:p-8 bg-white border border-med-border rounded-2xl shadow-xs">
        {/* Cabecera del formulario */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-med-primary-50 text-med-primary-900 border border-med-border shadow-xs overflow-hidden">
            {selectedIconKey === 'custom' && customIconUrl ? (
              <img
                src={customIconUrl}
                alt="Icono personalizado"
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Icon icon={currentPreset?.icon || ICONS.hospital} size={26} />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-med-primary-900 sm:text-2xl">
              {isEdit ? 'Editar Especialidad' : 'Registrar Nueva Especialidad'}
            </h1>
            <p className="mt-1 text-xs text-med-text-sub">
              Complete la información técnica y seleccione el icono distintivo
              para el servicio médico.
            </p>
          </div>
        </div>

        {apiError && (
          <div className="mb-6">
            <StatusMessage variant="error">{apiError}</StatusMessage>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-xs text-med-text-muted">
            Cargando información…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Nombre de la Especialidad */}
            <FormField
              id="specialty-name"
              label="Nombre de la Especialidad"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <div className="relative">
                  <span
                    className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted"
                    aria-hidden="true"
                  >
                    <Icon icon={ICONS.hospital} size={18} />
                  </span>
                  <Input
                    {...fieldProps}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ej: Cardiología"
                    className="pl-10 pr-4 py-2.5 text-sm rounded-xl border border-med-border focus:border-med-primary-500 focus:ring-1 focus:ring-med-primary-500"
                  />
                </div>
              )}
            </FormField>
            {formErrors.name && (
              <p className="-mt-4 text-xs font-medium text-red-600">
                {formErrors.name}
              </p>
            )}

            {/* Descripción */}
            <FormField
              id="specialty-description"
              label="Descripción del Servicio / Especialidad"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Ej: Diagnóstico, seguimiento y tratamiento de patologías cardíacas y vasculares."
                  className="px-4 py-2.5 text-sm rounded-xl border border-med-border focus:border-med-primary-500 focus:ring-1 focus:ring-med-primary-500"
                />
              )}
            </FormField>
            {formErrors.description && (
              <p className="-mt-4 text-xs font-medium text-red-600">
                {formErrors.description}
              </p>
            )}

            {/* Selector de Iconos para la Especialidad */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="text-xs font-semibold text-med-text-sub">
                Icono de la Especialidad
              </label>
              <p className="text-xs text-med-text-muted -mt-1">
                Elija un icono clínico predeterminado o suba uno personalizado
                (SVG/PNG).
              </p>

              {/* Grilla de iconos predeterminados */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 p-3 rounded-2xl bg-med-bg/60 border border-med-border-subtle">
                {SPECIALTY_ICON_PRESETS.map((preset) => {
                  const isSelected = selectedIconKey === preset.key;

                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => {
                        setSelectedIconKey(preset.key);
                        setCustomIconUrl('');
                      }}
                      title={preset.label}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition cursor-pointer border ${
                        isSelected
                          ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-xs'
                          : 'bg-white text-med-text-sub border-med-border hover:bg-med-primary-50 hover:text-med-primary-900'
                      }`}
                    >
                      <Icon icon={preset.icon} size={20} />
                      <span className="text-[10px] font-medium truncate max-w-full">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Botón y opción para subir icono propio */}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.svg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs py-2 px-3.5 flex items-center gap-1.5"
                >
                  <Icon icon={ICONS.edit} size={14} />
                  <span>Subir icono propio (SVG / PNG)</span>
                </Button>

                {selectedIconKey === 'custom' && customIconUrl && (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <img
                      src={customIconUrl}
                      alt="Subido"
                      className="h-4 w-4 object-contain"
                    />
                    <span>Icono personalizado cargado</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomIconUrl('');
                        setSelectedIconKey('hospital');
                      }}
                      className="text-red-500 hover:text-red-700 ml-1"
                      title="Quitar icono personalizado"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
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
                className="px-6 py-2.5 text-sm font-semibold shadow-xs"
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
