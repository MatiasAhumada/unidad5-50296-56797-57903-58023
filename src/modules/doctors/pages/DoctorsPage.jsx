import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import IconButton from '../../shared/components/IconButton';

import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';

function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const doctorsList = [
    {
      id: 'MED-4920',
      name: 'Dr. Alejandro Rivera',
      specialty: 'Cardiología Clínica',
      status: 'Active',
      statusType: 'active',
      avatar: '👨‍⚕️',
    },
    {
      id: 'MED-2104',
      name: 'Dra. Elena Martínez',
      specialty: 'Pediatría Avanzada',
      status: 'On Leave',
      statusType: 'danger',
      avatar: '👩‍⚕️',
    },
    {
      id: 'MED-8831',
      name: 'Dr. Marcos Torres',
      specialty: 'Neurocirugía',
      status: 'Active',
      statusType: 'active',
      avatar: '👨‍⚕️',
    },
    {
      id: 'MED-1192',
      name: 'Dra. Lucía Soria',
      specialty: 'Ginecología',
      status: 'Active',
      statusType: 'active',
      avatar: '👩‍⚕️',
    },
  ];

  const filteredDoctors = doctorsList.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Acciones de Cabecera */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Barra de Búsqueda */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <FormField
              id="searchTerm"
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
                    id="searchTerm"
                    type="text"
                    placeholder="Buscar doctor por nombre..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="pl-9 pr-3 py-2 text-xs"
                    {...fieldProps}
                  />
                </div>
              )}
            </FormField>
          </div>

          <Button
            onClick={() => alert('Abrir modal de disponibilidad horaria')}
            className="flex items-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white"
          >
            <Icon icon={ICONS.clock} size={16} />
            <span>Agregar Disponibilidad Horaria</span>
          </Button>

          <Button
            onClick={() => alert('Abrir modal de nuevo doctor')}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>
        </div>
      </div>

      {/* Tabla Principal */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-center">
                  Estado de Disponibilidad
                </th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {filteredDoctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Doctor Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 flex items-center justify-center text-xl">
                          {doc.avatar}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            doc.statusType === 'active'
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-med-primary-900 leading-tight">
                          {doc.name}
                        </p>
                        <p className="text-xs text-med-text-muted mt-0.5">
                          ID: {doc.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Especialidad Badge en Píldora */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                      {doc.specialty}
                    </span>
                  </td>

                  {/* Estado de Disponibilidad */}
                  <td className="px-6 py-4 text-center">
                    {doc.statusType === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-med-active-text" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-danger-bg text-med-danger-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-med-danger-text" />
                        On Leave
                      </span>
                    )}
                  </td>

                  {/* Botones de Acciones (Ojo, Lápiz, Basurero) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-med-primary-600">
                      <IconButton
                        label={`Ver detalle de ${doc.name}`}
                        icon={ICONS.eye}
                        size={16}
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                        onClick={() => alert(`Ver detalle de ${doc.name}`)}
                      />
                      <IconButton
                        label={`Editar profesional ${doc.name}`}
                        icon={ICONS.edit}
                        size={16}
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                        onClick={() => alert(`Editar profesional ${doc.name}`)}
                      />
                      <IconButton
                        label={`Eliminar profesional ${doc.name}`}
                        icon={ICONS.delete}
                        size={16}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() =>
                          alert(`Eliminar profesional ${doc.name}`)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginador normalizado idéntico a Búsqueda y Filtrado de Citas */}
        <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
          <span>Mostrando 4 de 124 registros</span>
          <div className="flex items-center gap-1">
            <IconButton
              label="Página anterior"
              icon={ICONS.previous}
              size={16}
              variant="outline"
            />
            <IconButton
              label="Página siguiente"
              icon={ICONS.next}
              size={16}
              variant="outline"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DoctorsPage;
