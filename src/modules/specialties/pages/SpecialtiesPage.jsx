import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Icon from '../../shared/components/Icon';
import IconButton from '../../shared/components/IconButton';
import StatusMessage from '../../shared/components/StatusMessage';
import TablePagination from '../../shared/components/TablePagination';
import { getApiErrorMessage } from '../../shared/api/apiError';
import { ICONS } from '../../shared/constants/icons';
import {
  createSpecialty,
  deleteSpecialty,
  getSpecialtiesPage,
  updateSpecialty,
} from '../services/specialtiesService';

function SpecialtiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [page, setPage] = useState({ data: [], pageSize: 10, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  // Modal / Form state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [specialtyToDelete, setSpecialtyToDelete] = useState(null);
  const [deleteModalError, setDeleteModalError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  const openCreateModal = () => {
    setEditingSpecialty(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setModalError('');
    setActionSuccess('');
    setActionError('');
    setShowFormModal(true);
  };

  const openEditModal = (specialty) => {
    setEditingSpecialty(specialty);
    setFormData({
      name: specialty.name || '',
      description: specialty.description || '',
    });
    setFormErrors({});
    setModalError('');
    setActionSuccess('');
    setActionError('');
    setShowFormModal(true);
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedDesc = formData.description.trim();

    if (!trimmedName) {
      errors.name = 'El nombre de la especialidad es obligatorio.';
    } else if (trimmedName.length < 3 || trimmedName.length > 100) {
      errors.name = 'El nombre debe tener entre 3 y 100 caracteres.';
    } else if (
      page.data.some(
        (s) =>
          s.id !== editingSpecialty?.id &&
          s.name?.trim().toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      errors.name = 'Ya existe una especialidad con ese nombre.';
    }

    if (!trimmedDesc) {
      errors.description = 'La descripción es obligatoria.';
    } else if (trimmedDesc.length < 10 || trimmedDesc.length > 100) {
      errors.description = 'La descripción debe tener entre 10 y 100 caracteres.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setModalError('');
    setActionSuccess('');
    setActionError('');

    try {
      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        setActionSuccess('Especialidad actualizada exitosamente.');
      } else {
        await createSpecialty({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        setActionSuccess('Especialidad creada exitosamente.');
      }
      setShowFormModal(false);
      setRequestKey((k) => k + 1);
    } catch (submitError) {
      const msg = getApiErrorMessage(submitError);
      setModalError(msg);
      if (
        msg.toLowerCase().includes('nombre') ||
        msg.toLowerCase().includes('duplicate') ||
        submitError.status === 409
      ) {
        setFormErrors((prev) => ({
          ...prev,
          name: msg,
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!specialtyToDelete) return;

    setIsDeleting(true);
    setDeleteModalError('');
    setActionSuccess('');
    setActionError('');

    try {
      await deleteSpecialty(specialtyToDelete.id);
      setActionSuccess(`Especialidad "${specialtyToDelete.name}" eliminada.`);
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

          <Button onClick={openCreateModal} className="flex items-center gap-1.5 whitespace-nowrap">
            <span>+ Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <StatusMessage variant="success">{actionSuccess}</StatusMessage>
      )}

      {actionError && (
        <StatusMessage variant="error">{actionError}</StatusMessage>
      )}

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
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-med-border-subtle">
                  {page.data.map((specialty) => (
                    <tr key={specialty.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-med-primary-900">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-med-primary-100 text-med-primary-700">
                            <Icon icon={ICONS.hospital} size={18} />
                          </span>
                          <span>{specialty.name}</span>
                        </div>
                      </td>

                      <td className="max-w-xl px-6 py-4 text-med-text-sub text-xs">
                        {specialty.description}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <IconButton
                            label={`Editar ${specialty.name}`}
                            icon={ICONS.edit}
                            size={16}
                            onClick={() => openEditModal(specialty)}
                            className="p-1.5 rounded hover:bg-med-primary-50 text-med-text-sub hover:text-med-primary-900"
                          />
                          <IconButton
                            label={`Eliminar ${specialty.name}`}
                            icon={ICONS.delete}
                            size={16}
                            onClick={() => setSpecialtyToDelete(specialty)}
                            className="p-1.5 rounded hover:bg-red-50 text-med-text-sub hover:text-red-600"
                          />
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

      {/* Modal Crear / Editar Especialidad */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-med-border">
            <div className="mb-4 border-b border-med-border-subtle pb-3">
              <h3 className="text-lg font-bold text-med-primary-900">
                {editingSpecialty ? 'Editar Especialidad' : 'Registrar Nueva Especialidad'}
              </h3>
              <p className="text-xs text-med-text-sub mt-1">
                Complete la información técnica requerida por el sistema.
              </p>
            </div>

            {modalError && (
              <div className="mb-4">
                <StatusMessage variant="error">{modalError}</StatusMessage>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                id="modal-specialty-name"
                label="Nombre de la Especialidad"
                labelClassName="text-xs font-semibold text-med-text-sub"
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ej: Cardiología"
                    className="px-3 py-2 text-xs"
                  />
                )}
              </FormField>
              {formErrors.name && (
                <p className="text-xs text-red-600">{formErrors.name}</p>
              )}

              <FormField
                id="modal-specialty-desc"
                label="Descripción"
                labelClassName="text-xs font-semibold text-med-text-sub"
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Descripción entre 10 y 100 caracteres"
                    className="px-3 py-2 text-xs"
                  />
                )}
              </FormField>
              {formErrors.description && (
                <p className="text-xs text-red-600">{formErrors.description}</p>
              )}

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-med-border-subtle">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFormModal(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Guardando…'
                    : editingSpecialty
                    ? 'Actualizar Especialidad'
                    : 'Guardar Especialidad'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación */}
      {specialtyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-med-border">
            <h3 className="text-base font-bold text-med-primary-900">
              ¿Eliminar especialidad?
            </h3>
            <p className="mt-2 text-xs text-med-text-sub">
              ¿Está seguro de dar de baja la especialidad{' '}
              <strong className="text-med-text-main">{specialtyToDelete.name}</strong>?
              Esta operación realiza una eliminación lógica en el backend.
            </p>

            {deleteModalError && (
              <div className="mt-3">
                <StatusMessage variant="error">{deleteModalError}</StatusMessage>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSpecialtyToDelete(null);
                  setDeleteModalError('');
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando…' : 'Sí, eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecialtiesPage;