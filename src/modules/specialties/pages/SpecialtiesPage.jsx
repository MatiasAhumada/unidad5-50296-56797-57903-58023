import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import TablePagination from '../../shared/components/TablePagination';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import {
  getSpecialtiesPage,
  getSpecialtyMetrics,
} from '../services/specialtiesService';
import useNotificationError from '../../shared/notifications/useNotificationError';

function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [page, setPage] = useState({ data: [], pageSize: 10, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');
  const [metricsRequestKey, setMetricsRequestKey] = useState(0);

  useNotificationError(error);
  useNotificationError(metricsError);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    getSpecialtiesPage(
      { pageSize: 10, pageIndex, name: searchTerm.trim() || undefined },
      controller.signal
    )
      .then((result) => {
        if (controller.signal.aborted) return;

        if (result.error) {
          setError(result.error.message);
          return;
        }

        setPage(result.data);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [pageIndex, requestKey, searchTerm]);

  useEffect(() => {
    const controller = new AbortController();

    setMetricsLoading(true);
    setMetricsError('');

    getSpecialtyMetrics(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;

        if (result.error) {
          setMetricsError(result.error.message);
          return;
        }

        setMetrics(result.data);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setMetricsError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setMetricsLoading(false);
        }
      });

    return () => controller.abort();
  }, [metricsRequestKey]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(1);
  };

  const totalSpecialtiesValue = metricsLoading
    ? '—'
    : (metrics?.totalSpecialties ?? '—');

  const totalSpecialtiesDetail = metricsLoading
    ? 'Cargando resumen...'
    : metrics?.quarterlyGrowthCount > 0
      ? `+${metrics.quarterlyGrowthCount} este trimestre`
      : 'Sin altas en el trimestre';

  const mostDemandedValue = metricsLoading
    ? '—'
    : metrics?.mostDemandedSpecialtyName || 'Sin datos';

  const mostDemandedDetail = metricsLoading
    ? 'Calculando demanda...'
    : metrics?.mostDemandedAppointmentsCount > 0
      ? `${metrics.mostDemandedPercentage}% del total de turnos`
      : 'Sin turnos registrados';

  const newThisMonthValue = metricsLoading
    ? '—'
    : (metrics?.newThisMonthCount ?? '—');

  const newThisMonthDetail = metricsLoading
    ? 'Cargando altas...'
    : metrics?.newThisMonthNames?.length > 0
      ? metrics.newThisMonthNames.join(', ')
      : 'Sin altas este mes';

  const metricCards = [
    {
      id: 'total-specialties',
      icon: ICONS.grid,
      label: 'TOTAL ESPECIALIDADES',
      value: totalSpecialtiesValue,
      detail: totalSpecialtiesDetail,
    },
    {
      id: 'most-demanded',
      icon: ICONS.heart,
      label: 'MÁS DEMANDADA',
      value: mostDemandedValue,
      detail: mostDemandedDetail,
    },
    {
      id: 'new-this-month',
      icon: ICONS.appointments,
      label: 'NUEVAS ESTE MES',
      value: newThisMonthValue,
      detail: newThisMonthDetail,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Especialidades registradas en el sistema.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <FormField
            id="specialty-search"
            label="Buscar especialidades"
            labelClassName="sr-only"
          >
            {(fieldProps) => (
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-sub"
                  aria-hidden="true"
                >
                  <Icon icon={ICONS.search} size={16} />
                </span>
                <Input
                  {...fieldProps}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar especialidad..."
                  className="pl-9 pr-3 py-2 text-xs"
                />
              </div>
            )}
          </FormField>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-start gap-3">
          <button
            type="button"
            className="text-sm font-semibold text-med-primary-700 underline"
            onClick={() => setRequestKey((key) => key + 1)}
          >
            Reintentar
          </button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-med-border p-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Cargando especialidades...
          </p>
        ) : !error && page.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron especialidades.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/40 text-xs font-bold uppercase text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Especialidad</th>
                    <th className="px-6 py-3.5">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {page.data.map((specialty) => (
                    <tr key={specialty.id} className="hover:bg-gray-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-med-primary-50 text-med-primary-700">
                            <Icon icon={ICONS.medicalFile} size={20} />
                          </span>
                          <span className="font-semibold text-med-primary-900">
                            {specialty.name}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-xl px-6 py-4 text-med-text-sub">
                        {specialty.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={page.pageIndex}
              pageSize={page.pageSize}
              totalItems={page.total}
              totalPages={Math.ceil(page.total / page.pageSize)}
              onPageChange={setPageIndex}
            />
          </>
        )}
      </Card>

      {metricsError && (
        <div className="flex flex-col items-start gap-3">
          <button
            type="button"
            className="text-sm font-semibold text-med-primary-700 underline"
            onClick={() => setMetricsRequestKey((key) => key + 1)}
          >
            Reintentar métricas
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metricCards.map((card) => (
          <Card key={card.id} className="flex flex-col justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-med-primary-50 text-med-primary-700">
                <Icon icon={card.icon} size={20} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-med-text-sub">
                {card.label}
              </span>
            </div>

            <div>
              <p className="text-2xl font-extrabold text-med-primary-900">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-med-text-sub">{card.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SpecialtiesPage;