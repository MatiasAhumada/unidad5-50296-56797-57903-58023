import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

function AdminDashboardPage() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const visibleDoctors = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');

    return query
      ? doctors.filter((doctor) =>
          doctor.searchable.toLocaleLowerCase('es').includes(query)
        )
      : doctors;
  }, [search]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="section-kicker">Panel de administración</p>
          <h1>Vista general de gestión</h1>
          <p>
            Configurá el personal médico y las especialidades del departamento.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="button button--primary"
            type="button"
            onClick={() =>
              setToast(
                'El formulario para agregar un doctor estará disponible próximamente.'
              )
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar nuevo doctor
          </button>
          <button
            className="button button--outline"
            type="button"
            onClick={() => navigate('/admin/specialties')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 4 3 5H9l3-5ZM6 14h5v5H6zM13 14h5v5h-5zM12 9v3" />
            </svg>
            Agregar especialidad
          </button>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen de actividad">
        <article className="stat-card">
          <div className="stat-card__top">
            <span className="stat-icon stat-icon--blue">
              <svg viewBox="0 0 24 24">
                <path d="M5 8h14v12H5zM8.5 8V6.5A2.5 2.5 0 0 1 11 4h2a2.5 2.5 0 0 1 2.5 2.5V8M12 11v5M9.5 13.5h5" />
              </svg>
            </span>
            <span className="trend trend--up">+4 este mes</span>
          </div>
          <p>Doctores activos</p>
          <strong>124</strong>
        </article>
        <article className="stat-card">
          <div className="stat-card__top">
            <span className="stat-icon stat-icon--cyan">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </span>
            <span className="trend">Estable</span>
          </div>
          <p>Especialidades activas</p>
          <strong>32</strong>
        </article>
        <article className="stat-card">
          <div className="stat-card__top">
            <span className="stat-icon stat-icon--green">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="6" width="14" height="14" rx="2" />
                <path d="M8 4v4M16 4v4M5 10h14M9 14.2l2 2 4-4" />
              </svg>
            </span>
            <span className="trend trend--today">Hoy</span>
          </div>
          <p>Turnos confirmados para hoy</p>
          <strong>48</strong>
        </article>
      </section>

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
                        setToast(`Acciones del profesional: ${doctor.name}`)
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
              ? `Mostrando ${visibleDoctors.length} resultado${visibleDoctors.length === 1 ? '' : 's'} de 124`
              : 'Mostrando 1 a 3 de 124 resultados'}
          </span>
          <div className="pagination">
            <button type="button" aria-label="Página anterior" disabled>
              ‹
            </button>
            <button type="button" aria-label="Página siguiente">
              ›
            </button>
          </div>
        </div>
      </section>
      <div
        className={`toast${toast ? ' is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}

export default AdminDashboardPage;
