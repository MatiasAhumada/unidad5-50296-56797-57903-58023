import DataTable from '../../shared/components/DataTable';
import { APPOINTMENT_STATUS_LABELS } from '../constants/appointmentStatuses';

function formatAppointmentDate(dateValue) {
  if (!dateValue) return 'Fecha no disponible';

  const [year, month, day] = dateValue.slice(0, 10).split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';

  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(date);
}

const columns = [
  {
    id: 'code',
    header: 'Código',
    accessor: (appointment) => appointment.id.slice(0, 8).toUpperCase(),
    cellClassName: 'font-semibold text-med-primary-900',
  },
  {
    id: 'doctor',
    header: 'Especialidad y doctor',
    render: (appointment) => (
      <>
        <p className="font-semibold text-med-primary-900">
          {appointment.doctor.specialty.name}
        </p>
        <p className="mt-0.5 text-xs text-med-text-muted">
          {appointment.doctor.name}
        </p>
      </>
    ),
  },
  {
    id: 'patient',
    header: 'Paciente',
    render: (appointment) => (
      <>
        <p className="font-semibold text-med-text-main">
          {appointment.patient.fullName || 'Nombre no disponible'}
        </p>
        <p className="mt-0.5 text-xs text-med-text-muted">
          DNI: {appointment.patient.dni}
        </p>
      </>
    ),
  },
  {
    id: 'dateTime',
    header: 'Fecha y horario',
    cellClassName: 'whitespace-nowrap',
    render: (appointment) => (
      <>
        <p className="font-semibold text-med-text-main">
          {formatAppointmentDate(appointment.date)}
        </p>
        <p className="mt-0.5 text-xs text-med-text-muted">
          {appointment.startTime?.slice(0, 5) ?? 'Hora no disponible'}
          {appointment.endTime ? `–${appointment.endTime.slice(0, 5)}` : ''}
        </p>
      </>
    ),
  },
  {
    id: 'status',
    header: 'Estado',
    headerClassName: 'text-center',
    cellClassName: 'text-center',
    render: (appointment) => (
      <span className="inline-flex rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
        {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
      </span>
    ),
  },
];

function AppointmentSearchResults({
  appointmentsPage,
  isLoading,
  error,
  onRetry,
  onPageChange,
}) {
  return (
    <DataTable
      title="Registros de Citas"
      columns={columns}
      rows={appointmentsPage.data}
      isLoading={isLoading}
      loadingMessage="Buscando citas…"
      emptyMessage="No se encontraron citas para estos filtros."
      error={error}
      onRetry={onRetry}
      retryLabel="Reintentar búsqueda"
      pagination={{
        pageIndex: appointmentsPage.pageIndex,
        pageSize: appointmentsPage.pageSize,
        total: appointmentsPage.total,
        onPageChange,
      }}
    />
  );
}

export default AppointmentSearchResults;
