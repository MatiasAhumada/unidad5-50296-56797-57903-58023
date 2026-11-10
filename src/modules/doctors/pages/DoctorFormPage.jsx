import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import BreadcrumbNav from '../../shared/components/BreadcrumbNav';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  createDoctor,
  getDoctors,
  updateDoctor,
} from '../services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import {
  getDoctorPhoto,
  saveDoctorPhoto,
  SAMPLE_DOCTOR_AVATARS,
} from '../constants/doctorPhotos';

export default function DoctorFormPage() {
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

  const [photoUrl, setPhotoUrl] = useState(
    () => getDoctorPhoto(initialDoctor) || ''
  );
  const fileInputRef = useRef(null);

  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Cargar especialidades y datos del doctor (si se está editando y no vinieron por state)
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setApiError('');

    const promises = [getSpecialties(controller.signal)];

    if (isEdit && !location.state?.doctor) {
      promises.push(getDoctors(controller.signal, true));
    }

    Promise.all(promises)
      .then(([specs, allDoctors]) => {
        setSpecialties(specs);

        if (allDoctors) {
          const found = allDoctors.find((d) => d.id === doctorId);

          if (found) {
            setFormData({
              name: found.name || '',
              licenseNumber: found.licenseNumber || '',
              specialtyId: found.specialty?.id || '',
            });
            const loadedPhoto = getDoctorPhoto(found);

            if (loadedPhoto) setPhotoUrl(loadedPhoto);
          } else {
            setApiError('No se encontró el doctor especificado.');
          }
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
  }, [doctorId, isEdit, location.state]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setApiError('La foto no debe superar los 2MB.');

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedLicense = formData.licenseNumber.trim();

    if (!trimmedName) {
      errors.name = 'El nombre del doctor es obligatorio.';
    } else if (trimmedName.length < 3 || trimmedName.length > 100) {
      errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    if (!trimmedLicense) {
      errors.licenseNumber = 'El número de licencia médica es obligatorio.';
    } else if (trimmedLicense.length > 50) {
      errors.licenseNumber =
        'La matrícula o licencia no puede superar los 50 caracteres.';
    }

    if (!formData.specialtyId) {
      errors.specialtyId = 'Debe seleccionar una especialidad.';
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
      licenseNumber: formData.licenseNumber.trim(),
      specialtyId: formData.specialtyId,
    };

    try {
      let savedDoctor = null;

      if (isEdit) {
        savedDoctor = await updateDoctor(doctorId, payload);
      } else {
        savedDoctor = await createDoctor(payload);
      }

      // Guardar la foto del doctor
      saveDoctorPhoto({
        id: savedDoctor?.id || doctorId,
        licenseNumber: payload.licenseNumber,
        name: payload.name,
        photoUrl: photoUrl || null,
      });

      navigate(ROUTES.adminDoctors, {
        state: {
          actionSuccess: isEdit
            ? `Datos de ${payload.name} actualizados con éxito.`
            : `Doctor ${payload.name} registrado exitosamente.`,
        },
      });
    } catch (err) {
      const msg = getApiErrorMessage(err);

      if (
        err?.errorCode === 'DUPLICATE_LICENSE_NUMBER' ||
        err?.status === 409 ||
        msg.toLowerCase().includes('matrícula') ||
        msg.toLowerCase().includes('licencia')
      ) {
        setFormErrors((prev) => ({ ...prev, licenseNumber: msg }));
      } else {
        setApiError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const specialtyOptions = [
    { value: '', label: 'Seleccione especialidad' },
    ...specialties.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Navegación Breadcrumb */}
      <BreadcrumbNav
        parentLabel="Doctores"
        parentRoute={ROUTES.adminDoctors}
        currentLabel={isEdit ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
      />

      {/* Tarjeta de Formulario Principal */}
      <Card className="max-w-4xl p-6 sm:p-8 bg-white border border-med-border rounded-2xl shadow-xs">
        {/* Cabecera del formulario */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-med-primary-50 text-med-primary-900 border border-med-border shadow-xs overflow-hidden">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon icon={ICONS.doctor} size={24} />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-med-primary-900 sm:text-2xl">
              {isEdit ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
            </h1>
            <p className="mt-1 text-xs text-med-text-sub">
              Complete todos los campos obligatorios para integrar al
              facultativo al sistema del centro médico.
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
            {/* Sección de Foto del Médico */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-med-bg/60 border border-med-border-subtle">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-med-border shadow-xs overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto del médico"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Icon
                    icon={ICONS.doctor}
                    size={30}
                    className="text-med-text-muted"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5 grow">
                <span className="text-xs font-semibold text-med-primary-900">
                  Foto de Perfil del Profesional
                </span>
                <p className="text-xs text-med-text-muted">
                  Suba una imagen o foto (JPG, PNG o WebP, máx. 2MB). Se
                  mostrará en el listado y en su disponibilidad.
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Icon icon={ICONS.edit} size={14} />
                    <span>{photoUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                  </Button>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-xs text-red-600 hover:text-red-700 underline font-medium px-2 py-1"
                    >
                      Quitar foto
                    </button>
                  )}

                  {/* Sugerencias de ejemplo si no tiene foto a mano */}
                  {!photoUrl && (
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-[11px] text-med-text-muted">
                        O elija un avatar:
                      </span>
                      {SAMPLE_DOCTOR_AVATARS.slice(0, 3).map((sample, idx) => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => setPhotoUrl(sample)}
                          className="h-7 w-7 rounded-lg overflow-hidden border border-med-border hover:border-med-primary-500 transition cursor-pointer"
                          title={`Avatar de ejemplo ${idx + 1}`}
                        >
                          <img
                            src={sample}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre Completo del Doctor */}
            <FormField
              id="doctor-fullname"
              label="Nombre Completo del Doctor"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <div className="relative">
                  <span
                    className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted"
                    aria-hidden="true"
                  >
                    <Icon icon={ICONS.doctor} size={18} />
                  </span>
                  <Input
                    {...fieldProps}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ej: Dr. Alejandro Martínez"
                    className="pl-10 pr-4 py-2.5 text-xs rounded-xl"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </FormField>
            {formErrors.name && (
              <p className="-mt-4 text-xs text-red-600 font-medium">
                {formErrors.name}
              </p>
            )}

            {/* Fila con dos columnas: Especialidad y Número de Licencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Especialidad */}
              <div>
                <FormField
                  id="doctor-specialty"
                  label="Especialidad"
                  labelClassName="text-xs font-semibold text-med-text-sub"
                >
                  {(fieldProps) => (
                    <div className="relative">
                      <span
                        className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted pointer-events-none z-10"
                        aria-hidden="true"
                      >
                        <Icon icon={ICONS.hospital} size={18} />
                      </span>
                      <Select
                        {...fieldProps}
                        value={formData.specialtyId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specialtyId: e.target.value,
                          }))
                        }
                        options={specialtyOptions}
                        className="pl-10 pr-4 py-2.5 text-xs rounded-xl"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </FormField>
                {formErrors.specialtyId && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {formErrors.specialtyId}
                  </p>
                )}
              </div>

              {/* Número de Licencia Médica */}
              <div>
                <FormField
                  id="doctor-license"
                  label="Número de Licencia Médica"
                  labelClassName="text-xs font-semibold text-med-text-sub"
                >
                  {(fieldProps) => (
                    <div className="relative">
                      <span
                        className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted"
                        aria-hidden="true"
                      >
                        <Icon icon={ICONS.medicalFile} size={18} />
                      </span>
                      <Input
                        {...fieldProps}
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            licenseNumber: e.target.value,
                          }))
                        }
                        placeholder="ID-45920-X"
                        className="pl-10 pr-4 py-2.5 text-xs rounded-xl"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}
                </FormField>
                {formErrors.licenseNumber && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {formErrors.licenseNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-4 flex items-center justify-end gap-3 pt-6 border-t border-med-border-subtle">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.adminDoctors)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <span>
                  {isSubmitting
                    ? 'Guardando…'
                    : isEdit
                      ? 'Actualizar Doctor'
                      : 'Guardar Doctor'}
                </span>
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
