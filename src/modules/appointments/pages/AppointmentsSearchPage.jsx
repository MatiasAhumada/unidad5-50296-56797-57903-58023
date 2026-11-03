import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';
import IconButton from '../../shared/components/IconButton';

const specialtyFilterOptions = [
  { value: 'Todas', label: 'Todas las Especialidades' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'General Checkup', label: 'General Checkup' },
];

const doctorFilterOptions = [
  { value: 'Todos', label: 'Todos los Doctores' },
  { value: 'Dr. Robert Smith', label: 'Dr. Robert Smith' },
  { value: 'Dra. Garcia', label: 'Dra. Garcia' },
  { value: 'Dr. Miller', label: 'Dr. Miller' },
];

import Icon from '../../shared/components/Icon';
import { ICONS } from '../../shared/constants/icons';

function AppointmentsSearchPage() {
  const [patientQuery, setPatientQuery] = useState('Johnathan Doe');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todas');
  const [doctorFilter, setDoctorFilter] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('2023-10-24');

  const appointmentsData = [
    {
      id: 1,
      date: '24 Oct, 2023',
      time: '10:30 AM',
      department: 'Cardiology',
      doctor: 'Dr. Robert Smith',
      patient: 'Johnathan Doe',
      dni: '40.123.456',
      status: 'CONFIRMADO',
      statusType: 'confirmed',
      icon: ICONS.heart,
    },
    {
      id: 2,
      date: '15 Oct, 2023',
      time: '09:15 AM',
      department: 'Neurology',
      doctor: 'Dra. Garcia',
      patient: 'Johnathan Doe',
      dni: '40.123.456',
      status: 'COMPLETADO',
      statusType: 'completed',
      icon: ICONS.brain,
    },
    {
      id: 3,
      date: '05 Oct, 2023',
      time: '11:00 AM',
      department: 'General Checkup',
      doctor: 'Dr. Miller',
      patient: 'Johnathan Doe',
      dni: '40.123.456',
      status: 'CANCELADO',
      statusType: 'cancelled',
      icon: ICONS.medicalFile,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {/* Card Superior: Criterios de Búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-med-text-muted">
            <Icon icon={ICONS.refresh} size={16} />
            <span>Última actualización: hace un momento</span>
          </div>
        </div>

        {/* Inputs de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end">
          <FormField
            id="appointment-patient-query"
            label="Nombre o DNI del Paciente"
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
                  id="appointment-patient-query"
                  type="text"
                  placeholder="Nombre o DNI..."
                  value={patientQuery}
                  onChange={(event) => setPatientQuery(event.target.value)}
                  className="pl-9 pr-3 py-2 text-xs"
                  {...fieldProps}
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
                id="appointment-specialty-filter"
                value={specialtyFilter}
                onChange={(event) => setSpecialtyFilter(event.target.value)}
                className="px-3 py-2 text-xs"
                options={specialtyFilterOptions}
                {...fieldProps}
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
                id="appointment-doctor-filter"
                value={doctorFilter}
                onChange={(event) => setDoctorFilter(event.target.value)}
                className="px-3 py-2 text-xs"
                options={doctorFilterOptions}
                {...fieldProps}
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
                id="appointment-date-filter"
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="px-3 py-2 text-xs"
                {...fieldProps}
              />
            )}
          </FormField>

          {/* Botón Aplicar Filtros */}
          <div>
            <Button
              onClick={() => alert('Filtros aplicados')}
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2 rounded-lg"
            >
              <Icon icon={ICONS.filter} size={16} />
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </div>

        {/* Chips de Filtros Activos */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
            Paciente: Johnathan Doe
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
            DNI: 40.123.456
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Filtro Activo: Próximos 7 Días
          </span>
        </div>
      </Card>

      {/* Card Inferior: Registros de Citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {/* Tabla de Citas */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {appointmentsData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Fecha y Hora */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-med-primary-900 text-sm">
                      {item.date}
                    </p>
                    <p className="text-xs text-med-text-muted mt-0.5">
                      {item.time}
                    </p>
                  </td>

                  {/* Departamento / Especialidad con Icono */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                        <Icon icon={item.icon} size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-med-primary-900">
                          {item.department}
                        </p>
                        <p className="text-xs text-med-text-muted">
                          {item.doctor}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Paciente y DNI */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-med-text-main">
                      {item.patient}
                    </p>
                    <p className="text-xs text-med-text-muted mt-0.5">
                      DNI: {item.dni}
                    </p>
                  </td>

                  {/* Estado (CONFIRMADO, COMPLETADO, CANCELADO) */}
                  <td className="px-6 py-4 text-center">
                    {item.statusType === 'confirmed' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-med-active-text" />
                        {item.status}
                      </span>
                    )}
                    {item.statusType === 'completed' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        {item.status}
                      </span>
                    )}
                    {item.statusType === 'cancelled' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-danger-bg text-med-danger-text">
                        <span className="w-1.5 h-1.5 rounded-full bg-med-danger-text" />
                        {item.status}
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        alert(`Ver detalle de cita de ${item.patient}`)
                      }
                      className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 transition hover:underline"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior normalizado */}
        <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
          <span>Mostrando 3 de 42 registros</span>
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

export default AppointmentsSearchPage;
