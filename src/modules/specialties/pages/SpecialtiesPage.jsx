import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import IconButton from '../../shared/components/IconButton';
import StatusMessage from '../../shared/components/StatusMessage';
import StatusBadge from '../../shared/components/StatusBadge';
import ConfirmModal from '../../shared/components/ConfirmModal';
import FeedbackAlerts from '../../shared/components/FeedbackAlerts';
import TablePagination from '../../shared/components/TablePagination';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import { ROUTES } from '../../shared/constants/appConstants';
import {
  deleteSpecialty,
  getSpecialtiesPage,
  toggleSpecialtyStatus,
} from '../services/specialtiesService';
import { getSpecialtyIcon } from '../constants/specialtyIcons';

function SpecialtiesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [page, setPage] = useState({ data: [], pageSize: 10, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  // Modal Confirmación de Baja Lógica
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);
  const [deleteModalError, setDeleteModalError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Recibir mensaje de éxito si viene de crear/editar especialidad
  useEffect(() => {
    if (location.state?.actionSuccess) {
      setActionSuccess(location.state.actionSuccess);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cargar especialidades paginadas
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    getSpecialtiesPage(
      { pageSize: 10, pageIndex, name: searchTerm.trim() || undefined },
      controller.signal
    )
      .then(setPage)
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(1);
  };

  const handleDelete = async () => {
    if (!specialtyToDelete) return;

    setIsDeleting(true);
    setDeleteModalError('');
    setActionSuccess('');
    setActionError('');

    try {
      await deleteSpecialty(specialtyToDelete.id);
      setActionSuccess(
        `Especialidad "${specialtyToDelete.name}" dada de baja exitosamente.`
      );
      setSpecialtyToDelete(null);
      setRequestKey((k) => k + 1);
    } catch (delError) {
      const msg = getApiErrorMessage(delError);

      setDeleteModalError(msg);
      setActionError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Especialidades
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Administre las categorías médicas y servicios del centro.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
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

          <Button
            onClick={() => navigate(ROUTES.adminSpecialtyCreate)}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>+ Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      <FeedbackAlerts
        actionSuccess={actionSuccess}
        actionError={actionError}
        queryError={error}
        onRetry={() => setRequestKey((key) => key + 1)}
      />

      <Card className="overflow-hidden p-0">
        <div className="border-b border-med-border p-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades ({page.total})
          </h2>
        </div>

        {isLoading ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Cargando especialidades…
          </p>
        ) : !error && page.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron especialidades.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Especialidad</th>
                    <th className="px-6 py-3.5">Descripción</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {page.data.map((specialty) => (
                    <tr
                      key={specialty.id}
                      className="hover:bg-gray-50/70 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-med-primary-900">
                        {(() => {
                          const iconData = getSpecialtyIcon(specialty);

                          return (
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700 overflow-hidden border border-med-border-subtle">
                                {iconData.customUrl ? (
                                  <img
                                    src={iconData.customUrl}
                                    alt={specialty.name}
                                    className="h-6 w-6 object-contain"
                                  />
                                ) : (
                                  <Icon
                                    icon={
                                      iconData.iconComponent || ICONS.hospital
                                    }
                                    size={18}
                                  />
                                )}
                              </span>
                              <span>{specialty.name}</span>
                            </div>
                          );
                        })()}
                      </td>

                      <td className="max-w-xl px-6 py-4 text-med-text-sub text-xs">
                        {specialty.description}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <StatusBadge isActive={specialty.isActive} />
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <IconButton
                            label={`Editar ${specialty.name}`}
                            icon={ICONS.edit}
                            size={16}
                            onClick={() =>
                              navigate(
                                `${ROUTES.adminSpecialtyCreate}?specialtyId=${specialty.id}`,
                                { state: { specialty } }
                              )
                            }
                            className="p-1.5 rounded hover:bg-med-primary-50 text-med-text-sub hover:text-med-primary-900"
                          />
                          {specialty.isActive === false ? (
                            <IconButton
                              label={`Reactivar ${specialty.name}`}
                              icon={ICONS.refresh}
                              size={16}
                              onClick={async () => {
                                try {
                                  await toggleSpecialtyStatus(
                                    specialty.id,
                                    true
                                  );
                                  setActionSuccess(
                                    `Especialidad "${specialty.name}" reactivada exitosamente.`
                                  );
                                  setRequestKey((k) => k + 1);
                                } catch (err) {
                                  setActionError(getApiErrorMessage(err));
                                }
                              }}
                              className="p-1.5 rounded hover:bg-emerald-50 text-med-text-sub hover:text-emerald-700"
                            />
                          ) : (
                            <IconButton
                              label={`Dar de baja a ${specialty.name}`}
                              icon={ICONS.delete}
                              size={16}
                              onClick={() => setSpecialtyToDelete(specialty)}
                              className="p-1.5 rounded hover:bg-red-50 text-med-text-sub hover:text-red-600"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={pageIndex}
              pageSize={page.pageSize}
              totalItems={page.total}
              totalPages={Math.ceil(page.total / page.pageSize) || 1}
              onPageChange={setPageIndex}
            />
          </>
        )}
      </Card>

      {/* Modal Confirmación de Baja Lógica */}
      <ConfirmModal
        isOpen={Boolean(specialtyToDelete)}
        title="¿Dar de baja a la especialidad?"
        message={
          specialtyToDelete && (
            <>
              ¿Está seguro de dar de baja a la especialidad{' '}
              <strong className="text-med-text-main">
                {specialtyToDelete.name}
              </strong>
              ? Esta acción realizará una baja lógica en el sistema.
            </>
          )
        }
        error={deleteModalError}
        confirmText="Sí, dar de baja"
        loadingText="Dando de baja…"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setSpecialtyToDelete(null);
          setDeleteModalError('');
        }}
      />
    </div>
  );
}

export default SpecialtiesPage;
