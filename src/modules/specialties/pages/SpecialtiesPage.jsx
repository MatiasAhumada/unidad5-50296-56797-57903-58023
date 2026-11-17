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

  useNotificationError(error);

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
  };

  const columns = [
    {
      id: 'specialty',
      header: 'Especialidad',
      render: (specialty) => {
        const iconData = getSpecialtyIcon(specialty);

        return (
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
              {iconData.customUrl ? (
                <img
                  src={iconData.customUrl}
                  alt={specialty.name}
                  className="h-5 w-5 object-contain"
                />
              ) : (
                <Icon
                  icon={iconData.iconComponent || ICONS.medicalFile}
                  size={20}
                />
              )}
            </span>
            <span className="font-semibold text-med-primary-900">
              {specialty.name}
            </span>
          </div>
        );
      },
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

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado con título y botón de acción */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-med-primary-100 text-med-primary-700">
            <Icon icon={ICONS.medicalFile} size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-med-text-sub uppercase tracking-wider">
              Total Especialidades
            </p>
            <p className="text-2xl font-bold text-med-primary-900">
              {isLoading ? '…' : page.total}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon icon={ICONS.heart} size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-med-text-sub uppercase tracking-wider">
              Más Demandada
            </p>
            <p className="text-lg font-bold text-med-primary-900">
              Cardiología
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Icon icon={ICONS.shieldCheck} size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-med-text-sub uppercase tracking-wider">
              Catálogo Clínico
            </p>
            <p className="text-lg font-bold text-med-primary-900">
              {isLoading
                ? '…'
                : page.data.length > 0
                  ? `${page.data.filter((s) => s.isActive !== false).length} / ${page.data.length} Activas`
                  : 'Catálogo al día'}
            </p>
          </div>
        </Card>
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
