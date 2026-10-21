import { Link } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function PatientHome() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Bienvenido al Portal del Paciente
        </h1>
        <p className="text-blue-800">
          Desde aquí puedes gestionar tus turnos médicos, consultar las
          especialidades disponibles y ver el historial de tus consultas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Próximos Turnos
          </h3>
          <p className="text-gray-600 mb-4">
            Revisa la fecha, hora y especialista de tus citas programadas.
          </p>
          <Link to="/appointments">
            <Button>Ver mis turnos</Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Solicitar Nuevo Turno
          </h3>
          <p className="text-gray-600 mb-4">
            Elige una especialidad médica, profesional y horario disponible.
          </p>
          <Link to="/appointments">
            <Button variant="secondary">Agendar cita</Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Atención al Paciente
          </h3>
          <p className="text-gray-600">
            Horario de atención: Lunes a Viernes de 08:00 a 20:00 hs.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Urgencias: Línea directa 107
          </p>
        </Card>
      </div>
    </div>
  );
}

export default PatientHome;
