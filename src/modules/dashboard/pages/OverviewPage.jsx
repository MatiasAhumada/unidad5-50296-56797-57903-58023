import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import DataTable from '../../shared/components/DataTable';
import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import Input from '../../shared/components/Input';
import { getDashboardSummary } from '../services/dashboardService';
import { getDoctorsPage } from '../../doctors/services/doctorsService';
import { ICONS } from '../../shared/constants/icons';

const PAGE_SIZE = 5;

function OverviewPage() {
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryRequestKey, setSummaryRequestKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [doctorsPage, setDoctorsPage] = useState({
    data: [],
    pageIndex: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });
  const [doctorsError, setDoctorsError] = useState('');
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsRequestKey, setDoctorsRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setSummaryLoading(true);
    setSummaryError('');

    getDashboardSummary(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setSummaryError(error.message);
          setSummary(null);

          return;
        }

        setSummary(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSummaryLoading(false);
      });

    return () => controller.abort();
  }, [summaryRequestKey]);

  useEffect(() => {
    const controller = new AbortController();

    setDoctorsLoading(true);
    setDoctorsError('');

    getDoctorsPage(
      {
        pageSize: PAGE_SIZE,
        pageIndex,
        name: searchTerm.trim() || undefined,
      },
      controller.signal
    )
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setDoctorsError(error.message);

          return;
        }

        setDoctorsPage(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) setDoctorsLoading(false);
      });

    return () => controller.abort();
  }, [doctorsRequestKey, pageIndex, searchTerm]);

  const metrics = [
    {
      label: 'Doctores activos',
      value: summary?.activeDoctors,
      icon: ICONS.doctor,
    },
    {
      label: 'Especialidades activas',
      value: summary?.activeSpecialities,
      icon: ICONS.grid,
    },
    {
      label: 'Turnos confirmados hoy',
      value: summary?.confirmedAppointments,
      icon: ICONS.appointments,
    },
  ];

  const columns = [
    {
      id: 'name',
      header: 'Nombre del doctor',
      accessor: 'name',
      cellClassName: 'font-semibold text-med-primary-900',
    },
    {
      id: 'specialty',
      header: 'Especialidad',
      accessor: (doctor) => doctor.specialty?.name ?? 'Sin especialidad',
      cellClassName: 'text-med-text-sub',
    },
    {
      id: 'availability',
      header: 'Estado de disponibilidad',
      accessor: () => 'No informado por el servicio',
      cellClassName: 'text-med-text-sub',
    },
  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(1);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
          Vista General de Gestión
        </h1>
        <p className="mt-1 text-sm text-med-text-sub">
          Resumen actualizado del sistema de turnos.
        </p>
      </div>

      {summaryError && (
        <div className="flex flex-col items-start gap-2" role="alert">
          <p className="text-sm text-red-800">
            No se pudo cargar el resumen: {summaryError}
          </p>
          <button
            type="button"
            className="text-sm font-semibold text-med-primary-700 underline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => setSummaryRequestKey((key) => key + 1)}
          >
            Reintentar resumen
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="flex flex-col justify-between p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-med-primary-50 text-med-primary-900">
              <Icon icon={metric.icon} size={24} />
            </div>
            <div className="mt-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
                {metric.label}
              </span>
              <p
                className="mt-1 text-3xl font-extrabold text-med-primary-900 sm:text-4xl"
                aria-live="polite"
              >
                {summaryLoading
                  ? 'Cargando…'
                  : summaryError
                    ? 'No disponible'
                    : metric.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <DataTable
        title="Directorio de Profesionales Médicos"
        headerContent={
          <div className="w-full sm:w-72">
            <FormField
              id="dashboard-doctor-search"
              label="Buscar profesionales"
              labelClassName="sr-only"
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
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nombre..."
                    className="bg-med-primary-50/70 py-1.5 pl-9 pr-3 text-xs"
                  />
                </div>
              )}
            </FormField>
          </div>
        }
        columns={columns}
        rows={doctorsPage.data}
        isLoading={doctorsLoading}
        loadingMessage="Cargando profesionales…"
        emptyMessage="No se encontraron profesionales."
        error={doctorsError}
        onRetry={() => setDoctorsRequestKey((key) => key + 1)}
        retryLabel="Reintentar listado"
        pagination={{
          pageIndex: doctorsPage.pageIndex,
          pageSize: doctorsPage.pageSize,
          total: doctorsPage.total,
          onPageChange: setPageIndex,
        }}
      />
    </div>
  );
}

export default OverviewPage;
