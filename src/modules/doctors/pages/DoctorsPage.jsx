import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/appConstants';
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
import {
  deleteDoctor,
  getDoctorsPage,
  toggleDoctorStatus,
} from '../services/doctorsService';
import { getDoctorPhoto } from '../constants/doctorPhotos';

function DoctorsPage() {
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
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Modal Delete Doctor
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Recibir mensaje de éxito si viene de crear/editar doctor
  useEffect(() => {
    if (location.state?.actionSuccess) {
      setActionSuccess(location.state.actionSuccess);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch doctors
  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError('');

    getDoctorsPage(
      { pageSize: 10, pageIndex, name: searchTerm.trim() || undefined },
      controller.signal
    )
      .then((doctorsData) => {
        setPage(doctorsData);
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

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;

    setIsDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      await deleteDoctor(doctorToDelete.id);
      setActionSuccess(
        `Doctor "${doctorToDelete.name}" dado de baja exitosamente.`
      );
      setDoctorToDelete(null);
      setRequestKey((k) => k + 1);
    } catch (delError) {
      setActionError(getApiErrorMessage(delError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Directorio de Doctores
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Gestione el personal médico y configure su disponibilidad horaria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
                    className="pl-9 pr-3 py-2 text-xs"
                  />
                </div>
              )}
            </FormField>
          </div>

          <Button
            variant={selectedDoctorId ? 'primary' : 'secondary'}
            disabled={!selectedDoctorId}
            onClick={() => {
              if (selectedDoctorId) {
                navigate(
                  `${ROUTES.adminDoctorAvailability}?doctorId=${selectedDoctorId}`
                );
              }
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-all ${
              !selectedDoctorId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={
              selectedDoctorId
                ? 'Gestionar disponibilidad horaria del médico seleccionado'
                : 'Seleccione un médico del listado para gestionar su disponibilidad'
            }
          >
            <Icon icon={ICONS.clock} size={16} />
            <span>Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => navigate(ROUTES.adminDoctorCreate)}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>+ Nuevo Doctor</span>
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
            Registros de Doctores ({page.total})
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
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {page.data.map((doctor) => {
                    const isSelected = selectedDoctorId === doctor.id;
                    const cellClasses = isSelected
                      ? 'bg-[#ecfccb]/50 border-t-2 border-b-2 border-emerald-300 first:border-l-2 first:border-l-emerald-300 last:border-r-2 last:border-r-emerald-300'
                      : 'border-b border-med-border-subtle';
                    return (
                      <tr
                        key={doctor.id}
                        onClick={() =>
                          setSelectedDoctorId((prev) =>
                            prev === doctor.id ? null : doctor.id
                          )
                        }
                        className={`transition cursor-pointer ${
                          isSelected
                            ? 'relative z-10'
                            : 'hover:bg-gray-50/70'
                        }`}
                      >
                        <td className={`px-6 py-4 ${cellClasses}`}>
                          {(() => {
                            const photo = getDoctorPhoto(doctor);
                            return (
                              <div className="flex items-center gap-3">
                                {photo ? (
                                  <img
                                    src={photo}
                                    alt={doctor.name}
                                    className="h-10 w-10 shrink-0 rounded-xl object-cover border border-med-border shadow-xs"
                                  />
                                ) : (
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
                                    <Icon icon={ICONS.doctor} size={20} />
                                  </span>
                                )}
                                <span className="font-semibold text-med-primary-900">
                                  {doctor.name}
                                </span>
                              </div>
                            );
                          })()}
                        </td>

                        <td
                          className={`px-6 py-4 text-xs text-med-text-sub ${cellClasses}`}
                        >
                          {doctor.licenseNumber}
                        </td>

                        <td
                          className={`px-6 py-4 text-xs font-medium text-med-text-sub ${cellClasses}`}
                        >
                          {doctor.specialty?.name ?? 'Sin especialidad'}
                        </td>

                        <td className={`px-6 py-4 text-center ${cellClasses}`}>
                          <StatusBadge isActive={doctor.isActive} />
                        </td>

                        <td className={`px-6 py-4 text-center ${cellClasses}`}>
                          <div className="flex items-center justify-center gap-2">
                            <IconButton
                              label={`Gestionar disponibilidad horaria de ${doctor.name}`}
                              icon={ICONS.clock}
                              size={16}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `${ROUTES.adminDoctorAvailability}?doctorId=${doctor.id}`
                                );
                              }}
                              className="p-1.5 rounded hover:bg-med-primary-50 text-med-text-sub hover:text-med-primary-900"
                            />
                            <IconButton
                              label={`Editar ${doctor.name}`}
                              icon={ICONS.edit}
                              size={16}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `${ROUTES.adminDoctorCreate}?doctorId=${doctor.id}`,
                                  { state: { doctor } }
                                );
                              }}
                              className="p-1.5 rounded hover:bg-med-primary-50 text-med-text-sub hover:text-med-primary-900"
                            />
                            {doctor.isActive === false ? (
                              <IconButton
                                label={`Reactivar ${doctor.name}`}
                                icon={ICONS.refresh}
                                size={16}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await toggleDoctorStatus(doctor.id, true);
                                    setActionSuccess(
                                      `Doctor "${doctor.name}" reactivado exitosamente.`
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
                                label={`Dar de baja a ${doctor.name}`}
                                icon={ICONS.delete}
                                size={16}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDoctorToDelete(doctor);
                                }}
                                className="p-1.5 rounded hover:bg-red-50 text-med-text-sub hover:text-red-600"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
        isOpen={Boolean(doctorToDelete)}
        title="¿Dar de baja al doctor?"
        message={
          doctorToDelete && (
            <>
              ¿Está seguro de dar de baja al doctor{' '}
              <strong className="text-med-text-main">
                {doctorToDelete.name}
              </strong>
              ? Esta acción realizará una baja lógica en el sistema.
            </>
          )
        }
        confirmText="Sí, dar de baja"
        loadingText="Dando de baja…"
        isLoading={isDeleting}
        onConfirm={handleDeleteDoctor}
        onCancel={() => setDoctorToDelete(null)}
      />
    </div>
  );
}

export default DoctorsPage;