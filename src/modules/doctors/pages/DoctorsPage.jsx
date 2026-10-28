import { useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

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
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
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
            </span>
            <input
              type="text"
              placeholder="Buscar doctor por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={() => alert('Abrir modal de disponibilidad horaria')}
            className="flex items-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
                      <button
                        title="Ver detalle"
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                        onClick={() => alert(`Ver detalle de ${doc.name}`)}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      <button
                        title="Editar profesional"
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                        onClick={() => alert(`Editar profesional ${doc.name}`)}
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>

                      <button
                        title="Eliminar profesional"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() =>
                          alert(`Eliminar profesional ${doc.name}`)
                        }
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
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
            <button className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50">
              ‹
            </button>
            <button className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50">
              ›
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DoctorsPage;
