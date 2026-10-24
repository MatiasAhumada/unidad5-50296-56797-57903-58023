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
      <div>
        <section className="mb-[26px] flex flex-col items-start justify-between gap-[25px] lg:flex-row lg:items-end">
          <div>
            <p className="mb-[7px] mt-0 text-[11px] font-bold tracking-[.12em] text-[#7e91a2] uppercase">Administración médica</p>
            <h1 className="m-0 font-[Manrope,sans-serif] text-[clamp(28px,3vw,35px)] leading-[1.2] tracking-[-.055em] text-[#052f5d]">Directorio de especialidades</h1>
            <p className="mt-[9px] mb-0 text-sm text-[#718193]">
              Administrá las categorías médicas, los servicios y su
              disponibilidad.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
            <label className="flex h-[39px] w-full items-center gap-2 rounded-[3px] border border-[#c7e4f2] bg-[#e5f5fd] px-[11px] text-[#52738a] sm:w-[220px]" htmlFor="specialty-search">
              <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
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
              className="inline-flex min-h-[45px] items-center justify-center gap-2 whitespace-nowrap rounded-[5px] px-[17px] text-[12px] font-bold tracking-[.01em] transition hover:-translate-y-px hover:shadow-[0_7px_13px_rgba(8,59,99,.14)] border border-[#052f5d] bg-[#052f5d] text-white"
              type="button"
              onClick={openNewForm}
            >
              + Nueva especialidad
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.85)] shadow-[0_8px_25px_rgba(27,70,96,.035)]" aria-labelledby="specialties-title">
          <div className="flex min-h-[70px] flex-col items-start justify-between gap-[15px] border-b border-[#cfdae3] px-[15px] pt-[15px] pb-3 sm:flex-row sm:items-center">
            <div>
              <p className="mb-[7px] mt-0 hidden text-[11px] font-bold tracking-[.12em] text-[#7e91a2] uppercase">Catálogo</p>
              <h2 className="m-0 font-[Manrope,sans-serif] text-[17px] tracking-[-.025em] text-[#052f5d]" id="specialties-title">Especialidades</h2>
            </div>
          </div>
          {loadError ? (
            <p className="px-[15px] py-6 text-xs text-[#536476]" role="alert">
              {loadError}
            </p>
          ) : loading ? (
            <p className="px-[15px] py-6 text-xs text-[#536476]" role="status">
              Cargando especialidades...
            </p>
          ) : (
            <SpecialtyTable
              specialties={visibleSpecialties}
              onEdit={setFormSpecialty}
              onDelete={deleteSpecialty}
            />
          )}
          <div className="flex min-h-[52px] items-center justify-between border-t border-[#d3e0e7] bg-[#e4f5fd] px-[15px] text-[10px] text-[#728394]">
            <span>
              {loading
                ? 'Cargando...'
                : `Mostrando ${filteredSpecialties.length === 0 ? 0 : start + 1} a ${Math.min(start + PAGE_SIZE, filteredSpecialties.length)} de ${filteredSpecialties.length}`}
            </span>
            <div className="flex gap-1">
              <button className="grid h-[23px] w-[23px] place-items-center rounded-[2px] border border-[#c9dfe9] bg-[rgba(255,255,255,.35)] text-[16px] leading-none text-[#375d76] disabled:cursor-not-allowed disabled:opacity-45 hover:bg-white"
                type="button"
                aria-label="Página anterior"
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                ‹
              </button>
              <button className="grid h-[23px] w-[23px] place-items-center rounded-[2px] border border-[#c9dfe9] bg-[rgba(255,255,255,.35)] text-[16px] leading-none text-[#375d76] disabled:cursor-not-allowed disabled:opacity-45 hover:bg-white"
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
          className="mb-[25px] grid grid-cols-1 gap-[14px] md:grid-cols-3 mt-[22px]"
          aria-label="Resumen de especialidades"
        >
          <article className="min-h-[105px] rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.76)] px-[15px] pt-[15px] pb-[14px] shadow-[0_6px_20px_rgba(24,65,91,.025)] md:min-h-[120px]">
            <div className="flex min-h-10 items-start justify-between">
              <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#f0f5fa] text-[#093d78]">
                <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24">
                  <path d="M6 18V8M12 18V6M18 18v-9" />
                </svg>
              </span>
              <span className="rounded-[3px] bg-[#effcf9] px-[7px] py-1 text-[10px] font-bold text-[#13a695]">Catálogo</span>
            </div>
            <p className="mt-0 mb-[5px] text-xs font-semibold uppercase text-[#354b61]">Total de especialidades</p>
            <strong className="font-[Manrope,sans-serif] text-[23px] tracking-[-.04em] text-[#052f5d]">{specialties.length}</strong>
          </article>
          <article className="min-h-[105px] rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.76)] px-[15px] pt-[15px] pb-[14px] shadow-[0_6px_20px_rgba(24,65,91,.025)] md:min-h-[120px]">
            <div className="flex min-h-10 items-start justify-between">
              <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#edf8fc] text-[#0780b8]">
                <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24">
                  <path d="M8 17V7.5A2.5 2.5 0 0 1 10.5 5h3A2.5 2.5 0 0 1 16 7.5V17M6 12h12" />
                </svg>
              </span>
              <span className="rounded-[3px] bg-[#eef4ff] px-[7px] py-1 text-[10px] font-bold text-[#2978da]">Más demandada</span>
            </div>
            <p className="mt-0 mb-[5px] text-xs font-semibold uppercase text-[#354b61]">Especialidad destacada</p>
            <strong className="font-[Manrope,sans-serif] text-[23px] tracking-[-.04em] text-[#052f5d]">Cardiología</strong>
          </article>
          <article className="min-h-[105px] rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.76)] px-[15px] pt-[15px] pb-[14px] shadow-[0_6px_20px_rgba(24,65,91,.025)] md:min-h-[120px]">
            <div className="flex min-h-10 items-start justify-between">
              <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#f0f8f5] text-[#197866]">
                <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24">
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </span>
              <span className="rounded-[3px] bg-[#effcf9] px-[7px] py-1 text-[10px] font-bold text-[#13a695]">
                {String(newThisMonth.length).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-0 mb-[5px] text-xs font-semibold uppercase text-[#354b61]">Nuevas este mes</p>
            <strong className="font-[Manrope,sans-serif] text-[23px] tracking-[-.04em] text-[#052f5d]">
              {newThisMonth.length ? newThisMonth.at(-1).name : 'Sin nuevas'}
            </strong>
          </article>
        </section>
      </div>
    </>
  );
}

export default SpecialtiesPage;
