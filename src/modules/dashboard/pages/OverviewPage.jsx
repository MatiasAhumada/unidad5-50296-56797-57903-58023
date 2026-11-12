import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/appConstants';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import { ICONS } from '../../shared/constants/icons';
import { getDashboardSummary } from '../services/dashboardService';
import { getDoctorsPage } from '../../doctors/services/doctorsService';

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function OverviewPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryRequestKey, setSummaryRequestKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorsPage, setDoctorsPage] = useState({ data: [], total: 0 });
  const [doctorsError, setDoctorsError] = useState('');
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsRequestKey, setDoctorsRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setSummaryLoading(true);
    setSummaryError('');

    getDashboardSummary(getTodayDate(), controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return;

        if (error) {
          setSummaryError(error.message);

          return;
        }

        setSummary(data);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSummaryLoading(false);
        }
      });

    return () => controller.abort();
  }, [summaryRequestKey]);

  useEffect(() => {
    const controller = new AbortController();

    setDoctorsLoading(true);
    setDoctorsError('');

    getDoctorsPage(
      {
        pageSize: 5,
        pageIndex: 1,
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
        if (!controller.signal.aborted) {
          setDoctorsLoading(false);
        }
      });

    return () => controller.abort();
  }, [doctorsRequestKey, searchTerm]);

  const metricCards = [
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Vista General de Gestión
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Resumen actualizado del sistema de turnos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => navigate(ROUTES.adminDoctors)}>
            Ver doctores
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.adminSpecialties)}
          >
            Ver especialidades
          </Button>
        </div>
      </div>

      {summaryError && (
        <div className="flex flex-col items-start gap-3">
          <StatusMessage variant="error">{summaryError}</StatusMessage>
          <button
            type="button"
            className="text-sm font-semibold text-med-primary-700 underline"
            onClick={() => setSummaryRequestKey((key) => key + 1)}
          >
            Reintentar resumen
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {metricCards.map((metric) => (
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
              <p className="mt-1 text-3xl font-extrabold text-med-primary-900 sm:text-4xl">
                {summaryLoading ? '…' : (metric.value ?? '—')}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-med-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-med-primary-900">
            Profesionales médicos
          </h2>
          <div className="relative w-full sm:w-72">
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
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre..."
                    className="bg-med-primary-50/70 pl-9 pr-3 py-1.5 text-xs"
                  />
                </div>
              )}
            </FormField>
          </div>
        </div>

        {doctorsError && (
          <div className="flex flex-col items-start gap-3 p-5">
            <StatusMessage variant="error">{doctorsError}</StatusMessage>
            <button
              type="button"
              className="text-sm font-semibold text-med-primary-700 underline"
              onClick={() => setDoctorsRequestKey((key) => key + 1)}
            >
              Reintentar listado
            </button>
          </div>
        )}
        {doctorsLoading ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Cargando profesionales…
          </p>
        ) : !doctorsError && doctorsPage.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron profesionales.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Nombre del doctor</th>
                    <th className="px-6 py-3.5">Especialidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {doctorsPage.data.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50/70">
                      <td className="px-6 py-4 font-semibold text-med-primary-900">
                        {doctor.name}
                      </td>
                      <td className="px-6 py-4 text-med-text-sub">
                        {doctor.specialty?.name ?? 'Sin especialidad'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-med-border bg-med-primary-50/50 p-4 text-xs text-med-text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>
                Mostrando {doctorsPage.data.length} de {doctorsPage.total}
              </span>
              <button
                type="button"
                className="self-start font-semibold text-med-primary-700 underline sm:self-auto"
                onClick={() => navigate(ROUTES.adminDoctors)}
              >
                Ver directorio completo
              </button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default OverviewPage;
