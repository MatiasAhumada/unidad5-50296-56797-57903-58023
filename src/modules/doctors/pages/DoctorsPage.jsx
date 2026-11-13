import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import StatusMessage from '../../shared/components/StatusMessage';
import TablePagination from '../../shared/components/TablePagination';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import { getDoctorsPage } from '../services/doctorsService';
import useNotificationError from '../../shared/notifications/useNotificationError';

function DoctorsPage() {
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

    getDoctorsPage(
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPageIndex(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Doctores
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Profesionales registrados en el sistema.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
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
                  className="pl-9 pr-3 py-2 text-xs"
                />
              </div>
            )}
          </FormField>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-start gap-3">
          <StatusMessage variant="error">{error}</StatusMessage>
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
            Registros de Doctores
          </h2>
        </div>
        {isLoading ? (
          <p className="p-5 text-sm text-med-text-sub" role="status">
            Cargando doctores…
          </p>
        ) : !error && page.data.length === 0 ? (
          <p className="p-5 text-sm text-med-text-sub">
            No se encontraron doctores.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                  <tr>
                    <th className="px-6 py-3.5">Nombre del doctor</th>
                    <th className="px-6 py-3.5">Matrícula</th>
                    <th className="px-6 py-3.5">Especialidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {page.data.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
                            <Icon icon={ICONS.doctor} size={20} />
                          </span>
                          <span className="font-semibold text-med-primary-900">
                            {doctor.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-med-text-sub">
                        {doctor.licenseNumber}
                      </td>
                      <td className="px-6 py-4 text-med-text-sub">
                        {doctor.specialty?.name ?? 'Sin especialidad'}
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
    </div>
  );
}

export default DoctorsPage;
