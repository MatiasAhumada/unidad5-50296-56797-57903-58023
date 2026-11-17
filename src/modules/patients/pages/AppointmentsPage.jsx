import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePatientAppointments from '../../appointments/hook/usePatientAppointments';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { ROUTES } from '../../shared/constants/appConstants';
import { APPOINTMENT_STATUS_LABELS } from '../../appointments/constants/appointmentStatuses';
import {
  confirmAction,
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';

function AppointmentsPage() {
  const navigate = useNavigate();
  const [includeHistory, setIncludeHistory] = useState(false);
  const {
    appointments,
    cancelAppointment,
    cancellingId,
    isLoading,
    loadError,
    reloadAppointments,
  } = usePatientAppointments(includeHistory);

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';

    const [year, month, day] = date.split('-').map(Number);

    return new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(
      new Date(year, month - 1, day)
    );
  };

  const isFutureAppointment = (appointment) => {
    if (!appointment.date || !appointment.startTime) return false;

    const [year, month, day] = appointment.date.split('-').map(Number);
    const [hours, minutes, seconds = 0] = appointment.startTime
      .split(':')
      .map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds) > new Date();
  };

  const handleCancel = async (appointment) => {
    const confirmed = await confirmAction(
      `¿Querés cancelar este turno con ${appointment.doctor.name}?`,
      {
        title: 'Cancelar turno',
        confirmButtonText: 'Sí, cancelar turno',
      }
    );

    if (!confirmed) return;

    const appointmentId = appointment.id;
    const { error } = await cancelAppointment(appointmentId);

    if (error) {
      showError(
        error.status === 409
          ? 'El turno ya no se puede cancelar. Actualizamos la lista; volvé a revisar su estado.'
          : error.message
      );

      return;
    }

    showSuccess('El turno se canceló correctamente.');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Mis turnos médicos
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            {includeHistory
              ? 'Consultá tus turnos pasados, cancelados y próximos.'
              : 'Consultá tus próximos turnos activos y cancelá los que todavía estén reservados.'}
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.home)}>
          Solicitar nuevo turno
        </Button>
      </div>

      <div
        className="inline-flex w-fit rounded-xl border border-med-border bg-white p-1 shadow-sm"
        role="group"
        aria-label="Filtrar mis turnos"
      >
        <button
          type="button"
          aria-pressed={!includeHistory}
          onClick={() => setIncludeHistory(false)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
            !includeHistory
              ? 'bg-med-primary-900 text-white shadow-sm'
              : 'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900'
          }`}
        >
          Próximos
        </button>
        <button
          type="button"
          aria-pressed={includeHistory}
          onClick={() => setIncludeHistory(true)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${
            includeHistory
              ? 'bg-med-primary-900 text-white shadow-sm'
              : 'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900'
          }`}
        >
          Historial completo
        </button>
      </div>

      {loadError && (
        <div className="flex flex-col items-start gap-3">
          <Button variant="outline" onClick={reloadAppointments}>
            Reintentar
          </Button>
        </div>
      )}
      {isLoading && (
        <p className="text-sm text-med-text-sub" role="status">
          Cargando tus turnos…
        </p>
      )}

      {!isLoading && !loadError && appointments.length === 0 && (
        <Card className="p-6 text-center sm:p-10">
          <h2 className="text-lg font-semibold text-med-primary-900">
            {includeHistory
              ? 'Todavía no hay turnos en tu historial'
              : 'No tenés turnos próximos'}
          </h2>
          <p className="mt-2 text-sm text-med-text-sub">
            {includeHistory
              ? 'Cuando reserves un turno, lo vas a encontrar acá.'
              : 'Cuando reserves un turno, lo vas a encontrar acá. También podés consultar el historial completo.'}
          </p>
          <Button className="mt-5" onClick={() => navigate(ROUTES.home)}>
            Buscar disponibilidad
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {appointments.map((appointment) => {
          const status = appointment.status;
          const canCancel =
            status === 'BOOKED' && isFutureAppointment(appointment);
          const isCancelling = cancellingId === appointment.id;

          return (
            <Card
              key={appointment.id}
              className="flex flex-col justify-between gap-4 p-5 sm:p-6"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
                    {appointment.doctor.specialty.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-med-active-bg px-3 py-1 text-xs font-semibold text-med-active-text">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-current"
                      aria-hidden="true"
                    />
                    {APPOINTMENT_STATUS_LABELS[status] ?? status}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-med-primary-900">
                  {appointment.doctor.name}
                </h2>
                <p className="mt-2 text-sm font-medium text-med-text-main">
                  {formatDate(appointment.date)}
                  {appointment.startTime &&
                    ` · ${appointment.startTime.slice(0, 5)}`}
                  {appointment.endTime && `–${appointment.endTime.slice(0, 5)}`}
                </p>
                <p className="mt-2 text-xs text-med-text-muted">
                  Código de turno: {appointment.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

              {canCancel && (
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={() => handleCancel(appointment)}
                  disabled={Boolean(cancellingId)}
                >
                  Cancelar turno
                </Button>
              )}

              {isCancelling && (
                <p className="text-sm text-med-text-sub" role="status">
                  Cancelando turno…
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AppointmentsPage;
