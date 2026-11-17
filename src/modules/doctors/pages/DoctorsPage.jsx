import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import DataTable from '../../shared/components/DataTable';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import Icon from '../../shared/components/Icon';
import StatusBadge from '../../shared/components/StatusBadge';
import ToggleSwitch from '../../shared/components/ToggleSwitch';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import { toggleEntityStatus } from '../../shared/helpers/toggleEntityStatus';
import useNotificationError from '../../shared/notifications/useNotificationError';
import { getSpecialties } from '../../specialties/services/specialtiesService';
import { getDoctorsPage, setDoctorStatus } from '../services/doctorsService';
import { getDoctorInitials } from '../utils/doctorInitials';

function DoctorsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [page, setPage] = useState({ data: [], pageSize: 10, total: 0 });
  const [activeDoctorsCount, setActiveDoctorsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  useNotificationError(error);

  useEffect(() => {
    const controller = new AbortController();

    getSpecialties(controller.signal).then(({ data }) => {
      if (!controller.signal.aborted && Array.isArray(data)) {
        setSpecialties(data);
      }
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    const trimmedName = searchTerm.trim() || undefined;
    const activeSpecialtyId = specialtyId || undefined;

    Promise.all([
      getDoctorsPage(
        {
          pageSize: 10,
          pageIndex,
          name: trimmedName,
          specialtyId: activeSpecialtyId,
        },
        controller.signal
      ),
      getDoctorsPage(
        {
          pageSize: 1,
          pageIndex: 1,
          name: trimmedName,
          specialtyId: activeSpecialtyId,
          includeInactive: false,
        },
        controller.signal
      ),
    ])
      .then(([result, activeResult]) => {
        if (controller.signal.aborted) return;

        if (result.error) {
          setError(result.error.message);

          return;
        }

        setPage(result.data);
        setActiveDoctorsCount(
          activeResult.data?.total ??
            result.data.data.filter((d) => d.isActive !== false).length
        );
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(requestError.message || 'Error al obtener doctores');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [pageIndex, requestKey, searchTerm, specialtyId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(1);
  };

  const handleSpecialtyFilterChange = (event) => {
    setSpecialtyId(event.target.value);
    setPageIndex(1);
  };

  const handleToggleStatus = (doctor) => {
    const currentlyActive = doctor.isActive !== false;
    const actionVerb = currentlyActive ? 'desactivar' : 'activar';

    return toggleEntityStatus({
      currentlyActive,
      confirmMessage: `¿Está seguro de que desea ${actionVerb} al profesional "${doctor.name}"?`,
      activatedMessage: `Profesional "${doctor.name}" reactivado exitosamente.`,
      deactivatedMessage: `Profesional "${doctor.name}" desactivado correctamente.`,
      onToggle: (nextActive) => setDoctorStatus(doctor.id, nextActive),
      onSuccess: () => setRequestKey((key) => key + 1),
    });
  };

  const columns = [
    {
      id: 'doctor',
      header: 'Profesional',
      render: (doctor) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-med-primary-100 text-xs font-bold text-med-primary-800">
            {getDoctorInitials(doctor.name)}
          </span>
          <span className="font-semibold text-med-primary-900">
            {doctor.name}
          </span>
        </div>
      ),
    },
    {
      id: 'licenseNumber',
      header: 'Matrícula',
      render: (doctor) => (
        <span className="font-mono text-xs text-med-text-sub">
          {doctor.licenseNumber}
        </span>
      ),
    },
    {
      id: 'specialty',
      header: 'Especialidad',
      render: (doctor) => (
        <span className="inline-flex items-center rounded-full bg-med-primary-50 px-2.5 py-1 text-xs font-medium text-med-primary-800 border border-med-primary-100">
          {doctor.specialty?.name ?? 'Sin especialidad'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Estado',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (doctor) => <StatusBadge isActive={doctor.isActive !== false} />,
    },
  ];

  const rowActions = [
    {
      id: 'edit',
      label: 'Editar',
      icon: ICONS.edit,
      onClick: (row) =>
        navigate(`${ROUTES.adminDoctorCreate}?doctorId=${row.id}`, {
          state: { doctor: row },
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

  const specialtyOptions = [
    { value: '', label: 'Todas las especialidades' },
    ...specialties.map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    })),
  ];

  const selectedSpecialtyLabel =
    specialties.find((s) => s.id === specialtyId)?.name || 'Todas';

  const summaryCards = [
    {
      id: 'total-doctors',
      icon: ICONS.doctor,
      label: 'DOCTORES ACTIVOS',
      value: isLoading ? '—' : activeDoctorsCount,
      detail: specialtyId
        ? `De ${page.total} en ${selectedSpecialtyLabel}`
        : `${page.total} registrados en total`,
    },
    {
      id: 'specialties-count',
      icon: ICONS.grid,
      label: 'ESPECIALIDADES',
      value: specialties.length || '—',
      detail: 'Áreas médicas activas',
    },
    {
      id: 'active-filter',
      icon: ICONS.filter,
      label: 'FILTRO ACTUAL',
      value: selectedSpecialtyLabel,
      detail: searchTerm.trim()
        ? `Búsqueda: "${searchTerm.trim()}"`
        : 'Sin filtro de texto',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Doctores
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Gestión de profesionales médicos, matrículas y especialidades.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => navigate(ROUTES.adminDoctorCreate)}
          className="flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Icon icon={ICONS.add} size={18} />
          <span>Nuevo Doctor</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
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
              <p className="text-2xl font-extrabold text-med-primary-900 truncate">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-med-text-sub truncate">
                {card.detail}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <DataTable
        title="Registros de Doctores"
        headerContent={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="w-full sm:w-56">
              <FormField
                id="doctor-specialty-filter"
                label="Filtrar por especialidad"
                labelClassName="sr-only"
              >
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    value={specialtyId}
                    onChange={handleSpecialtyFilterChange}
                    options={specialtyOptions}
                    className="py-1.5 text-xs"
                  />
                )}
              </FormField>
            </div>

            <div className="relative w-full sm:w-64">
              <FormField
                id="doctor-search"
                label="Buscar doctores"
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
                      className="pl-9 pr-3 py-1.5 text-xs"
                    />
                  </div>
                )}
              </FormField>
            </div>
          </div>
        }
        columns={columns}
        rows={page.data}
        rowKey="id"
        rowActions={rowActions}
        isLoading={isLoading}
        loadingMessage="Cargando doctores…"
        emptyMessage="No se encontraron doctores."
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

export default DoctorsPage;
