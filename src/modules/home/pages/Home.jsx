import Card from '../../shared/components/Card';

function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <p className="text-gray-600 text-sm">
          Resumen general del centro médico y actividad reciente.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
        <Card>
          <h3 className="font-semibold text-gray-700">Pacientes Registrados</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">1,248</p>
          <span className="text-xs text-gray-500">+12 esta semana</span>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-700">Turnos Médicos Hoy</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">42</p>
          <span className="text-xs text-gray-500">
            8 pendientes de atención
          </span>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-700">Médicos en Servicio</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">15</p>
          <span className="text-xs text-gray-500">
            En 6 consultorios activos
          </span>
        </Card>
      </div>
    </div>
  );
}

export default Home;
