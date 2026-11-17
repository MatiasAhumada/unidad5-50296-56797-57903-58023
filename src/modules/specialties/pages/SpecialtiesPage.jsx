import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import DataTable from '../../shared/components/DataTable';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import ToggleSwitch from '../../shared/components/ToggleSwitch';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  confirmAction,
  showError,
  showSuccess,
} from '../../shared/notifications/notifications';
import useNotificationError from '../../shared/notifications/useNotificationError';
import {
  getSpecialtiesPage,
  getSpecialtyMetrics,
  setSpecialtyStatus,
} from '../services/specialtiesService';
import { getSpecialtyIcon } from '../constants/specialtyIcons';

function SpecialtiesPage() {
  const navigate = useNavigate();
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
          setError(requestError.message || 'Error al obtener especialidades');
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
          setMetricsError(requestError.message || 'Error al obtener métricas');
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

  const handleToggleStatus = async (specialty) => {
    const currentlyActive = specialty.isActive !== false;
    const actionVerb = currentlyActive ? 'desactivar' : 'activar';
    const confirmed = await confirmAction(
      `¿Está seguro de que desea ${actionVerb} la especialidad "${specialty.name}"?`
    );

    if (!confirmed) return;

    const { error: statusError } = await setSpecialtyStatus(
      specialty.id,
      !currentlyActive
    );

    if (statusError) {
      showError(statusError.message);

      return;
    }

    showSuccess(
      currentlyActive
        ? `Especialidad "${specialty.name}" desactivada correctamente.`
        : `Especialidad "${specialty.name}" reactivada exitosamente.`
    );
    setRequestKey((key) => key + 1);
    setMetricsRequestKey((key) => key + 1);
  };

  const columns = [
    {
      id: 'specialty',
      header: 'Especialidad',
      render: (specialty) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
            <Icon icon={getSpecialtyIcon(specialty)} size={20} />
          </span>
          <span className="font-semibold text-med-primary-900">
            {specialty.name}
          </span>
        </div>
      ),
    },
    {
      id: 'description',
      header: 'Descripción',
      render: (specialty) => (
        <span className="text-med-text-sub text-xs line-clamp-2">
          {specialty.description || 'Sin descripción.'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Estado',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (specialty) =>
        specialty.isActive !== false ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Activo
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            Inactivo
          </span>
        ),
    },
  ];

  const rowActions = [
    {
      id: 'edit',
      label: 'Editar',
      icon: ICONS.edit,
      onClick: (row) =>
        navigate(`${ROUTES.adminSpecialtyCreate}?specialtyId=${row.id}`, {
          state: { specialty: row },
        }),
    },
    {
      id: 'toggleStatus',
      label: (row) => (row.isActive !== false ? 'Desactivar' : 'Activar'),
      render: (row, { disabled, label }) => (
        <ToggleSwitch
          checked={row.isActive !== false}
          onChange={() => handleToggleStatus(row)}
          disabled={disabled}
          label={label}
        />
      ),
    },
  ];

  const totalSpecialtiesValue = metricsLoading
    ? '—'
    : (metrics?.totalSpecialties ?? page.total ?? '—');

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
      {/* Encabezado con título y botón de acción */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Administración y catálogo de especialidades médicas disponibles.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate(ROUTES.adminSpecialtyCreate)}
          className="flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Icon icon={ICONS.add} size={18} />
          <span>Nueva Especialidad</span>
        </Button>
      </div>

      {/* Tarjetas métricas de resumen */}
      {metricsError && (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            className="text-xs font-semibold text-med-primary-700 underline"
            onClick={() => setMetricsRequestKey((key) => key + 1)}
          >
            Reintentar carga de métricas
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metricCards.map((card) => (
          <Card
            key={card.id}
            className="flex flex-col justify-between gap-3 p-5"
          >
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

      {/* Tabla de Registros usando DataTable */}
      <DataTable
        title="Registros de Especialidades"
        headerContent={
          <div className="relative w-full sm:w-72">
            <FormField
              id="specialty-search"
              label="Buscar especialidades"
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
                    placeholder="Buscar especialidad..."
                    className="pl-9 pr-3 py-2 text-xs"
                  />
                </div>
              )}
            </FormField>
          </div>
        }
        columns={columns}
        rows={page.data}
        rowKey="id"
        rowActions={rowActions}
        isLoading={isLoading}
        loadingMessage="Cargando especialidades…"
        emptyMessage="No se encontraron especialidades registradas."
        error={error}
        onRetry={() => setRequestKey((key) => key + 1)}
        pagination={{
          pageIndex: page.pageIndex || pageIndex,
          pageSize: page.pageSize || 10,
          total: page.total || 0,
          onPageChange: setPageIndex,
        }}
      />
    </div>
  );
}

export default SpecialtiesPage;
