import { useEffect, useMemo, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import TablePagination from '../../shared/components/TablePagination';
import { ICONS } from '../../shared/constants/icons';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import {
  markAppointmentAttendance,
  searchAppointments,
} from '../services/appointmentsService';

const APPOINTMENT_STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'BOOKED', label: 'Reservado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'ATTENDED', label: 'Atendido' },
  { value: 'NO_SHOW', label: 'Ausente' },
];

const STATUS_PARAM_MAP = {
  BOOKED: 'Booked',
  CANCELLED: 'Cancelled',
  ATTENDED: 'Attended',
  NO_SHOW: 'NoShow',
};

const STATUS_CONFIG = {
  BOOKED: {
    label: 'Reservado',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
  ATTENDED: {
    label: 'Atendido',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  NO_SHOW: {
    label: 'Ausente',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
};

function formatAppointmentDate(dateStr, timeStr) {
  if (!dateStr) {
    return 'Sin fecha';
  }

  try {
    const [year, month, day] = dateStr.slice(0, 10).split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDate = new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);

    const formattedTime = timeStr ? ` ${timeStr.slice(0, 5)} hs` : '';

    return `${formattedDate}${formattedTime}`;
  } catch {
    return dateStr;
  }
}

const EMPTY_FILTERS = {
  dni: '',
  specialtyId: '',
  doctorId: '',
  status: '',
  startDate: '',
  endDate: '',
};

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [validationError, setValidationError] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState({
    data: [],
    pageSize: 10,
    total: 0,
  });
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [catalogError, setCatalogError] = useState('');
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [catalogRequestKey, setCatalogRequestKey] = useState(0);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [appointmentsRequestKey, setAppointmentsRequestKey] = useState(0);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingCatalogs(true);
    setCatalogError('');

    Promise.all([
      getSpecialties(controller.signal),
      getDoctors(controller.signal),
    ])
      .then(([specialtiesResult, doctorsResult]) => {
        if (controller.signal.aborted) return;

        const error = specialtiesResult.error || doctorsResult.error;

        if (error) {
          setCatalogError(error.message);

          return;
        }

        setSpecialties(specialtiesResult.data);
        setDoctors(doctorsResult.data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingCatalogs(false);
        }
      });

    return () => controller.abort();
  }, [catalogRequestKey]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoadingAppointments(true);
    setAppointmentsError('');
    const dni = appliedFilters.dni.replace(/\D/g, '');

    searchAppointments(
      {
        pageSize: 10,
        pageIndex,
        dni: dni ? Number(dni) : undefined,
        specialtyId: appliedFilters.specialtyId || undefined,
        doctorId: appliedFilters.doctorId || undefined,
        status: appliedFilters.status
          ? STATUS_PARAM_MAP[appliedFilters.status] || appliedFilters.status
          : undefined,
        startDate: appliedFilters.startDate || undefined,
        endDate: appliedFilters.endDate || undefined,
      },
      controller.signal
    )
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setAppointmentsError(error.message);

          return;
        }

        setAppointmentsPage(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingAppointments(false);
        }
      });

    return () => controller.abort();
  }, [appliedFilters, appointmentsRequestKey, pageIndex]);

  const visibleDoctors = useMemo(() => {
    if (!filters.specialtyId) {
      return doctors;
    }

    return doctors.filter(
      (doctor) => doctor.specialty?.id === filters.specialtyId
    );
  }, [doctors, filters.specialtyId]);

  const specialtyOptions = [
    { value: '', label: 'Todas las especialidades' },
    ...specialties.map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    })),
  ];

  const doctorOptions = [
    { value: '', label: 'Todos los doctores' },
    ...visibleDoctors.map((doctor) => ({
      value: doctor.id,
      label: doctor.name,
    })),
  ];

  const applyFilters = (event) => {
    event.preventDefault();

    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      setValidationError(
        'La fecha de inicio no puede ser posterior a la fecha de fin.'
      );

      return;
    }

    setValidationError('');
    setActionSuccess('');
    setActionError('');
    setAppliedFilters({ ...filters });
    setPageIndex(1);
  };

  const clearFilters = () => {
    setValidationError('');
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPageIndex(1);
  };

  const handleAttendanceChange = async (appointmentId, attended) => {
    setUpdatingAppointmentId(appointmentId);
    setActionSuccess('');
    setActionError('');

    const { error } = await markAppointmentAttendance(appointmentId, attended);

    if (error) {
      setActionError(error.message);
    } else {
      setActionSuccess(
        `Turno marcado como ${attended ? 'asistido' : 'ausente'} correctamente.`
      );
      setAppointmentsRequestKey((k) => k + 1);
    }

    setUpdatingAppointmentId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="mt-1 text-sm text-med-text-sub">
          Gestione y supervise el flujo de turnos y pacientes del centro médico.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <div className="mb-4 border-b border-med-border-subtle pb-4">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de búsqueda
          </h2>
        </div>

        {catalogError && (
          <div className="mb-4 flex flex-col items-start gap-3">
            <StatusMessage variant="error">{catalogError}</StatusMessage>
            <button
              type="button"
              className="text-sm font-semibold text-med-primary-700 underline"
              onClick={() => setCatalogRequestKey((key) => key + 1)}
            >
              Reintentar catálogos
            </button>
          </div>
        )}

        {validationError && (
          <div className="mb-4">
            <StatusMessage variant="error">{validationError}</StatusMessage>
          </div>
        )}

        <form onSubmit={applyFilters} className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              id="appointment-patient-dni"
              label="DNI del paciente"
              labelClassName="text-xs font-semibold text-med-text-sub"
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
                    type="text"
                    inputMode="numeric"
                    placeholder="Ingresá un DNI (ej: 30123456)"
                    value={filters.dni}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        dni: event.target.value,
                      }))
                    }
                    className="pl-9 pr-3 py-2 text-xs"
                  />
                </div>
              )}
            </FormField>

            <FormField
              id="appointment-specialty-filter"
              label="Especialidad"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  value={filters.specialtyId}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      specialtyId: event.target.value,
                      doctorId: '',
                    }))
                  }
                  disabled={isLoadingCatalogs || Boolean(catalogError)}
                  options={specialtyOptions}
                  className="px-3 py-2 text-xs"
                />
              )}
            </FormField>

            <FormField
              id="appointment-doctor-filter"
              label="Doctor"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  value={filters.doctorId}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      doctorId: event.target.value,
                    }))
                  }
                  disabled={isLoadingCatalogs || Boolean(catalogError)}
                  options={doctorOptions}
                  className="px-3 py-2 text-xs"
                />
              )}
            </FormField>

            <FormField
              id="appointment-status-filter"
              label="Estado del turno"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  options={APPOINTMENT_STATUS_OPTIONS}
                  className="px-3 py-2 text-xs"
                />
              )}
            </FormField>

            <FormField
              id="appointment-start-date"
              label="Fecha Desde"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                  className="px-3 py-2 text-xs"
                />
              )}
            </FormField>

            <FormField
              id="appointment-end-date"
              label="Fecha Hasta"
              labelClassName="text-xs font-semibold text-med-text-sub"
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                  className="px-3 py-2 text-xs"
                />
              )}
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
            <Button
              type="submit"
              disabled={isLoadingCatalogs || Boolean(catalogError)}
              className="flex items-center justify-center gap-2"
            >
              <Icon icon={ICONS.filter} size={16} />
              Aplicar filtros
            </Button>
          </div>
        </form>
      </Card>

      {actionSuccess && (
        <StatusMessage variant="success">{actionSuccess}</StatusMessage>
      )}

      {actionError && (
        <StatusMessage variant="error">{actionError}</StatusMessage>
      )}

      {appointmentsError && (
        <div className="flex flex-col items-start gap-3">
          <StatusMessage variant="error">{appointmentsError}</StatusMessage>
          <button
            type="button"
            className="text-sm font-semibold text-med-primary-700 underline"
            onClick={() => setAppointmentsRequestKey((key) => key + 1)}
          >
            Reintentar búsqueda
          </button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-med-border p-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas ({appointmentsPage.total})
          </h2>
        </div>

        {isLoadingAppointments ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Buscando citas…
          </p>
        ) : !appointmentsError && appointmentsPage.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron citas con los filtros aplicados.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Código</th>
                    <th className="px-6 py-3.5">Fecha y Horario</th>
                    <th className="px-6 py-3.5">Especialidad y Profesional</th>
                    <th className="px-6 py-3.5">Paciente</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5 text-right">Asistencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {appointmentsPage.data.map((appointment) => {
                    const rawStatus = (
                      appointment.appointmentsStatus || ''
                    ).toUpperCase();
                    const statusConfig =
                      STATUS_CONFIG[rawStatus] || STATUS_CONFIG.BOOKED;
                    const isBooked = rawStatus === 'BOOKED';
                    const isUpdating =
                      updatingAppointmentId === appointment.appointmentsId;

                    return (
                      <tr
                        key={appointment.appointmentsId}
                        className="hover:bg-gray-50/70 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-med-primary-900">
                          {appointment.appointmentsId.slice(0, 8).toUpperCase()}
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-med-text-main">
                          {formatAppointmentDate(
                            appointment.date,
                            appointment.startTime
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold text-med-primary-900">
                            {appointment.doctor?.specialty?.name ??
                              'Sin especialidad'}
                          </p>
                          <p className="mt-0.5 text-xs text-med-text-muted">
                            {appointment.doctor?.name ?? 'Médico no asignado'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-semibold text-med-text-main">
                            {appointment.patient?.fullName ||
                              'Nombre no registrado'}
                          </p>
                          <p className="mt-0.5 text-xs text-med-text-muted">
                            DNI: {appointment.patient?.dni}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.className}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {isBooked ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleAttendanceChange(
                                    appointment.appointmentsId,
                                    true
                                  )
                                }
                                className="rounded px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition"
                                title="Marcar como atendido"
                              >
                                {isUpdating ? '...' : 'Presente'}
                              </button>
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleAttendanceChange(
                                    appointment.appointmentsId,
                                    false
                                  )
                                }
                                className="rounded px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 transition"
                                title="Marcar como ausente"
                              >
                                {isUpdating ? '...' : 'Ausente'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-med-text-muted">
                              Registrado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={pageIndex}
              pageSize={appointmentsPage.pageSize}
              totalItems={appointmentsPage.total}
              totalPages={
                Math.ceil(appointmentsPage.total / appointmentsPage.pageSize) ||
                1
              }
              onPageChange={setPageIndex}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
