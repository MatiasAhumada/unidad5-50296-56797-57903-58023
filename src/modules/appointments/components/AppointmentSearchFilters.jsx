import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import FormField from '../../shared/components/FormField';
import Icon from '../../shared/components/Icon';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import { ICONS } from '../../shared/constants/icons';

function AppointmentSearchFilters({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  specialties,
  doctors,
  isLoadingCatalogs,
  catalogError,
  onRetryCatalogs,
}) {
  const visibleDoctors = filters.specialtyId
    ? doctors.filter((doctor) => doctor.specialty?.id === filters.specialtyId)
    : doctors;
  const specialtyOptions = [
    { value: '', label: 'Todas las especialidades' },
    ...specialties.map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    })),
  ];
  const doctorOptions = [
    { value: '', label: 'Todos los doctores' },
    ...visibleDoctors.map((doctor) => ({
      value: doctor.id,
      label: doctor.name,
    })),
  ];

  const updateFilter = (field, value) => {
    onFiltersChange((current) => ({
      ...current,
      [field]: value,
      ...(field === 'specialtyId' ? { doctorId: '' } : {}),
    }));
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 border-b border-med-border-subtle pb-4">
        <h2 className="text-base font-bold text-med-primary-900">
          Criterios de búsqueda
        </h2>
      </div>
      {catalogError && (
        <div className="mb-4 flex flex-col items-start gap-3">
          <Button variant="ghost" onClick={onRetryCatalogs}>
            Reintentar catálogos
          </Button>
        </div>
      )}

      <form
        onSubmit={onApply}
        className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-2 lg:grid-cols-5"
      >
        <FormField
          id="appointment-patient-dni"
          label="DNI del paciente"
          labelClassName="text-xs font-semibold text-med-text-sub"
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
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="Ingresá un DNI"
                value={filters.dni}
                onChange={(event) =>
                  updateFilter('dni', event.target.value.replace(/\D/g, ''))
                }
                className="py-2 pr-3 pl-9 text-xs"
              />
            </div>
          )}
        </FormField>

        <FormField
          id="appointment-specialty-filter"
          label="Especialidad"
          labelClassName="text-xs font-semibold text-med-text-sub"
        >
          {(fieldProps) => (
            <Select
              {...fieldProps}
              value={filters.specialtyId}
              onChange={(event) =>
                updateFilter('specialtyId', event.target.value)
              }
              disabled={isLoadingCatalogs || Boolean(catalogError)}
              options={specialtyOptions}
              className="px-3 py-2 text-xs"
            />
          )}
        </FormField>

        <FormField
          id="appointment-doctor-filter"
          label="Doctor"
          labelClassName="text-xs font-semibold text-med-text-sub"
        >
          {(fieldProps) => (
            <Select
              {...fieldProps}
              value={filters.doctorId}
              onChange={(event) => updateFilter('doctorId', event.target.value)}
              disabled={isLoadingCatalogs || Boolean(catalogError)}
              options={doctorOptions}
              className="px-3 py-2 text-xs"
            />
          )}
        </FormField>

        <FormField
          id="appointment-date-filter"
          label="Fecha"
          labelClassName="text-xs font-semibold text-med-text-sub"
        >
          {(fieldProps) => (
            <Input
              {...fieldProps}
              type="date"
              value={filters.date}
              onChange={(event) => updateFilter('date', event.target.value)}
              className="px-3 py-2 text-xs"
            />
          )}
        </FormField>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoadingCatalogs || Boolean(catalogError)}
            className="flex flex-1 items-center justify-center gap-2"
          >
            <Icon icon={ICONS.filter} size={16} />
            Aplicar filtros
          </Button>
          <Button type="button" variant="outline" onClick={onClear}>
            Limpiar
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AppointmentSearchFilters;
