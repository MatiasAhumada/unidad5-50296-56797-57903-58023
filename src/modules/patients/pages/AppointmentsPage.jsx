import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePatientAppointments from '../../appointments/hook/usePatientAppointments';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import StatusMessage from '../../shared/components/StatusMessage';
import { ROUTES } from '../../shared/constants/appConstants';

const APPOINTMENT_STATUS_LABELS = {
  BOOKED: 'Reservado',
  CANCELLED: 'Cancelado',
  ATTENDED: 'Atendido',
  NO_SHOW: 'Ausente',
};

function AppointmentsPage() {
  const navigate = useNavigate();
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const {
    actionError,
    appointments,
    cancelAppointment,
    cancellingId,
    isLoading,
    loadError,
    reloadAppointments,
    successMessage,
  } = usePatientAppointments();

  const handleCancel = async (appointmentId) => {
    await cancelAppointment(appointmentId);
    setAppointmentToCancel(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Mis turnos médicos
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Consultá tus turnos activos y cancelá los que todavía estén
            reservados.
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.home)}>
          Solicitar nuevo turno
        </Button>
      </div>

      {successMessage && (
        <StatusMessage variant="success">{successMessage}</StatusMessage>
      )}
      {actionError && (
        <StatusMessage variant="error">{actionError}</StatusMessage>
      )}
      {loadError && (
        <div className="flex flex-col items-start gap-3">
          <StatusMessage variant="error">{loadError}</StatusMessage>
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
            No tenés turnos activos
          </h2>
          <p className="mt-2 text-sm text-med-text-sub">
            Cuando reserves un turno, lo vas a encontrar acá.
          </p>
          <Button className="mt-5" onClick={() => navigate(ROUTES.home)}>
            Buscar disponibilidad
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {appointments.map((appointment) => {
          const status = appointment.appointmentsStatus;
          const canCancel = status === 'BOOKED';
          const isConfirming =
            appointmentToCancel === appointment.appointmentsId;
          const isCancelling = cancellingId === appointment.appointmentsId;

          return (
            <Card
              key={appointment.appointmentsId}
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
                <p className="mt-2 text-xs text-med-text-muted">
                  Código de turno:{' '}
                  {appointment.appointmentsId.slice(0, 8).toUpperCase()}
                </p>
              </div>

              {canCancel && !isConfirming && (
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={() =>
                    setAppointmentToCancel(appointment.appointmentsId)
                  }
                  disabled={Boolean(cancellingId)}
                >
                  Cancelar turno
                </Button>
              )}

              {isConfirming && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-900">
                    ¿Querés cancelar este turno con {appointment.doctor.name}?
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="danger"
                      className="w-full text-sm"
                      onClick={() => handleCancel(appointment.appointmentsId)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? 'Cancelando…' : 'Sí, cancelar turno'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-sm"
                      onClick={() => setAppointmentToCancel(null)}
                      disabled={isCancelling}
                    >
                      Volver
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default AppointmentsPage;
