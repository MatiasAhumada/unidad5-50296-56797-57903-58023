import { useEffect, useRef, useState } from 'react';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import Select from '../../shared/components/Select';
import StatusMessage from '../../shared/components/StatusMessage';
import { ICONS } from '../../shared/constants/icons';
import { bookAppointment } from '../../appointments/services/appointmentsService';
import { getAppointmentErrorMessage } from '../../appointments/helpers/appointmentError';
import {
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';
import {
  getDoctorAvailableSlots,
  getDoctorOptions,
} from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import useNotificationError from '../../shared/notifications/useNotificationError';
import {
  formatSlotDate,
  getSlotDate,
  getSlotDateKey,
  isSlotInFuture,
} from '../../availabilities/helpers/availabilitySlot';

function startOfWeek(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysFromMonday = (monday.getDay() + 6) % 7;

  monday.setDate(monday.getDate() - daysFromMonday);

  return monday;
}

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function formatCalendarDay(date, options) {
  return new Intl.DateTimeFormat('es-AR', options).format(date);
}

function PatientHome() {
  const { patientDni } = useAuth();
  const bookingRequestRef = useRef(false);
  const [specialties, setSpecialties] = useState([]);
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    getSlotDateKey(new Date())
  );
  const [reason, setReason] = useState('');
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [specialtyError, setSpecialtyError] = useState('');
  const [doctorError, setDoctorError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [specialtiesRequestKey, setSpecialtiesRequestKey] = useState(0);
  const [doctorsRequestKey, setDoctorsRequestKey] = useState(0);
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);

  useNotificationError(specialtyError);
  useNotificationError(doctorError);
  useNotificationError(availabilityError);
  useNotificationError(
    patientDni
      ? ''
      : 'No encontramos el DNI de esta sesión. Cerrá la sesión e ingresá nuevamente para reservar.'
  );

  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingSpecialties(true);
    setSpecialtyError('');

    getSpecialties(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setSpecialtyError(error.message);

          return;
        }

        setSpecialties(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSpecialties(false);
        }
      });

    return () => controller.abort();
  }, [specialtiesRequestKey]);

  useEffect(() => {
    if (!specialtyId) {
      setDoctors([]);
      setIsLoadingDoctors(false);

      return undefined;
    }

    const controller = new AbortController();

    setIsLoadingDoctors(true);
    setDoctorError('');

    getDoctorOptions(specialtyId, controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setDoctorError(error.message);

          return;
        }

        setDoctors(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingDoctors(false);
        }
      });

    return () => controller.abort();
  }, [specialtyId, doctorsRequestKey]);

  useEffect(() => {
    if (!doctorId) {
      setSlots([]);
      setIsLoadingSlots(false);

      return undefined;
    }

    const controller = new AbortController();

    setIsLoadingSlots(true);
    setAvailabilityError('');

    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    getDoctorAvailableSlots(
      doctorId,
      getSlotDateKey(today),
      getSlotDateKey(endDate),
      controller.signal
    )
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setAvailabilityError(error.message);

          return;
        }

        setSlots(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      });

    return () => controller.abort();
  }, [doctorId, slotsRefreshKey]);

  const selectedSpecialty = specialties.find(
    (specialty) => specialty.id === specialtyId
  );
  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
  const futureSlots = slots
    .filter((slot) => slot.id && isSlotInFuture(slot))
    .map((slot) => ({ ...slot, date: getSlotDate(slot.date) }))
    .filter((slot) => slot.date)
    .sort((first, second) => {
      const dateDifference = first.date - second.date;

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return first.startTime.localeCompare(second.startTime);
    });
  const slotsByDate = futureSlots.reduce((groups, slot) => {
    const dateKey = getSlotDateKey(slot.date);

    if (!groups[dateKey]) {
      groups[dateKey] = { date: slot.date, slots: [] };
    }

    groups[dateKey].slots.push(slot);

    return groups;
  }, {});
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index)
  );
  const selectedDateSlots = slotsByDate[selectedDateKey]?.slots ?? [];
  const weekHasSlots = weekDays.some(
    (day) => (slotsByDate[getSlotDateKey(day)]?.slots.length ?? 0) > 0
  );
  const earliestWeek = startOfWeek(new Date());
  const latestSlotDate = futureSlots.at(-1)?.date ?? new Date();
  const latestWeek = startOfWeek(latestSlotDate);
  const canGoToPreviousWeek = weekStart > earliestWeek;
  const canGoToNextWeek = addDays(weekStart, 7) <= latestWeek;
  const noDoctorsForSpecialty =
    specialtyId && !isLoadingDoctors && !doctorError && doctors.length === 0;
  const noFutureSlots =
    !isLoadingSlots && !availabilityError && futureSlots.length === 0;

  const handleSpecialtyChange = (event) => {
    setSpecialtyId(event.target.value);
    setDoctorId('');
    setDoctors([]);
    setSelectedSlot(null);
    setSlots([]);
    setDoctorError('');
    setAvailabilityError('');
    setWeekStart(startOfWeek(new Date()));
    setSelectedDateKey(getSlotDateKey(new Date()));
  };

  const handleDoctorChange = (event) => {
    setDoctorId(event.target.value);
    setSelectedSlot(null);
    setSlots([]);
    setAvailabilityError('');
    setWeekStart(startOfWeek(new Date()));
    setSelectedDateKey(getSlotDateKey(new Date()));
  };

  const handleWeekChange = (direction) => {
    const nextWeek = addDays(weekStart, direction * 7);

    setWeekStart(nextWeek);
    const firstAvailableDay = Array.from({ length: 7 }, (_, index) =>
      getSlotDateKey(addDays(nextWeek, index))
    ).find((dateKey) => slotsByDate[dateKey]?.slots.length > 0);

    setSelectedDateKey(firstAvailableDay ?? getSlotDateKey(nextWeek));
    setSelectedSlot(null);
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    if (
      bookingRequestRef.current ||
      !selectedSlot ||
      !doctorId ||
      !patientDni ||
      reason.trim().length < 5
    ) {
      return;
    }

    bookingRequestRef.current = true;
    setIsBooking(true);

    const { data: appointment, error } = await bookAppointment({
      doctorId,
      availabilitySlotId: selectedSlot.id,
      dni: patientDni,
      reason: reason.trim(),
    });

    if (error) {
      showError(getAppointmentErrorMessage(error));

      if (
        error.errorCode === 'APPOINTMENT_CONFLICT' ||
        error.errorCode === 'PAST_SLOT' ||
        error.status === 404
      ) {
        setSelectedSlot(null);
        setSlotsRefreshKey((currentKey) => currentKey + 1);
      }
    } else {
      showSuccess(
        `Turno reservado para ${selectedDoctor?.name} · ${selectedSpecialty?.name} · ${formatSlotDate(selectedSlot.date)} a las ${selectedSlot.startTime}. Código: ${appointment.id.slice(0, 8).toUpperCase()}.`
      );
      setSelectedSlot(null);
      setReason('');
      setSlotsRefreshKey((currentKey) => currentKey + 1);
    }

    bookingRequestRef.current = false;
    setIsBooking(false);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Card className="p-5 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-med-primary-900 sm:text-3xl">
            Reservar turno médico
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Elegí una especialidad, un profesional y un horario disponible.
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <FormField
            id="patient-specialty"
            label="Especialidad"
            className="md:col-span-1"
          >
            {(fieldProps) => (
              <Select
                {...fieldProps}
                value={specialtyId}
                onChange={handleSpecialtyChange}
                disabled={isLoadingSpecialties || Boolean(specialtyError)}
                options={[
                  { value: '', label: 'Seleccioná una especialidad' },
                  ...specialties.map((specialty) => ({
                    value: specialty.id,
                    label: specialty.name,
                  })),
                ]}
              />
            )}
          </FormField>

          <FormField id="patient-doctor" label="Profesional">
            {(fieldProps) => (
              <Select
                {...fieldProps}
                value={doctorId}
                onChange={handleDoctorChange}
                disabled={
                  !specialtyId || isLoadingDoctors || Boolean(doctorError)
                }
                options={[
                  {
                    value: '',
                    label: isLoadingDoctors
                      ? 'Cargando profesionales…'
                      : 'Seleccioná un profesional',
                  },
                  ...doctors.map((doctor) => ({
                    value: doctor.id,
                    label: doctor.name,
                  })),
                ]}
              />
            )}
          </FormField>
        </div>

        {isLoadingSpecialties && (
          <p className="mt-4 text-sm text-med-text-sub" role="status">
            Cargando especialidades…
          </p>
        )}
        {specialtyError && (
          <div className="mt-4 flex flex-col items-start gap-3">
            <Button
              variant="outline"
              onClick={() => setSpecialtiesRequestKey((key) => key + 1)}
            >
              Reintentar
            </Button>
          </div>
        )}
        {noDoctorsForSpecialty && (
          <div className="mt-4">
            <StatusMessage>
              No hay profesionales disponibles para esta especialidad.
            </StatusMessage>
          </div>
        )}
        {doctorError && (
          <div className="mt-4 flex flex-col items-start gap-3">
            <Button
              variant="outline"
              onClick={() => setDoctorsRequestKey((key) => key + 1)}
            >
              Reintentar
            </Button>
          </div>
        )}
      </Card>

      {doctorId && (
        <Card className="flex items-center gap-4 border-med-primary-100 p-5 sm:p-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-med-primary-100 text-med-primary-800">
            <Icon icon={ICONS.doctor} size={28} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-med-text-muted">
              Profesional seleccionado
            </p>
            <h2 className="mt-1 text-lg font-bold text-med-primary-900">
              {selectedDoctor?.name}
            </h2>
            <p className="text-sm text-med-text-sub">
              {selectedSpecialty?.name}
            </p>
          </div>
          {selectedSlot && (
            <div className="ml-auto hidden rounded-xl bg-med-primary-50 px-4 py-3 text-right sm:block">
              <p className="text-xs font-medium text-med-text-sub">
                Horario seleccionado
              </p>
              <p className="mt-1 text-sm font-bold text-med-primary-900">
                {formatSlotDate(selectedSlot.date)} · {selectedSlot.startTime}
              </p>
            </div>
          )}
        </Card>
      )}

      {doctorId && (
        <Card className="border-med-border p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 border-b border-med-border-subtle pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-med-primary-900">
                Horarios disponibles
              </h2>
            </div>
            <p className="text-xs text-med-text-muted">
              Los horarios se confirman al reservar.
            </p>
          </div>

          {isLoadingSlots && (
            <p className="text-sm text-med-text-sub" role="status">
              Buscando horarios disponibles…
            </p>
          )}
          {availabilityError && (
            <div className="flex flex-col items-start gap-3">
              <Button
                variant="outline"
                onClick={() => setSlotsRefreshKey((key) => key + 1)}
              >
                Reintentar
              </Button>
            </div>
          )}
          {noFutureSlots && (
            <StatusMessage>
              No hay horarios futuros disponibles para este profesional.
            </StatusMessage>
          )}

          {Object.entries(slotsByDate).length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleWeekChange(-1)}
                  disabled={!canGoToPreviousWeek}
                  aria-label="Ver semana anterior"
                >
                  Anterior
                </Button>
                <p className="text-sm font-semibold text-med-primary-900">
                  Semana del {formatSlotDate(weekStart)}
                </p>
                <Button
                  variant="outline"
                  onClick={() => handleWeekChange(1)}
                  disabled={!canGoToNextWeek}
                  aria-label="Ver semana siguiente"
                >
                  Siguiente
                </Button>
              </div>

              {!weekHasSlots && (
                <div className="mb-4">
                  <StatusMessage>
                    No hay horarios disponibles esta semana. Podés avanzar a la
                    siguiente.
                  </StatusMessage>
                </div>
              )}

              <div className="mb-4 grid grid-cols-7 gap-1 sm:hidden">
                {weekDays.map((day) => {
                  const dateKey = getSlotDateKey(day);
                  const isSelected = selectedDateKey === dateKey;
                  const slotCount = slotsByDate[dateKey]?.slots.length ?? 0;

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedDateKey(dateKey);
                        setSelectedSlot(null);
                      }}
                      className={`flex min-h-16 flex-col items-center justify-center rounded-lg border px-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
                        isSelected
                          ? 'border-med-primary-900 bg-med-primary-900 text-white'
                          : 'border-med-border bg-white text-med-primary-900'
                      }`}
                    >
                      <span className="capitalize">
                        {formatCalendarDay(day, { weekday: 'short' })}
                      </span>
                      <span className="mt-1 font-bold">
                        {formatCalendarDay(day, { day: 'numeric' })}
                      </span>
                      {slotCount > 0 && (
                        <span className="mt-1 text-[10px]">
                          {slotCount} turnos
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="hidden grid-cols-7 gap-2 sm:grid">
                {weekDays.map((day) => {
                  const dateKey = getSlotDateKey(day);
                  const daySlots = slotsByDate[dateKey]?.slots ?? [];

                  return (
                    <section
                      key={dateKey}
                      aria-label={formatSlotDate(day)}
                      className="min-h-48 rounded-xl border border-med-border bg-med-bg p-2 lg:p-3"
                    >
                      <h3 className="mb-3 text-center text-xs font-semibold capitalize text-med-primary-900">
                        {formatCalendarDay(day, {
                          weekday: 'short',
                          day: 'numeric',
                        })}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {daySlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setSelectedSlot(slot)}
                              className={`min-h-10 rounded-lg border px-2 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
                                isSelected
                                  ? 'border-med-primary-900 bg-med-primary-900 text-white'
                                  : 'border-med-border bg-white text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50'
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>

              <section className="sm:hidden" aria-live="polite">
                <h3 className="mb-3 text-sm font-semibold text-med-primary-900">
                  {formatSlotDate(getSlotDate(selectedDateKey))}
                </h3>
                {selectedDateSlots.length === 0 ? (
                  <StatusMessage>No hay horarios para este día.</StatusMessage>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDateSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedSlot(slot)}
                          className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
                            isSelected
                              ? 'border-med-primary-900 bg-med-primary-900 text-white'
                              : 'border-med-border bg-white text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </Card>
      )}

      {selectedSlot && (
        <Card className="border-med-primary-200 bg-med-primary-50 p-5 sm:p-6">
          <form
            onSubmit={handleBookAppointment}
            className="flex flex-col gap-4"
          >
            <div>
              <h2 className="text-lg font-bold text-med-primary-900">
                Confirmá tu turno
              </h2>
              <p className="mt-1 text-sm text-med-text-sub">
                {selectedDoctor?.name} · {selectedSpecialty?.name} ·{' '}
                {formatSlotDate(selectedSlot.date)} a las{' '}
                {selectedSlot.startTime}
              </p>
            </div>

            <FormField
              id="appointment-reason"
              label="Motivo de la consulta"
              hint="Escribí al menos 5 caracteres."
              required
            >
              {(fieldProps) => (
                <textarea
                  {...fieldProps}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  minLength={5}
                  rows={3}
                  className="w-full resize-y rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600"
                  placeholder="Contanos brevemente el motivo"
                />
              )}
            </FormField>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-med-text-sub">
                Duración estimada: 30 minutos.
              </p>
              <Button
                type="submit"
                disabled={
                  isBooking ||
                  reason.trim().length < 5 ||
                  !patientDni ||
                  isLoadingSlots
                }
                className="inline-flex items-center justify-center gap-2"
              >
                {isBooking ? 'Reservando…' : 'Reservar turno'}
                {!isBooking && <Icon icon={ICONS.checkCircle} size={18} />}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default PatientHome;
