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
import Icon from '../../shared/components/Icon';
import Select from '../../shared/components/Select';
import ToggleSwitch from '../../shared/components/ToggleSwitch';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';
import {
  createDoctorAvailability,
  updateDoctorAvailability,
} from '../../availabilities/services/availabilitiesService';
import {
  buildAvailabilityPayload,
  buildScheduleFromAvailabilities,
} from '../../availabilities/helpers/weeklyScheduleMapper';
import {
  getDoctorAvailabilities,
  getDoctors,
} from '../services/doctorsService';
import { getDoctorInitials } from '../utils/doctorInitials';

function DoctorSchedulePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState(
    location.state?.doctor ? [location.state.doctor] : []
  );
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorIdParam || '');

  const [schedule, setSchedule] = useState(() =>
    buildScheduleFromAvailabilities()
  );
  const [hasExistingAvailability, setHasExistingAvailability] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingDoctors(true);
    setApiError('');

    getDoctors(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setApiError(error.message);

          return;
        }

        const list = Array.isArray(data) ? data : [];

        setDoctors(list);

        if (list.length > 0) {
          const matched =
            doctorIdParam && list.some((d) => d.id === doctorIdParam);
          const initialId = matched ? doctorIdParam : list[0].id;

          setSelectedDoctorId(initialId);

          if (initialId !== doctorIdParam) {
            setSearchParams({ doctorId: initialId }, { replace: true });
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingDoctors(false);
        }
      });

    return () => controller.abort();
  }, [doctorIdParam, setSearchParams]);

  useEffect(() => {
    if (!selectedDoctorId) return;

    const controller = new AbortController();

    setIsLoadingSchedule(true);
    setApiError('');

    getDoctorAvailabilities(selectedDoctorId, controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setApiError(error.message);
          setSchedule(buildScheduleFromAvailabilities());
          setHasExistingAvailability(false);

          return;
        }

        const availabilities = Array.isArray(data) ? data : [];

        setHasExistingAvailability(availabilities.length > 0);
        setSchedule(buildScheduleFromAvailabilities(availabilities));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSchedule(false);
        }
      });

    return () => controller.abort();
  }, [selectedDoctorId]);

  const handleDoctorChange = (event) => {
    const newId = event.target.value;

    setSelectedDoctorId(newId);
    setSearchParams({ doctorId: newId });
  };

  const handleToggleDay = (index) => {
    setSchedule((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, active: !item.active } : item
      )
    );
  };

  const handleTimeChange = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async () => {
    setApiError('');

    if (!selectedDoctorId) {
      setApiError('Debe seleccionar un profesional médico.');

      return;
    }

    const activeDays = schedule.filter((d) => d.active);

    if (activeDays.length === 0) {
      setApiError('Debe activar al menos un día de atención semanal.');

      return;
    }

    for (const dayItem of activeDays) {
      if (dayItem.startTime >= dayItem.endTime) {
        setApiError(
          `En el día ${dayItem.label}, el horario de entrada (${dayItem.startTime}) debe ser anterior al de salida (${dayItem.endTime}).`
        );

        return;
      }
    }

    setIsSubmitting(true);

    const payload = buildAvailabilityPayload(selectedDoctorId, activeDays);

    const result = hasExistingAvailability
      ? await updateDoctorAvailability(payload)
      : await createDoctorAvailability(payload);

    setIsSubmitting(false);

    if (result.error) {
      setApiError(result.error.message);
      showError(result.error.message);

      return;
    }

    setHasExistingAvailability(true);
    const generatedCount = Array.isArray(result.data) ? result.data.length : 0;
    const doctorName = selectedDoctor?.name || 'el profesional';

    showSuccess(
      `Disponibilidad guardada para ${doctorName} (${generatedCount} turnos generados para el mes).`
    );

    navigate(ROUTES.adminDoctors);
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const doctorOptions = [
    {
      value: '',
      label: isLoadingDoctors
        ? 'Cargando doctores…'
        : 'Seleccione un profesional',
    },
    ...doctors.map((doc) => ({
      value: doc.id,
      label: `${doc.name}${doc.specialty?.name ? ` - ${doc.specialty.name}` : ''}`,
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
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
            Disponibilidad Horaria
          </span>
        </nav>

        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="text-sm text-med-text-sub">
          Defina los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </div>

      {apiError && (
        <div
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200"
          role="alert"
        >
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Selección de profesional y ficha */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Card className="flex flex-col gap-4 p-5">
            <FormField
              id="select-doctor-availability"
              label="Seleccionar Profesional"
              labelClassName="text-xs font-bold uppercase tracking-wider text-med-text-sub"
            >
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  value={selectedDoctorId}
                  onChange={handleDoctorChange}
                  options={doctorOptions}
                  disabled={isLoadingDoctors || isSubmitting}
                  className="text-xs"
                />
              )}
            </FormField>

            {selectedDoctor ? (
              <div className="mt-1 flex items-center gap-3.5 rounded-xl border border-[#bae0fd] bg-[#e0f2fe]/70 p-4 shadow-xs">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-med-primary-700 text-xs font-bold text-white shadow-xs">
                  {getDoctorInitials(selectedDoctor.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-med-primary-900">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-xs font-mono text-med-text-sub">
                    Matrícula: {selectedDoctor.licenseNumber || 'Sin matrícula'}
                  </p>
                  <p className="text-xs font-medium text-med-primary-700">
                    {selectedDoctor.specialty?.name || 'Sin especialidad'}
                  </p>
                </div>
              </div>
            ) : (
              !isLoadingDoctors && (
                <p className="text-xs text-med-text-muted italic">
                  Seleccione un médico del listado para configurar su horario.
                </p>
              )
            )}
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-med-border bg-white p-4 shadow-xs">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-med-primary-50 text-med-primary-700 font-bold text-xs">
              i
            </div>
            <p className="text-xs leading-relaxed text-med-text-sub">
              Los cambios realizados se aplicarán a partir de la próxima semana
              calendario. Las citas ya programadas no se verán afectadas
              automáticamente.
            </p>
          </div>
        </div>

        {/* Columna Derecha: Grilla semanal */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-med-border p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-base font-bold text-med-primary-900">
                  Configuración de Horarios
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Horario Regular
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-med-text-sub">
                <Icon icon={ICONS.clock} size={14} />
                <span>Intervalos automáticos de 30 minutos</span>
              </span>
            </div>

            {isLoadingSchedule ? (
              <p className="p-6 text-sm text-med-text-sub" role="status">
                Cargando disponibilidad del profesional…
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-med-border bg-[#e0f2fe]/80 text-xs font-bold uppercase tracking-wider text-med-primary-900/80">
                    <tr>
                      <th className="px-6 py-3.5">Día</th>
                      <th className="px-6 py-3.5">Estado</th>
                      <th className="px-6 py-3.5">Entrada</th>
                      <th className="px-6 py-3.5">Salida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-med-border-subtle">
                    {schedule.map((dayItem, idx) => {
                      const isActive = dayItem.active;

                      return (
                        <tr
                          key={dayItem.day}
                          className={
                            isActive
                              ? 'bg-white transition-colors'
                              : 'bg-gray-50/80 transition-colors'
                          }
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`font-semibold ${
                                isActive
                                  ? 'text-med-primary-900'
                                  : 'text-med-text-muted'
                              }`}
                            >
                              {dayItem.label}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              <ToggleSwitch
                                checked={isActive}
                                onChange={() => handleToggleDay(idx)}
                                disabled={isSubmitting}
                                label={`Alternar disponibilidad del día ${dayItem.label}`}
                              />
                              <span
                                className={`text-xs font-semibold ${
                                  isActive
                                    ? 'text-med-primary-900'
                                    : 'text-gray-400'
                                }`}
                              >
                                {isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                          </td>

                          {['startTime', 'endTime'].map((field) => (
                            <td key={field} className="px-6 py-4">
                              {isActive ? (
                                <div className="relative inline-flex items-center">
                                  <input
                                    type="time"
                                    value={dayItem[field]}
                                    onChange={(e) =>
                                      handleTimeChange(
                                        idx,
                                        field,
                                        e.target.value
                                      )
                                    }
                                    disabled={isSubmitting}
                                    className="w-36 rounded-lg border border-med-border bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-med-primary-900 shadow-xs focus:border-med-primary-500 focus:outline-none focus:ring-1 focus:ring-med-primary-500"
                                  />
                                  <span className="pointer-events-none absolute right-2.5 text-med-text-muted">
                                    <Icon icon={ICONS.clock} size={14} />
                                  </span>
                                </div>
                              ) : (
                                <div className="w-36 rounded-lg border border-gray-200/60 bg-gray-100/90 py-1.5 px-3 text-center font-mono text-xs text-gray-400 select-none">
                                  --:-- --
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-med-border bg-med-bg/20 p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.adminDoctors)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || !selectedDoctor || isLoadingSchedule}
                className="flex items-center gap-2"
              >
                <Icon icon={ICONS.appointments} size={16} />
                <span>
                  {isSubmitting ? 'Guardando…' : 'Guardar Disponibilidad'}
                </span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DoctorSchedulePage;
