import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function AppointmentsAdmin() {
  const sampleAppointments = [
    {
      id: 'TUR-101',
      patient: 'Carlos Benítez',
      doctor: 'Dra. María González',
      specialty: 'Cardiología',
      date: '2026-10-21',
      time: '16:00 hs',
      status: 'En Espera',
    },
    {
      id: 'TUR-102',
      patient: 'Laura Gómez',
      doctor: 'Dr. Lucas Fernández',
      specialty: 'Traumatología',
      date: '2026-10-21',
      time: '16:30 hs',
      status: 'Confirmado',
    },
    {
      id: 'TUR-103',
      patient: 'Martín Rodríguez',
      doctor: 'Dra. Andrea Sosa',
      specialty: 'Pediatría',
      date: '2026-10-21',
      time: '17:00 hs',
      status: 'Completado',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Administración de Turnos Médicos
          </h1>
          <p className="text-gray-600 text-sm">
            Agenda global de turnos y control de consultorios.
          </p>
        </div>
        <Button onClick={() => alert('Crear nuevo turno')}>
          + Asignar Turno
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Especialista</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Horario</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sampleAppointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {appt.id}
                </td>
                <td className="px-4 py-3">{appt.patient}</td>
                <td className="px-4 py-3">{appt.doctor}</td>
                <td className="px-4 py-3">{appt.specialty}</td>
                <td className="px-4 py-3">
                  {appt.date} {appt.time}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      appt.status === 'Confirmado'
                        ? 'bg-blue-100 text-blue-800'
                        : appt.status === 'En Espera'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default AppointmentsAdmin;
