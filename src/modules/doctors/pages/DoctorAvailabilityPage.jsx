import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  getDoctors,
  getDoctorAvailabilities,
  saveDoctorAvailabilities,
} from '../services/doctorsService';
import { getDoctorPhoto } from '../constants/doctorPhotos';

const WEEK_DAYS = [
  { key: 'LUNES',     label: 'Lunes' },
  { key: 'MARTES',    label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES',    label: 'Jueves' },
  { key: 'VIERNES',   label: 'Viernes' },
  { key: 'SABADO',    label: 'Sábado' },
  { key: 'DOMINGO',   label: 'Domingo' },
];

function buildDefaultSchedule() {
  return WEEK_DAYS.map(({ key, label }) => ({
    day: key,
    label,
    active: key !== 'SABADO' && key !== 'DOMINGO',
    startTime: '08:00',
    endTime: '16:00',
  }));
}

export default function DoctorAvailabilityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorIdParam || '');

  const [schedule, setSchedule] = useState(buildDefaultSchedule);
  const [hasExistingAvailability, setHasExistingAvailability] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Cargar lista de médicos
  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingDoctors(true);
    setError('');

    getDoctors(controller.signal, false)
      .then((data) => {
        setDoctors(data);
        if (data.length > 0) {
          // Si el id del param coincide con uno existente, seleccionarlo; si no, elegir el primero
          const matched = doctorIdParam && data.some((d) => d.id === doctorIdParam);
          const initialId = matched ? doctorIdParam : data[0].id;
          setSelectedDoctorId(initialId);
          if (initialId !== doctorIdParam) {
            setSearchParams({ doctorId: initialId }, { replace: true });
          }
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingDoctors(false);
        }
      });

    return () => controller.abort();
  }, [doctorIdParam, setSearchParams]);

  // 2. Cargar disponibilidad cuando cambia el doctor seleccionado
  useEffect(() => {
    if (!selectedDoctorId) return;

    const controller = new AbortController();
    setIsLoadingSchedule(true);
    setError('');
    setSuccessMessage('');

    getDoctorAvailabilities(selectedDoctorId, controller.signal)
      .then((availabilities) => {
        const hasExisting = Array.isArray(availabilities) && availabilities.length > 0;
        setHasExistingAvailability(hasExisting);

        const scheduleMap = new Map();
        if (hasExisting) {
          availabilities.forEach((item) => {
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

        const loadedSchedule = WEEK_DAYS.map(({ key, label }) => {
          const existing = scheduleMap.get(key);
          return {
            day: key,
            label,
            active: Boolean(existing),
            startTime: existing?.startTime || '08:00',
            endTime: existing?.endTime || '16:00',
          };
        });

        setSchedule(loadedSchedule);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSchedule(false);
        }
      });

    return () => controller.abort();
  }, [selectedDoctorId]);

  const handleDoctorChange = (e) => {
    const newId = e.target.value;
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
    setError('');
    setSuccessMessage('');

    if (!selectedDoctorId) {
      setError('Debe seleccionar un profesional médico.');
      return;
    }

    const activeDays = schedule.filter((d) => d.active);
    if (activeDays.length === 0) {
      setError('Debe activar al menos un día de atención semanal.');
      return;
    }

    for (const d of activeDays) {
      if (d.startTime >= d.endTime) {
        setError(
          `En el día ${d.label}, el horario de entrada (${d.startTime}) debe ser anterior al de salida (${d.endTime}).`
        );
        return;
      }
    }

    setIsSaving(true);
    try {
      const toTimeSpan = (hhmm) => (hhmm.length === 5 ? `${hhmm}:00` : hhmm);

      const payload = {
        doctorId: selectedDoctorId,
        days: activeDays.map((d) => ({
          day: d.day,
          startTime: toTimeSpan(d.startTime),
          endTime: toTimeSpan(d.endTime),
        })),
      };

      await saveDoctorAvailabilities(payload, hasExistingAvailability);
      setHasExistingAvailability(true);
      const docName = doctors.find((d) => d.id === selectedDoctorId)?.name || 'el profesional';
      setSuccessMessage(`Disponibilidad horaria configurada con éxito para ${docName}.`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const doctorOptions = doctors.map((doc) => ({
    value: doc.id,
    label: `${doc.name}${doc.specialty?.name ? ` - ${doc.specialty.name}` : ''}`,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Navegación Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-med-text-muted">
        <button
          type="button"
          onClick={() => navigate(ROUTES.adminDoctors)}
          className="hover:text-med-primary-900 transition-colors"
        >
          Doctores
        </button>
        <span>›</span>
        <span className="font-semibold text-med-primary-900">
          Disponibilidad Horaria
        </span>
      </nav>

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="mt-1 text-sm text-med-text-sub">
          Defina los días y rangos horarios de atención para el profesional seleccionado.
        </p>
      </div>

      {/* Mensajes globales */}
      {error && (
        <div>
          <StatusMessage variant="error">{error}</StatusMessage>
        </div>
      )}
      {successMessage && (
        <div>
          <StatusMessage variant="success">{successMessage}</StatusMessage>
        </div>
      )}

      {/* Layout de dos columnas estilo TPI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Selección de profesional y nota informativa */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* Card Selección de Profesional */}
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
                  options={[
                    { value: '', label: isLoadingDoctors ? 'Cargando doctores…' : 'Seleccione un profesional' },
                    ...doctorOptions,
                  ]}
                  disabled={isLoadingDoctors || isSaving}
                  className="text-xs"
                />
              )}
            </FormField>

            {/* Ficha Resumen del Profesional Seleccionado */}
            {selectedDoctor ? (
              <div className="mt-2 flex items-center gap-3.5 rounded-xl border border-[#bae0fd] bg-[#e0f2fe]/70 p-4 shadow-xs">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-med-primary-800 shadow-xs overflow-hidden border border-med-border">
                  {getDoctorPhoto(selectedDoctor) ? (
                    <img
                      src={getDoctorPhoto(selectedDoctor)}
                      alt={selectedDoctor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon icon={ICONS.doctor} size={26} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-med-primary-900">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-xs font-mono text-med-text-sub">
                    ID: MED-{selectedDoctor.licenseNumber || '99201'}
                  </p>
                  <p className="text-xs font-medium text-med-primary-700">
                    {selectedDoctor.specialty?.name || 'Sede Central'}
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

          {/* Tarjeta de Información / Aclaración */}
          <div className="flex items-start gap-3 rounded-xl border border-med-border bg-white p-4 shadow-xs">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-med-primary-50 text-med-primary-700 font-bold text-xs">
              i
            </div>
            <p className="text-xs leading-relaxed text-med-text-sub">
              Los cambios realizados se aplicarán a partir de la próxima semana calendario. Las citas ya programadas no se verán afectadas automáticamente.
            </p>
          </div>
        </div>

        {/* Columna Derecha: Configuración de Horarios */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden p-0">
            {/* Cabecera de la tarjeta */}
            <div className="flex flex-col gap-3 border-b border-med-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-bold text-med-primary-900">
                Configuración de Horarios
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Horario Regular
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-med-text-muted">
                  <Icon icon={ICONS.clock} size={14} />
                  Intervalos automáticos de 30 minutos
                </span>
              </div>
            </div>

            {/* Contenido / Tabla */}
            {isLoadingSchedule ? (
              <div className="flex flex-col items-center justify-center py-16 text-med-text-muted">
                <p className="text-xs">Consultando disponibilidad configurada…</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#bae0fd] bg-[#e0f2fe] text-[11px] font-bold uppercase tracking-wider text-med-primary-900">
                    <tr>
                      <th className="px-6 py-3.5">Día</th>
                      <th className="px-6 py-3.5">Estado</th>
                      <th className="px-6 py-3.5">Entrada</th>
                      <th className="px-6 py-3.5">Salida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-med-border-subtle bg-white">
                    {schedule.map((dayItem, idx) => {
                      const isActive = dayItem.active;
                      return (
                        <tr
                          key={dayItem.day}
                          className={`transition-colors ${
                            isActive
                              ? 'bg-[#ecfccb]/25 hover:bg-[#ecfccb]/45'
                              : 'bg-gray-50/70 text-gray-400'
                          }`}
                        >
                          {/* Columna Día */}
                          <td
                            className={`px-6 py-4 font-semibold ${
                              isActive ? 'text-med-primary-900' : 'text-gray-400'
                            }`}
                          >
                            {dayItem.label}
                          </td>

                          {/* Columna Estado con Toggle Switch */}
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              onClick={() => handleToggleDay(idx)}
                              className="inline-flex items-center gap-2.5 cursor-pointer focus:outline-none"
                            >
                              <span
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
                                  isActive ? 'bg-med-primary-700' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                    isActive ? 'translate-x-4.5' : 'translate-x-1'
                                  }`}
                                />
                              </span>
                              <span
                                className={`text-xs font-semibold ${
                                  isActive
                                    ? 'text-med-primary-900'
                                    : 'text-gray-400'
                                }`}
                              >
                                {isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </button>
                          </td>

                          {/* Columna Entrada */}
                          <td className="px-6 py-4">
                            {isActive ? (
                              <div className="relative inline-flex items-center">
                                <input
                                  type="time"
                                  value={dayItem.startTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      idx,
                                      'startTime',
                                      e.target.value
                                    )
                                  }
                                  disabled={isSaving}
                                  className="w-36 rounded-lg border border-med-border bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-med-primary-900 shadow-xs focus:border-med-primary-500 focus:outline-none focus:ring-1 focus:ring-med-primary-500"
                                />
                                <span className="pointer-events-none absolute right-2.5 text-med-text-muted">
                                  <Icon icon={ICONS.clock} size={14} />
                                </span>
                              </div>
                            ) : (
                              <div className="w-36 rounded-lg border border-gray-200/60 bg-gray-100/90 py-1.5 px-3 text-center font-mono text-xs text-gray-400 select-none shadow-2xs">
                                --:-- --
                              </div>
                            )}
                          </td>

                          {/* Columna Salida */}
                          <td className="px-6 py-4">
                            {isActive ? (
                              <div className="relative inline-flex items-center">
                                <input
                                  type="time"
                                  value={dayItem.endTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      idx,
                                      'endTime',
                                      e.target.value
                                    )
                                  }
                                  disabled={isSaving}
                                  className="w-36 rounded-lg border border-med-border bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-med-primary-900 shadow-xs focus:border-med-primary-500 focus:outline-none focus:ring-1 focus:ring-med-primary-500"
                                />
                                <span className="pointer-events-none absolute right-2.5 text-med-text-muted">
                                  <Icon icon={ICONS.clock} size={14} />
                                </span>
                              </div>
                            ) : (
                              <div className="w-36 rounded-lg border border-gray-200/60 bg-gray-100/90 py-1.5 px-3 text-center font-mono text-xs text-gray-400 select-none shadow-2xs">
                                --:-- --
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pie de acciones */}
            <div className="flex items-center justify-end gap-3 border-t border-med-border bg-med-bg/20 p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.adminDoctors)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !selectedDoctor || isLoadingSchedule}
              >
                <Icon icon={ICONS.appointments} size={16} />
                <span>{isSaving ? 'Guardando…' : 'Guardar Disponibilidad'}</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
