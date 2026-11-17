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
import {
  SPECIALTY_ICON_PRESETS,
  getSpecialtyIcon,
  saveSpecialtyIcon,
} from '../constants/specialtyIcons';

function SpecialtyFormPage() {
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
          const loadedIcon = getSpecialtyIcon(found);

          setSelectedIconKey(loadedIcon.key);
          setCustomIconUrl(loadedIcon.customUrl || '');
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showError('El archivo de icono no debe superar los 2 MB.');

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

    const savedId = result.data?.id || specialtyId;

    saveSpecialtyIcon({
      id: savedId,
      name: payload.name,
      iconKey: selectedIconKey,
      customUrl: customIconUrl,
    });

    showSuccess(
      isEdit
        ? `Especialidad "${payload.name}" actualizada con éxito.`
        : `Especialidad "${payload.name}" agregada con éxito.`
    );

    navigate(ROUTES.adminSpecialties);
  };

  const selectedPreset = SPECIALTY_ICON_PRESETS.find(
    (p) => p.key === selectedIconKey
  );

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
            ? 'Modifique los datos y el icono de la especialidad médica.'
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

            {/* Selector de Icono Médico */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-med-text-sub">
                    Icono Representativo
                  </label>
                  <p className="text-xs text-med-text-muted">
                    Seleccione un icono clínico del catálogo o suba un archivo
                    SVG/PNG personalizado.
                  </p>
                </div>
                {/* Previsualización del icono activo */}
                <div className="flex items-center gap-2 rounded-xl bg-med-primary-50 px-3 py-1.5 border border-med-primary-100">
                  <span className="text-xs text-med-primary-900 font-medium">
                    Vista previa:
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-med-primary-700 text-white">
                    {selectedIconKey === 'custom' && customIconUrl ? (
                      <img
                        src={customIconUrl}
                        alt="Icono personalizado"
                        className="h-5 w-5 object-contain"
                      />
                    ) : (
                      <Icon
                        icon={selectedPreset?.icon || ICONS.medicalFile}
                        size={18}
                      />
                    )}
                  </span>
                </div>
              </div>

              {/* Grilla de iconos predeterminados */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 p-3 rounded-2xl bg-med-bg/60 border border-med-border-subtle">
                {SPECIALTY_ICON_PRESETS.map((preset) => {
                  const isSelected =
                    selectedIconKey === preset.key && !customIconUrl;

                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => {
                        setSelectedIconKey(preset.key);
                        setCustomIconUrl('');
                      }}
                      title={preset.label}
                      className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl transition cursor-pointer border ${
                        isSelected
                          ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
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

              {/* Carga de archivo personalizado */}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/svg+xml"
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
                    <span>Icono personalizado activo</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomIconUrl('');
                        setSelectedIconKey('hospital');
                      }}
                      className="text-red-500 hover:text-red-700 ml-1 cursor-pointer font-bold"
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
