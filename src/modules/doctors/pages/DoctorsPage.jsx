import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import IconButton from '../../shared/components/IconButton';
import StatusMessage from '../../shared/components/StatusMessage';
import TablePagination from '../../shared/components/TablePagination';
import { unwrapApiResult } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import {
  createDoctor,
  deleteDoctor,
  getDoctorAvailabilities,
  getDoctorsPage,
  saveDoctorAvailabilities,
  toggleDoctorStatus,
  updateDoctor,
} from '../services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';

const WEEK_DAYS = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
];

function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [page, setPage] = useState({ data: [], pageSize: 10, total: 0 });
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [requestKey, setRequestKey] = useState(0);
  const [togglingDoctorId, setTogglingDoctorId] = useState(null);

  // Modal Create / Edit Doctor
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    licenseNumber: '',
    specialtyId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);

  // Modal Delete Doctor
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal Availabilities
  const [availabilityDoctor, setAvailabilityDoctor] = useState(null);
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [hasExistingAvailability, setHasExistingAvailability] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  // Fetch doctors and specialties
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    Promise.all([
      getDoctorsPage(
        { pageSize: 10, pageIndex, name: searchTerm.trim() || undefined },
        controller.signal
      ),
      getSpecialties(controller.signal),
    ])
      .then((results) => results.map(unwrapApiResult))
      .then(([doctorsData, specialtiesData]) => {
        setPage(doctorsData);
        setSpecialties(specialtiesData);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [pageIndex, requestKey, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(1);
  };

  const openCreateDoctorModal = () => {
    setEditingDoctor(null);
    setDoctorForm({
      name: '',
      licenseNumber: '',
      specialtyId: specialties[0]?.id || '',
    });
    setFormErrors({});
    setActionSuccess('');
    setActionError('');
    setShowDoctorModal(true);
  };

  const openEditDoctorModal = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({
      name: doctor.name || '',
      licenseNumber: doctor.licenseNumber || '',
      specialtyId: doctor.specialty?.id || '',
    });
    setFormErrors({});
    setActionSuccess('');
    setActionError('');
    setShowDoctorModal(true);
  };

  const validateDoctorForm = () => {
    const errors = {};
    const trimmedName = doctorForm.name.trim();
    const trimmedLicense = doctorForm.licenseNumber.trim();

    if (!trimmedName) {
      errors.name = 'El nombre del doctor es obligatorio.';
    } else if (trimmedName.length < 3 || trimmedName.length > 100) {
      errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
    }

    if (!trimmedLicense) {
      errors.licenseNumber = 'La matrícula es obligatoria.';
    } else if (trimmedLicense.length > 50) {
      errors.licenseNumber = 'La matrícula no puede superar los 50 caracteres.';
    } else if (
      page.data.some(
        (d) =>
          d.id !== editingDoctor?.id &&
          d.licenseNumber?.trim().toLowerCase() === trimmedLicense.toLowerCase()
      )
    ) {
      errors.licenseNumber =
        'Ya existe un médico registrado con esa matrícula.';
    }

    if (!doctorForm.specialtyId) {
      errors.specialtyId = 'Debe seleccionar una especialidad.';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleDoctorSubmit = async (event) => {
    event.preventDefault();

    if (!validateDoctorForm()) return;

    setIsSubmittingDoctor(true);
    setActionSuccess('');
    setActionError('');

    try {
      if (editingDoctor) {
        unwrapApiResult(
          await updateDoctor(editingDoctor.id, {
            name: doctorForm.name.trim(),
            licenseNumber: doctorForm.licenseNumber.trim(),
            specialtyId: doctorForm.specialtyId,
          })
        );
        setActionSuccess('Datos del doctor actualizados con éxito.');
      } else {
        unwrapApiResult(
          await createDoctor({
            name: doctorForm.name.trim(),
            licenseNumber: doctorForm.licenseNumber.trim(),
            specialtyId: doctorForm.specialtyId,
          })
        );
        setActionSuccess('Doctor registrado exitosamente.');
      }

      setShowDoctorModal(false);
      setRequestKey((k) => k + 1);
    } catch (submitErr) {
      const msg = submitErr.message;

      if (
        submitErr?.errorCode === 'DUPLICATE_LICENSE_NUMBER' ||
        submitErr?.status === 409 ||
        msg.toLowerCase().includes('matrícula')
      ) {
        setFormErrors((prev) => ({ ...prev, licenseNumber: msg }));
      } else {
        setActionError(msg);
      }
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;

    setIsDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      unwrapApiResult(await deleteDoctor(doctorToDelete.id));
      setActionSuccess(
        `Doctor "${doctorToDelete.name}" eliminado físicamente de la base de datos.`
      );
      setDoctorToDelete(null);
      setRequestKey((k) => k + 1);
    } catch (delError) {
      setActionError(delError.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleDoctorStatus = async (doctor) => {
    setTogglingDoctorId(doctor.id);
    setActionSuccess('');
    setActionError('');
    try {
      const newStatus = doctor.isActive === false;

      unwrapApiResult(await toggleDoctorStatus(doctor.id, newStatus));
      setActionSuccess(
        `Doctor "${doctor.name}" ${newStatus ? 'activado' : 'desactivado'} correctamente.`
      );
      setRequestKey((k) => k + 1);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setTogglingDoctorId(null);
    }
  };

  // Open availability configuration modal
  const openAvailabilityModal = async (doctor) => {
    setAvailabilityDoctor(doctor);
    setAvailabilityError('');
    setIsLoadingAvailability(true);

    try {
      const availabilities = unwrapApiResult(
        await getDoctorAvailabilities(doctor.id)
      );
      const hasExisting =
        Array.isArray(availabilities) && availabilities.length > 0;

      setHasExistingAvailability(hasExisting);

      // Mapear cada día de la semana con su horario si ya estaba configurado
      const scheduleMap = new Map();

      if (hasExisting) {
        availabilities.forEach((item) => {
          // Normalizar mayúsculas y quitar acentos para matchear consistentemente con 'MIERCOLES', 'SABADO', etc.
          const normalizedDay = (item.day || '')
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

          scheduleMap.set(normalizedDay, {
            startTime: item.startTime?.slice(0, 5) || '08:00',
            endTime: item.endTime?.slice(0, 5) || '16:00',
          });
        });
      }

      const initialSchedule = WEEK_DAYS.map(({ key, label }) => {
        const existing = scheduleMap.get(key);

        return {
          day: key,
          label,
          active: Boolean(existing),
          startTime: existing?.startTime || '08:00',
          endTime: existing?.endTime || '16:00',
        };
      });

      setDoctorSchedule(initialSchedule);
    } catch (err) {
      setAvailabilityError(err.message);
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleScheduleDayToggle = (dayIndex) => {
    setDoctorSchedule((current) =>
      current.map((item, idx) =>
        idx === dayIndex ? { ...item, active: !item.active } : item
      )
    );
  };

  const handleScheduleTimeChange = (dayIndex, field, value) => {
    setDoctorSchedule((current) =>
      current.map((item, idx) =>
        idx === dayIndex ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveAvailability = async () => {
    setAvailabilityError('');

    const activeDays = doctorSchedule.filter((d) => d.active);

    if (activeDays.length === 0) {
      setAvailabilityError('Debe activar al menos un día de atención.');

      return;
    }

    // Validar startTime < endTime
    for (const d of activeDays) {
      if (d.startTime >= d.endTime) {
        setAvailabilityError(
          `En ${d.day}, la hora de inicio (${d.startTime}) debe ser anterior a la hora de fin (${d.endTime}).`
        );

        return;
      }
    }

    setIsSavingAvailability(true);
    try {
      // El backend espera TimeSpan → formato "HH:MM:SS" (con segundos)
      const toTimeSpan = (hhmm) => (hhmm.length === 5 ? `${hhmm}:00` : hhmm);

      const payload = {
        doctorId: availabilityDoctor.id,
        days: activeDays.map((d) => ({
          day: d.day,
          startTime: toTimeSpan(d.startTime),
          endTime: toTimeSpan(d.endTime),
        })),
      };

      unwrapApiResult(
        await saveDoctorAvailabilities(payload, hasExistingAvailability)
      );
      setActionSuccess(
        `Disponibilidad horaria configurada con éxito para ${availabilityDoctor.name}.`
      );
      setAvailabilityDoctor(null);
    } catch (err) {
      setAvailabilityError(err.message);
    } finally {
      setIsSavingAvailability(false);
    }
  };

  const specialtyOptions = [
    { value: '', label: 'Seleccione una especialidad' },
    ...specialties.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Doctores
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Gestione el personal médico y configure su disponibilidad horaria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <FormField
              id="doctor-search"
              label="Buscar doctores"
              labelClassName="sr-only"
            >
              {(fieldProps) => (
                <div className="relative">
                  <span
                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted"
                    aria-hidden="true"
                  >
                    <Icon icon={ICONS.search} size={16} />
                  </span>
                  <Input
                    {...fieldProps}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre..."
                    className="pl-9 pr-3 py-2 text-xs"
                  />
                </div>
              )}
            </FormField>
          </div>

          <Button
            onClick={openCreateDoctorModal}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>+ Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <StatusMessage variant="success">{actionSuccess}</StatusMessage>
      )}

      {actionError && (
        <StatusMessage variant="error">{actionError}</StatusMessage>
      )}

      {error && (
        <div className="flex flex-col items-start gap-3">
          <StatusMessage variant="error">{error}</StatusMessage>
          <button
            type="button"
            className="text-sm font-semibold text-med-primary-700 underline"
            onClick={() => setRequestKey((key) => key + 1)}
          >
            Reintentar
          </button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-med-border p-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores ({page.total})
          </h2>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Cargando doctores…
          </p>
        ) : !error && page.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron doctores.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Nombre del doctor</th>
                    <th className="px-6 py-3.5">Matrícula</th>
                    <th className="px-6 py-3.5">Especialidad</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {page.data.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-gray-50/70 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
                            <Icon icon={ICONS.doctor} size={20} />
                          </span>
                          <span className="font-semibold text-med-primary-900">
                            {doctor.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs text-med-text-sub">
                        {doctor.licenseNumber}
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-med-text-sub">
                        {doctor.specialty?.name ?? 'Sin especialidad'}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          disabled={togglingDoctorId === doctor.id}
                          onClick={() => handleToggleDoctorStatus(doctor)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer disabled:opacity-50 ${
                            doctor.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                          }`}
                          title={
                            doctor.isActive !== false
                              ? 'Activo - Clic para desactivar'
                              : 'Inactivo - Clic para activar'
                          }
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              doctor.isActive !== false
                                ? 'bg-emerald-500'
                                : 'bg-gray-400'
                            }`}
                          />
                          <span>
                            {doctor.isActive !== false ? 'Activo' : 'Inactivo'}
                          </span>
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openAvailabilityModal(doctor)}
                            className="inline-flex items-center gap-1 rounded bg-med-primary-50 px-2 py-1 text-xs font-semibold text-med-primary-800 hover:bg-med-primary-100 transition"
                            title="Gestionar disponibilidad horaria"
                          >
                            <Icon icon={ICONS.clock} size={14} />
                            <span>Horarios</span>
                          </button>
                          <IconButton
                            label={`Editar ${doctor.name}`}
                            icon={ICONS.edit}
                            size={16}
                            onClick={() => openEditDoctorModal(doctor)}
                            className="p-1.5 rounded hover:bg-med-primary-50 text-med-text-sub hover:text-med-primary-900"
                          />
                          <IconButton
                            label={`Eliminar físicamente ${doctor.name}`}
                            icon={ICONS.delete}
                            size={16}
                            onClick={() => setDoctorToDelete(doctor)}
                            className="p-1.5 rounded hover:bg-red-50 text-med-text-sub hover:text-red-600"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={pageIndex}
              pageSize={page.pageSize}
              totalItems={page.total}
              totalPages={Math.ceil(page.total / page.pageSize) || 1}
              onPageChange={setPageIndex}
            />
          </>
        )}
      </Card>

      {/* Modal Crear / Editar Doctor */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-med-border">
            <div className="mb-4 border-b border-med-border-subtle pb-3">
              <h3 className="text-lg font-bold text-med-primary-900">
                {editingDoctor ? 'Editar Doctor' : 'Registrar Nuevo Doctor'}
              </h3>
              <p className="text-xs text-med-text-sub mt-1">
                Complete los campos para integrar al facultativo al sistema.
              </p>
            </div>

            <form onSubmit={handleDoctorSubmit} className="space-y-4">
              <FormField
                id="modal-doctor-name"
                label="Nombre Completo del Doctor"
                labelClassName="text-xs font-semibold text-med-text-sub"
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={doctorForm.name}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ej: Dr. Alejandro Martínez"
                    className="px-3 py-2 text-xs"
                  />
                )}
              </FormField>
              {formErrors.name && (
                <p className="text-xs text-red-600">{formErrors.name}</p>
              )}

              <FormField
                id="modal-doctor-license"
                label="Número de Licencia Médica / Matrícula"
                labelClassName="text-xs font-semibold text-med-text-sub"
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={doctorForm.licenseNumber}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        licenseNumber: e.target.value,
                      }))
                    }
                    placeholder="Ej: MP-45920-X"
                    className="px-3 py-2 text-xs"
                  />
                )}
              </FormField>
              {formErrors.licenseNumber && (
                <p className="text-xs text-red-600">
                  {formErrors.licenseNumber}
                </p>
              )}

              <FormField
                id="modal-doctor-specialty"
                label="Especialidad"
                labelClassName="text-xs font-semibold text-med-text-sub"
              >
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    value={doctorForm.specialtyId}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({
                        ...prev,
                        specialtyId: e.target.value,
                      }))
                    }
                    options={specialtyOptions}
                    className="px-3 py-2 text-xs"
                  />
                )}
              </FormField>
              {formErrors.specialtyId && (
                <p className="text-xs text-red-600">{formErrors.specialtyId}</p>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-med-border-subtle">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDoctorModal(false)}
                  disabled={isSubmittingDoctor}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmittingDoctor}>
                  {isSubmittingDoctor
                    ? 'Guardando…'
                    : editingDoctor
                      ? 'Actualizar Doctor'
                      : 'Guardar Doctor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Disponibilidad Horaria */}
      {availabilityDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-med-border max-h-[90vh] overflow-y-auto">
            <div className="mb-4 border-b border-med-border-subtle pb-3">
              <h3 className="text-lg font-bold text-med-primary-900">
                Gestionar Disponibilidad Horaria
              </h3>
              <p className="text-xs text-med-text-sub mt-1">
                Profesional:{' '}
                <strong className="text-med-text-main">
                  {availabilityDoctor.name}
                </strong>{' '}
                ({availabilityDoctor.specialty?.name})
              </p>
            </div>

            {availabilityError && (
              <div className="mb-4">
                <StatusMessage variant="error">
                  {availabilityError}
                </StatusMessage>
              </div>
            )}

            {isLoadingAvailability ? (
              <p className="p-4 text-xs text-med-text-sub text-center">
                Consultando disponibilidad configurada…
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-med-text-muted">
                  Active los días que el médico atiende y especifique los
                  horarios de entrada y salida. Se generarán turnos de 30
                  minutos para el mes en curso.
                </p>

                <div className="divide-y divide-med-border-subtle">
                  {doctorSchedule.map((sched, idx) => (
                    <div
                      key={sched.day}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <label className="flex items-center gap-2 font-semibold text-med-primary-900 cursor-pointer min-w-24">
                        <input
                          type="checkbox"
                          checked={sched.active}
                          onChange={() => handleScheduleDayToggle(idx)}
                          className="rounded text-med-primary-700"
                        />
                        <span>{sched.label ?? sched.day}</span>
                      </label>

                      {sched.active ? (
                        <div className="flex items-center gap-2">
                          <span className="text-med-text-muted">De:</span>
                          <input
                            type="time"
                            value={sched.startTime}
                            onChange={(e) =>
                              handleScheduleTimeChange(
                                idx,
                                'startTime',
                                e.target.value
                              )
                            }
                            className="rounded border border-med-border px-2 py-1 text-xs"
                          />
                          <span className="text-med-text-muted">A:</span>
                          <input
                            type="time"
                            value={sched.endTime}
                            onChange={(e) =>
                              handleScheduleTimeChange(
                                idx,
                                'endTime',
                                e.target.value
                              )
                            }
                            className="rounded border border-med-border px-2 py-1 text-xs"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-med-text-muted italic">
                          No atiende
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-med-border-subtle">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAvailabilityDoctor(null)}
                    disabled={isSavingAvailability}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveAvailability}
                    disabled={isSavingAvailability}
                  >
                    {isSavingAvailability
                      ? 'Guardando…'
                      : 'Guardar Disponibilidad'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación Física */}
      {doctorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-med-border">
            <h3 className="text-base font-bold text-med-primary-900">
              ¿Eliminar doctor definitivamente?
            </h3>
            <p className="mt-2 text-xs text-med-text-sub">
              ¿Está seguro de eliminar físicamente al doctor{' '}
              <strong className="text-med-text-main">
                {doctorToDelete.name}
              </strong>
              ? Esta acción borrará de forma permanente al profesional de la
              base de datos (baja física). Si solo desea suspenderlo, use el
              botón de Estado.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDoctorToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteDoctor}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando…' : 'Sí, eliminar definitivamente'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsPage;
