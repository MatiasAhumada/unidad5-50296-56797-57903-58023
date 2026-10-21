import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function DoctorsAdmin() {
  const sampleDoctors = [
    {
      id: 'MED-01',
      name: 'Dra. María González',
      specialty: 'Cardiología',
      room: 'Consultorio 101',
      schedule: 'Lun, Mié, Vie (08:00 - 13:00)',
    },
    {
      id: 'MED-02',
      name: 'Dr. Lucas Fernández',
      specialty: 'Traumatología',
      room: 'Consultorio 104',
      schedule: 'Mar, Jue (14:00 - 19:00)',
    },
    {
      id: 'MED-03',
      name: 'Dra. Andrea Sosa',
      specialty: 'Pediatría',
      room: 'Consultorio 202',
      schedule: 'Lun a Vie (09:00 - 15:00)',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cuerpo Médico y Especialidades
          </h1>
          <p className="text-gray-600 text-sm">
            Control de profesionales, consultorios asignados y horarios de
            atención.
          </p>
        </div>
        <Button onClick={() => alert('Dar de alta médico')}>
          + Nuevo Profesional
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleDoctors.map((doc) => (
          <Card key={doc.id} className="flex flex-col justify-between gap-3">
            <div>
              <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-800 rounded">
                {doc.specialty}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">
                {doc.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{doc.room}</p>
              <p className="text-xs text-gray-500 mt-2">
                Horario: {doc.schedule}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <Button
                variant="secondary"
                className="w-full text-xs"
                onClick={() => alert(`Gestionar turnos de ${doc.name}`)}
              >
                Ver Agenda
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DoctorsAdmin;
