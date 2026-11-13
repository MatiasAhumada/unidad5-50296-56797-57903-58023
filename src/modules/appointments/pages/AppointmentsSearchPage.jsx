import { useEffect, useMemo, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import TablePagination from '../../shared/components/TablePagination';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import { getDoctors } from '../../doctors/services/doctorsService';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { searchAppointments } from '../services/appointmentsService';
import useNotificationError from '../../shared/notifications/useNotificationError';

const APPOINTMENT_STATUS_LABELS = {
  BOOKED: 'Reservado',
  CANCELLED: 'Cancelado',
  ATTENDED: 'Atendido',
  NO_SHOW: 'Ausente',
};

const EMPTY_FILTERS = {
  dni: '',
  specialtyId: '',
  doctorId: '',
  date: '',
};

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
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

  useNotificationError(catalogError);
  useNotificationError(appointmentsError);

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

        const requestError = specialtiesResult.error || doctorsResult.error;

        if (requestError) {
          setCatalogError(requestError.message);

          return;
        }

        setSpecialties(specialtiesResult.data);
        setDoctors(doctorsResult.data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setCatalogError(getApiErrorMessage(error));
        }
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
        dni: dni || undefined,
        specialtyId: appliedFilters.specialtyId || undefined,
        doctorId: appliedFilters.doctorId || undefined,
        date: appliedFilters.date || undefined,
      },
      controller.signal
    )
      .then((result) => {
        if (controller.signal.aborted) return;

        if (result.error) {
          setAppointmentsError(result.error.message);

          return;
        }

        setAppointmentsPage(result.data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setAppointmentsError(getApiErrorMessage(error));
        }
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
    setAppliedFilters({ ...filters });
    setPageIndex(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPageIndex(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="mt-1 text-sm text-med-text-sub">
          Consultá los turnos registrados según sus filtros.
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

        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-2 lg:grid-cols-5"
        >
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
                  placeholder="Ingresá un DNI"
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
            id="appointment-date-filter"
            label="Fecha"
            labelClassName="text-xs font-semibold text-med-text-sub"
          >
            {(fieldProps) => (
              <Input
                {...fieldProps}
                type="date"
                value={filters.date}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className="px-3 py-2 text-xs"
              />
            )}
          </FormField>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoadingCatalogs || Boolean(catalogError)}
              className="flex flex-1 items-center justify-center gap-2"
            >
              <Icon icon={ICONS.filter} size={16} />
              Aplicar filtros
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Limpiar
            </Button>
          </div>
        </form>
      </Card>

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
            Registros de Citas
          </h2>
        </div>
        {isLoadingAppointments ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Buscando citas…
          </p>
        ) : !appointmentsError && appointmentsPage.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron citas para estos filtros.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Código</th>
                    <th className="px-6 py-3.5">Especialidad y doctor</th>
                    <th className="px-6 py-3.5">Paciente</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {appointmentsPage.data.map((appointment) => (
                    <tr
                      key={appointment.appointmentsId}
                      className="hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4 font-semibold text-med-primary-900">
                        {appointment.appointmentsId.slice(0, 8).toUpperCase()}
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
                          {appointment.patient.fullName ||
                            'Nombre no disponible'}
                        </p>
                        <p className="mt-0.5 text-xs text-med-text-muted">
                          DNI: {appointment.patient.dni}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
                          {APPOINTMENT_STATUS_LABELS[
                            appointment.appointmentsStatus
                          ] ?? appointment.appointmentsStatus}
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
              onPageChange={setPageIndex}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
