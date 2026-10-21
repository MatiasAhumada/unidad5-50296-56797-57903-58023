import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function AppointmentsPage() {
  const sampleAppointments = [
    {
      id: 1,
      doctor: 'Dra. María González',
      specialty: 'Cardiología',
      date: '2026-10-28',
      time: '10:30 hs',
      status: 'Confirmado',
    },
    {
      id: 2,
      doctor: 'Dr. Lucas Fernández',
      specialty: 'Traumatología',
      date: '2026-11-05',
      time: '15:00 hs',
      status: 'Pendiente',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Mis Turnos Médicos
          </h1>
          <p className="text-gray-600 text-sm">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => alert('Función de nuevo turno próximamente')}>
          + Solicitar Nuevo Turno
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleAppointments.map((appt) => (
          <Card key={appt.id} className="flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  {appt.specialty}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    appt.status === 'Confirmado'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {appt.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{appt.doctor}</h3>
              <p className="text-gray-700 mt-1">
                Fecha: <span className="font-medium">{appt.date}</span> a las{' '}
                <span className="font-medium">{appt.time}</span>
              </p>
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="secondary"
                className="w-full text-sm"
                onClick={() => alert(`Cancelando turno ${appt.id}`)}
              >
                Cancelar Turno
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AppointmentsPage;
