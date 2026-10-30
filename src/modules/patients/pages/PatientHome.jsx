import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import Select from '../../shared/components/Select';

function PatientHome() {
  const navigate = useNavigate();

  // Estados de selección de filtros
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiología');
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-1');

  // Médicos disponibles
  const doctorsList = [
    {
      id: 'doc-1',
      name: 'Dr. Alejandro Martínez',
      specialty: 'Cardiología',
      specialtyDetail: 'Cardiología Intervencionista',
      clinic: 'Clínica San Rafael • Sede Central Consultorio 402',
      badge: 'Verificado',
      avatar: '👨‍⚕️',
    },
    {
      id: 'doc-2',
      name: 'Dra. Elena Martínez',
      specialty: 'Pediatría',
      specialtyDetail: 'Pediatría Avanzada',
      clinic: 'Clínica San Rafael • Consultorio 104',
      badge: 'Verificado',
      avatar: '👩‍⚕️',
    },
    {
      id: 'doc-3',
      name: 'Dr. Marcos Torres',
      specialty: 'Neurología',
      specialtyDetail: 'Neurocirugía Clínica',
      clinic: 'Clínica San Rafael • Consultorio 202',
      badge: 'Verificado',
      avatar: '👨‍⚕️',
    },
  ];

  const currentDoctor =
    doctorsList.find((doc) => doc.id === selectedDoctorId) || doctorsList[0];

  // Días de la semana disponible
  const weekDays = [
    { dayName: 'LUN', dateNumber: '22', fullDate: 'Lunes 22 de Mayo de 2024' },
    { dayName: 'MAR', dateNumber: '23', fullDate: 'Martes 23 de Mayo de 2024' },
    {
      dayName: 'MIE',
      dateNumber: '24',
      fullDate: 'Miércoles 24 de Mayo de 2024',
    },
    { dayName: 'JUE', dateNumber: '25', fullDate: 'Jueves 25 de Mayo de 2024' },
    {
      dayName: 'VIE',
      dateNumber: '26',
      fullDate: 'Viernes 26 de Mayo de 2024',
    },
  ];

  // Horarios por día
  const slotsByDay = {
    22: ['08:00', '08:30', '09:00', '09:30', '10:00', '11:30'],
    23: ['08:00', '09:00', '10:30', '11:00', '12:30'],
    24: ['08:30', '09:30', '11:00', '11:30'],
    25: [], // Sin turnos disponibles
    26: ['08:00', '08:30', '09:00', '14:00', '14:30'],
  };

  // Día y slot horario seleccionado
  const [selectedDayNumber, setSelectedDayNumber] = useState('22');
  const [selectedSlot, setSelectedSlot] = useState('09:30');
  const [confirmedModal, setConfirmedModal] = useState(false);

  const selectedDayObj =
    weekDays.find((d) => d.dateNumber === selectedDayNumber) || weekDays[0];

  const handleSelectSlot = (dayNum, slot) => {
    setSelectedDayNumber(dayNum);
    setSelectedSlot(slot);
  };

  const handleConfirmAppointment = () => {
    setConfirmedModal(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* 1. Card Superior: Selector de Especialidad y Doctor */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <FormField
            id="patient-specialty"
            label="Seleccionar Especialidad"
            className="md:col-span-5"
            labelClassName="text-xs font-semibold text-med-text-sub"
          >
            {(fieldProps) => (
              <div className="relative">
                <Select
                  id="patient-specialty"
                  value={selectedSpecialty}
                  onChange={(event) => setSelectedSpecialty(event.target.value)}
                  className="appearance-none pr-10 cursor-pointer"
                  {...fieldProps}
                >
                  <option value="Cardiología">Cardiología</option>
                  <option value="Pediatría">Pediatría</option>
                  <option value="Neurología">Neurología</option>
                  <option value="Dermatología">Dermatología</option>
                  <option value="Medicina General">Medicina General</option>
                </Select>
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            )}
          </FormField>

          <FormField
            id="patient-doctor"
            label="Seleccionar Doctor"
            className="md:col-span-4"
            labelClassName="text-xs font-semibold text-med-text-sub"
          >
            {(fieldProps) => (
              <div className="relative">
                <Select
                  id="patient-doctor"
                  value={selectedDoctorId}
                  onChange={(event) => setSelectedDoctorId(event.target.value)}
                  className="appearance-none pr-10 cursor-pointer"
                  {...fieldProps}
                >
                  {doctorsList.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </Select>
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </div>
            )}
          </FormField>

          {/* Botón Buscar Disponibilidad */}
          <div className="md:col-span-3">
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2.5 rounded-lg shadow-sm"
              onClick={() => {}}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Buscar Disponibilidad</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Card de Información del Doctor Seleccionado (Sin reseñas de doctor) */}
      <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
        <div className="relative shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200">
            {currentDoctor.avatar}
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
              {currentDoctor.name}
            </h2>
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-med-primary-100 text-med-primary-700">
              {currentDoctor.badge}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold uppercase sm:normal-case tracking-wide sm:tracking-normal text-med-primary-700 sm:text-med-text-sub mt-0.5">
            {currentDoctor.specialtyDetail}
          </p>
          <p className="text-xs text-med-text-muted mt-0.5 truncate">
            {currentDoctor.clinic}
          </p>
        </div>
      </Card>

      {/* 3. Selector Semanal de Disponibilidad */}
      <Card className="p-5 sm:p-6 border-med-border">
        {/* Cabecera del calendario de semana */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
            >
              ‹
            </button>
            <span className="font-bold text-sm sm:text-base text-med-primary-900">
              Lunes 22 - Viernes 26, Mayo
            </span>
            <button
              type="button"
              className="p-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
            >
              ›
            </button>
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-4 text-xs text-med-text-sub">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-med-primary-900" />
              Disponible
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Seleccionado
            </span>
          </div>
        </div>

        {/* --- A) VISTA DESKTOP: Grid semanal de 5 columnas (visible en sm+) --- */}
        <div className="hidden sm:grid sm:grid-cols-5 gap-3 pt-5">
          {weekDays.map((day) => {
            const slots = slotsByDay[day.dateNumber] || [];

            return (
              <div
                key={day.dateNumber}
                className="flex flex-col items-center gap-3"
              >
                {/* Cabecera del día */}
                <div className="text-center">
                  <span className="text-[11px] font-bold text-med-text-sub uppercase">
                    {day.dayName}
                  </span>
                  <p className="text-xl font-bold text-med-primary-900 leading-tight">
                    {day.dateNumber}
                  </p>
                </div>

                {/* Slots del día */}
                <div className="w-full flex flex-col gap-2">
                  {slots.length > 0 ? (
                    slots.map((slot) => {
                      const isSelected =
                        selectedDayNumber === day.dateNumber &&
                        selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSelectSlot(day.dateNumber, slot)}
                          className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                            isSelected
                              ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                              : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })
                  ) : (
                    <div className="h-44 flex items-center justify-center text-center p-2">
                      <p className="text-xs text-med-text-muted leading-relaxed">
                        No hay turnos disponibles para este día.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- B) VISTA MOBILE: Selector de días horizontal + Horarios en bloques (visible en mobile) --- */}
        <div className="block sm:hidden pt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-med-text-main">
                Próximos Turnos
              </span>
              <span className="text-xs font-semibold text-med-primary-700">
                Ver más ›
              </span>
            </div>

            {/* Días en fila desplazable */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {weekDays.map((day) => {
                const isActive = selectedDayNumber === day.dateNumber;

                return (
                  <button
                    key={day.dateNumber}
                    type="button"
                    onClick={() => {
                      setSelectedDayNumber(day.dateNumber);
                      const availableSlots = slotsByDay[day.dateNumber] || [];

                      if (
                        availableSlots.length > 0 &&
                        !availableSlots.includes(selectedSlot)
                      ) {
                        setSelectedSlot(availableSlots[0]);
                      }
                    }}
                    className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${
                      isActive
                        ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                        : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-bold uppercase ${
                        isActive ? 'text-white/80' : 'text-med-text-sub'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span className="block text-base font-extrabold my-0.5">
                      {day.dateNumber}
                    </span>
                    <span
                      className={`block text-[10px] uppercase ${
                        isActive ? 'text-white/80' : 'text-med-text-muted'
                      }`}
                    >
                      MAY
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horarios disponibles para el día seleccionado en mobile */}
          <div>
            <span className="block text-xs font-bold text-med-text-sub mb-2.5">
              Horarios disponibles (Bloques de 30 min)
            </span>

            {slotsByDay[selectedDayNumber]?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {slotsByDay[selectedDayNumber].map((slot) => {
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleSelectSlot(selectedDayNumber, slot)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                        isSelected
                          ? 'border-2 border-med-primary-900 bg-white text-med-primary-900 font-bold shadow-xs'
                          : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                      }`}
                    >
                      {slot} AM
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-med-border rounded-xl text-center">
                <p className="text-xs text-med-text-muted">
                  No hay turnos disponibles para este día seleccionado.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 4. Banner / Resumen de Selección y Confirmación */}
      <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Detalle del Turno */}
        <div className="border-l-4 border-med-primary-900 pl-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
            Resumen de Selección
          </span>
          <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
            <span>📅</span>
            <span>
              {selectedDayObj.fullDate}, {selectedSlot} HS
            </span>
          </p>
          <p className="text-xs text-med-text-sub mt-0.5">
            {currentDoctor.clinic} • Duración: 30 min
          </p>
        </div>

        {/* Botón de Confirmación */}
        <Button
          type="button"
          onClick={handleConfirmAppointment}
          className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm shrink-0"
        >
          <span>Confirmar Turno</span>
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Button>
      </div>

      {/* Modal de Confirmación Exitosa */}
      {confirmedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con el{' '}
              <strong className="text-med-text-main">
                {currentDoctor.name}
              </strong>{' '}
              ha sido reservado para el{' '}
              <strong className="text-med-text-main">
                {selectedDayObj.fullDate} a las {selectedSlot} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong> {currentDoctor.specialtyDetail}
              </p>
              <p>
                <strong>Lugar:</strong> {currentDoctor.clinic}
              </p>
              <p>
                <strong>Paciente:</strong> Johnathan Doe (DNI: 40.123.456)
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={() => setConfirmedModal(false)}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
