import { useEffect, useMemo, useState } from 'react';
import SpecialtyForm from '../components/SpecialtyForm';
import SpecialtyTable from '../components/SpecialtyTable';
import { loadSpecialties, persistSpecialties } from '../services/specialties';

const PAGE_SIZE = 5;

function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formSpecialty, setFormSpecialty] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;

    loadSpecialties()
      .then((data) => {
        if (active) setSpecialties(data);
      })
      .catch(() => {
        if (active) setLoadError('No se pudieron cargar las especialidades.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredSpecialties = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');

    if (!query) return specialties;

    return specialties.filter((specialty) =>
      `${specialty.name} ${specialty.description}`
        .toLocaleLowerCase('es')
        .includes(query)
    );
  }, [search, specialties]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSpecialties.length / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleSpecialties = filteredSpecialties.slice(
    start,
    start + PAGE_SIZE
  );
  const newThisMonth = specialties.filter((specialty) => {
    if (!specialty.createdAt) return false;

    const created = new Date(specialty.createdAt);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  });

  const saveSpecialty = (values) => {
    const updated = formSpecialty
      ? specialties.map((specialty) =>
          specialty.id === formSpecialty.id
            ? {
                ...values,
                id: formSpecialty.id,
                createdAt: formSpecialty.createdAt,
              }
            : specialty
        )
      : [
          {
            ...values,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...specialties,
        ];

    setSpecialties(updated);
    persistSpecialties(updated);
    setPage(1);
    closeForm();
  };

  const deleteSpecialty = (specialty) => {
    if (!window.confirm(`¿Querés eliminar la especialidad ${specialty.name}?`))
      return;

    const updated = specialties.filter((item) => item.id !== specialty.id);

    setSpecialties(updated);
    persistSpecialties(updated);
  };

  const closeForm = () => {
    setFormSpecialty(null);
    setIsCreating(false);
  };

  const openNewForm = () => {
    setFormSpecialty(null);
    setIsCreating(true);
  };

  if (isCreating || formSpecialty) {
    return (
      <SpecialtyForm
        specialty={formSpecialty}
        onSave={saveSpecialty}
        onCancel={closeForm}
      />
    );
  }

  return (
    <>
      <div className="specialty-listing">
        <section className="page-heading">
          <div>
            <p className="section-kicker">Administración médica</p>
            <h1>Directorio de especialidades</h1>
            <p>
              Administrá las categorías médicas, los servicios y su
              disponibilidad.
            </p>
          </div>
          <div className="heading-actions">
            <label className="search-box" htmlFor="specialty-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                id="specialty-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Buscar especialidad..."
              />
            </label>
            <button
              className="button button--primary"
              type="button"
              onClick={openNewForm}
            >
              + Nueva especialidad
            </button>
          </div>
        </section>

        <section className="directory-card" aria-labelledby="specialties-title">
          <div className="directory-header">
            <div>
              <p className="section-kicker">Catálogo</p>
              <h2 id="specialties-title">Especialidades</h2>
            </div>
          </div>
          {loadError ? (
            <p className="directory-message" role="alert">
              {loadError}
            </p>
          ) : loading ? (
            <p className="directory-message" role="status">
              Cargando especialidades...
            </p>
          ) : (
            <SpecialtyTable
              specialties={visibleSpecialties}
              onEdit={setFormSpecialty}
              onDelete={deleteSpecialty}
            />
          )}
          <div className="directory-footer">
            <span>
              {loading
                ? 'Cargando...'
                : `Mostrando ${filteredSpecialties.length === 0 ? 0 : start + 1} a ${Math.min(start + PAGE_SIZE, filteredSpecialties.length)} de ${filteredSpecialties.length}`}
            </span>
            <div className="pagination">
              <button
                type="button"
                aria-label="Página anterior"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Página siguiente"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
              >
                ›
              </button>
            </div>
          </div>
        </section>

        <section
          className="stats-grid specialty-stats"
          aria-label="Resumen de especialidades"
        >
          <article className="stat-card">
            <div className="stat-card__top">
              <span className="stat-icon stat-icon--blue">
                <svg viewBox="0 0 24 24">
                  <path d="M6 18V8M12 18V6M18 18v-9" />
                </svg>
              </span>
              <span className="trend trend--up">Catálogo</span>
            </div>
            <p>Total de especialidades</p>
            <strong>{specialties.length}</strong>
          </article>
          <article className="stat-card">
            <div className="stat-card__top">
              <span className="stat-icon stat-icon--cyan">
                <svg viewBox="0 0 24 24">
                  <path d="M8 17V7.5A2.5 2.5 0 0 1 10.5 5h3A2.5 2.5 0 0 1 16 7.5V17M6 12h12" />
                </svg>
              </span>
              <span className="trend trend--today">Más demandada</span>
            </div>
            <p>Especialidad destacada</p>
            <strong>Cardiología</strong>
          </article>
          <article className="stat-card">
            <div className="stat-card__top">
              <span className="stat-icon stat-icon--green">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </span>
              <span className="trend trend--up">
                {String(newThisMonth.length).padStart(2, '0')}
              </span>
            </div>
            <p>Nuevas este mes</p>
            <strong>
              {newThisMonth.length ? newThisMonth.at(-1).name : 'Sin nuevas'}
            </strong>
          </article>
        </section>
      </div>
    </>
  );
}

export default SpecialtiesPage;
