import { useMemo, useState } from 'react';

const doctors = [
  {
    id: 'james-wilson',
    initials: 'JW',
    name: 'Dr. James Wilson',
    specialty: 'Cardiología',
    status: 'Activo',
    searchable: 'james wilson cardiología',
    avatar: 'avatar--james',
  },
  {
    id: 'elena-rodriguez',
    initials: 'ER',
    name: 'Dra. Elena Rodríguez',
    specialty: 'Neurología',
    status: 'Activo',
    searchable: 'elena rodriguez neurología',
    avatar: 'avatar--elena',
  },
  {
    id: 'robert-chen',
    initials: 'RC',
    name: 'Dr. Robert Chen',
    specialty: 'Pediatría',
    status: 'De licencia',
    searchable: 'robert chen pediatría',
    avatar: 'avatar--robert',
  },
];

function DoctorDirectory({ onAction }) {
  const [search, setSearch] = useState('');
  const visibleDoctors = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');

    return query
      ? doctors.filter((doctor) =>
          doctor.searchable.toLocaleLowerCase('es').includes(query)
        )
      : doctors;
  }, [search]);

  return (
    <section
      className="directory-card"
      id="doctores"
      aria-labelledby="directory-title"
    >
      <div className="directory-header">
        <div>
          <p className="section-kicker">Directorio</p>
          <h2 id="directory-title">Directorio de profesionales médicos</h2>
        </div>
        <label className="search-box" htmlFor="doctor-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="5.6" />
            <path d="m15 15 4.4 4.4" />
          </svg>
          <input
            id="doctor-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre…"
          />
        </label>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nombre del doctor</th>
              <th>Especialidad</th>
              <th>Estado de disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibleDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>
                  <div className="doctor-name">
                    <span className={`avatar ${doctor.avatar}`}>
                      {doctor.initials}
                    </span>
                    <strong>{doctor.name}</strong>
                  </div>
                </td>
                <td>{doctor.specialty}</td>
                <td>
                  <span
                    className={`availability ${doctor.status === 'Activo' ? 'availability--active' : 'availability--leave'}`}
                  >
                    <i />
                    {doctor.status}
                  </span>
                </td>
                <td>
                  <button
                    className="row-action"
                    type="button"
                    aria-label={`Ver acciones de ${doctor.name}`}
                    onClick={() =>
                      onAction(`Acciones del profesional: ${doctor.name}`)
                    }
                  >
                    ···
                  </button>
                </td>
              </tr>
            ))}
            {visibleDoctors.length === 0 && (
              <tr>
                <td colSpan="4">No se encontraron profesionales.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="directory-footer">
        <span>
          {search
            ? `Mostrando ${visibleDoctors.length} resultado${visibleDoctors.length === 1 ? '' : 's'} de ${doctors.length}`
            : `Mostrando 1 a ${visibleDoctors.length} de ${doctors.length} resultados`}
        </span>
      </div>
    </section>
  );
}

export default DoctorDirectory;
