import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function PatientsAdmin() {
  const samplePatients = [
    {
      id: 'PAC-001',
      name: 'Carlos Benítez',
      dni: '32.145.890',
      phone: '+54 11 4455-6677',
      lastVisit: '2026-10-15',
    },
    {
      id: 'PAC-002',
      name: 'Laura Gómez',
      dni: '29.876.543',
      phone: '+54 11 5566-7788',
      lastVisit: '2026-10-18',
    },
    {
      id: 'PAC-003',
      name: 'Martín Rodríguez',
      dni: '38.234.567',
      phone: '+54 11 6677-8899',
      lastVisit: '2026-09-30',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Pacientes
          </h1>
          <p className="text-gray-600 text-sm">
            Administración del registro de pacientes del centro médico.
          </p>
        </div>
        <Button onClick={() => alert('Registrar nuevo paciente')}>
          + Nuevo Paciente
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">DNI</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Última Visita</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {samplePatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {patient.id}
                </td>
                <td className="px-4 py-3">{patient.name}</td>
                <td className="px-4 py-3">{patient.dni}</td>
                <td className="px-4 py-3">{patient.phone}</td>
                <td className="px-4 py-3">{patient.lastVisit}</td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => alert(`Historial de ${patient.name}`)}
                  >
                    Ver Historia Clínica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default PatientsAdmin;
