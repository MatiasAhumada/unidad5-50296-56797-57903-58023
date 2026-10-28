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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => alert('Función de nuevo turno próximamente')}>
          + Solicitar Nuevo Turno
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sampleAppointments.map((appt) => (
          <Card
            key={appt.id}
            className="flex flex-col justify-between gap-4 p-6"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                  {appt.specialty}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    appt.status === 'Confirmado'
                      ? 'bg-med-active-bg text-med-active-text'
                      : 'bg-med-leave-bg text-med-leave-text'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {appt.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-med-primary-900">
                {appt.doctor}
              </h3>
              <p className="text-sm text-med-text-sub mt-2">
                Fecha:{' '}
                <strong className="text-med-text-main font-semibold">
                  {appt.date}
                </strong>{' '}
                a las{' '}
                <strong className="text-med-text-main font-semibold">
                  {appt.time}
                </strong>
              </p>
            </div>
            <div className="flex gap-2 pt-3 border-t border-med-border">
              <Button
                variant="outline"
                className="w-full text-xs"
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
