import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import TablePagination from '../../shared/components/TablePagination';
import { APPOINTMENT_STATUS_LABELS } from '../constants/appointmentStatuses';

function formatAppointmentDate(dateValue) {
  if (!dateValue) return 'Fecha no disponible';

  const [year, month, day] = dateValue.slice(0, 10).split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';

  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(date);
}

function AppointmentSearchResults({
  appointmentsPage,
  isLoading,
  error,
  onRetry,
  onPageChange,
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-med-border p-5">
        <h2 className="text-base font-bold text-med-primary-900">
          Registros de Citas
        </h2>
      </div>
      {isLoading ? (
        <p className="p-5 text-sm text-med-text-sub" role="status">
          Buscando citas…
        </p>
      ) : error ? (
        <div className="flex flex-col items-start gap-3 p-5">
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
          <Button variant="outline" onClick={onRetry}>
            Reintentar búsqueda
          </Button>
        </div>
      ) : appointmentsPage.data.length === 0 ? (
        <p className="p-5 text-sm text-med-text-sub">
          No se encontraron citas para estos filtros.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] tracking-wider text-med-text-sub uppercase">
                <tr>
                  <th className="px-6 py-3.5">Código</th>
                  <th className="px-6 py-3.5">Especialidad y doctor</th>
                  <th className="px-6 py-3.5">Paciente</th>
                  <th className="px-6 py-3.5">Fecha y horario</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-med-border-subtle">
                {appointmentsPage.data.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-4 font-semibold text-med-primary-900">
                      {appointment.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-primary-900">
                        {appointment.doctor.specialty.name}
                      </p>
                      <p className="mt-0.5 text-xs text-med-text-muted">
                        {appointment.doctor.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-text-main">
                        {appointment.patient.fullName || 'Nombre no disponible'}
                      </p>
                      <p className="mt-0.5 text-xs text-med-text-muted">
                        DNI: {appointment.patient.dni}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-med-text-main">
                        {formatAppointmentDate(appointment.date)}
                      </p>
                      <p className="mt-0.5 text-xs text-med-text-muted">
                        {appointment.startTime?.slice(0, 5) ??
                          'Hora no disponible'}
                        {appointment.endTime
                          ? `–${appointment.endTime.slice(0, 5)}`
                          : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
                        {APPOINTMENT_STATUS_LABELS[appointment.status] ??
                          appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            currentPage={appointmentsPage.pageIndex}
            pageSize={appointmentsPage.pageSize}
            totalItems={appointmentsPage.total}
            totalPages={Math.ceil(
              appointmentsPage.total / appointmentsPage.pageSize
            )}
            onPageChange={onPageChange}
          />
        </>
      )}
    </Card>
  );
}

export default AppointmentSearchResults;
