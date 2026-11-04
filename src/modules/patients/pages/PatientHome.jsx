import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import { getApiErrorMessage } from '../../shared/api/apiError';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import Select from '../../shared/components/Select';
import StatusMessage from '../../shared/components/StatusMessage';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import { bookAppointment } from '../../appointments/services/appointmentsService';
import {
  getDoctorAvailabilities,
  getDoctorOptions,
} from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import {
  formatSlotDate,
  getSlotDate,
  getSlotDateKey,
  isSlotInFuture,
} from '../../availabilities/helpers/availabilitySlot';

function getBookingErrorMessage(error) {
  if (error?.errorCode === 'APPOINTMENT_CONFLICT') {
    return 'Ese horario acaba de ocuparse. Elegí otro horario disponible.';
  }

  if (error?.errorCode === 'PAST_SLOT') {
    return 'Ese horario ya pasó. Actualizamos la disponibilidad para que elijas otro.';
  }

  if (error?.status === 404) {
    return 'El médico o el horario ya no está disponible. Actualizamos las opciones.';
  }

  return getApiErrorMessage(error);
}

function PatientHome() {
  const navigate = useNavigate();
  const { patientDni } = useAuth();
  const bookingRequestRef = useRef(false);
  const [specialties, setSpecialties] = useState([]);
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [isLoadingSpecialties, setIsLoadingSpecialties] = useState(true);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [specialtyError, setSpecialtyError] = useState('');
  const [doctorError, setDoctorError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [specialtiesRequestKey, setSpecialtiesRequestKey] = useState(0);
  const [doctorsRequestKey, setDoctorsRequestKey] = useState(0);
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingSpecialties(true);
    setSpecialtyError('');

    getSpecialties(controller.signal)
      .then((data) => setSpecialties(data))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setSpecialtyError(getApiErrorMessage(error));
        }
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
      .then((data) => setDoctors(data))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setDoctorError(getApiErrorMessage(error));
        }
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

    getDoctorAvailabilities(doctorId, controller.signal)
      .then((data) => setSlots(data))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setAvailabilityError(getApiErrorMessage(error));
        }
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
    .map((slot) => ({ ...slot, date: getSlotDate(slot.day) }))
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
    setBookingSuccess(null);
    setDoctorError('');
    setAvailabilityError('');
    setBookingError('');
  };

  const handleDoctorChange = (event) => {
    setDoctorId(event.target.value);
    setSelectedSlot(null);
    setSlots([]);
    setBookingSuccess(null);
    setAvailabilityError('');
    setBookingError('');
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
    setBookingError('');
    setBookingSuccess(null);

    try {
      const appointment = await bookAppointment({
        doctorId,
        availabilitySlotId: selectedSlot.id,
        dni: patientDni,
        reason: reason.trim(),
      });

      setBookingSuccess({
        doctorName: selectedDoctor?.name,
        specialtyName: selectedSpecialty?.name,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        appointmentId: appointment.appointmentsId,
      });
      setSelectedSlot(null);
      setReason('');
      setSlotsRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      setBookingError(getBookingErrorMessage(error));

      if (
        error?.errorCode === 'APPOINTMENT_CONFLICT' ||
        error?.errorCode === 'PAST_SLOT' ||
        error?.status === 404
      ) {
        setSelectedSlot(null);
        setSlotsRefreshKey((currentKey) => currentKey + 1);
      }
    } finally {
      bookingRequestRef.current = false;
      setIsBooking(false);
    }
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
            <StatusMessage variant="error">{specialtyError}</StatusMessage>
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
            <StatusMessage variant="error">{doctorError}</StatusMessage>
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
        <Card className="border-med-border p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 border-b border-med-border-subtle pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-med-primary-900">
                Horarios disponibles
              </h2>
              <p className="mt-1 text-sm text-med-text-sub">
                {selectedDoctor?.name}
                {selectedSpecialty ? ` · ${selectedSpecialty.name}` : ''}
              </p>
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
              <StatusMessage variant="error">{availabilityError}</StatusMessage>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(slotsByDate).map(([dateKey, group]) => (
                <section
                  key={dateKey}
                  aria-label={formatSlotDate(group.date)}
                  className="rounded-xl border border-med-border bg-med-bg p-4"
                >
                  <h3 className="mb-3 text-sm font-semibold text-med-primary-900">
                    {formatSlotDate(group.date)}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.slots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setBookingError('');
                            setBookingSuccess(null);
                          }}
                          className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
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
              ))}
            </div>
          )}
        </Card>
      )}

      {bookingError && !selectedSlot && (
        <StatusMessage variant="error">
          {bookingError} Elegí otro horario para continuar.
        </StatusMessage>
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

            {bookingError && (
              <StatusMessage variant="error">{bookingError}</StatusMessage>
            )}

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
            {!patientDni && (
              <StatusMessage variant="error">
                No encontramos el DNI de esta sesión. Cerrá la sesión e ingresá
                nuevamente para reservar.
              </StatusMessage>
            )}
          </form>
        </Card>
      )}

      {bookingSuccess && (
        <StatusMessage variant="success">
          <span className="font-semibold">Turno reservado.</span>{' '}
          {bookingSuccess.doctorName} · {bookingSuccess.specialtyName} ·{' '}
          {formatSlotDate(bookingSuccess.date)} a las {bookingSuccess.startTime}
          .
          {bookingSuccess.appointmentId && (
            <span className="ml-1">
              Código: {bookingSuccess.appointmentId.slice(0, 8).toUpperCase()}.
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            className="ml-2 px-2 py-1 text-sm underline"
            onClick={() => navigate(ROUTES.patientAppointments)}
          >
            Ver mis turnos
          </Button>
        </StatusMessage>
      )}
    </div>
  );
}

export default PatientHome;
