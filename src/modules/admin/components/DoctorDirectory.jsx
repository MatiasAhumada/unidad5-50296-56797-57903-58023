import { useMemo, useState } from 'react';

const doctors = [
  {
    id: 'james-wilson',
    initials: 'JW',
    name: 'Dr. James Wilson',
    specialty: 'Cardiología',
    status: 'Activo',
    searchable: 'james wilson cardiología',
    avatar: 'bg-[linear-gradient(145deg,#5cb6d2,#254d72)]',
  },
  {
    id: 'elena-rodriguez',
    initials: 'ER',
    name: 'Dra. Elena Rodríguez',
    specialty: 'Neurología',
    status: 'Activo',
    searchable: 'elena rodriguez neurología',
    avatar: 'bg-[linear-gradient(145deg,#1f777c,#c2e7d5)]',
  },
  {
    id: 'robert-chen',
    initials: 'RC',
    name: 'Dr. Robert Chen',
    specialty: 'Pediatría',
    status: 'De licencia',
    searchable: 'robert chen pediatría',
    avatar: 'bg-[linear-gradient(145deg,#faf8f2,#b2b8bc)] text-[#45617b]',
  },
];

const normalizeSearchText = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

function DoctorDirectory({ onAction }) {
  const [search, setSearch] = useState('');
  const visibleDoctors = useMemo(() => {
    const query = normalizeSearchText(search.trim());

    return query
      ? doctors.filter((doctor) =>
          normalizeSearchText(doctor.searchable).includes(query)
        )
      : doctors;
  }, [search]);

  return (
    <section
      className="overflow-hidden rounded-[5px] border border-[#cfdae3] bg-[rgba(255,255,255,.85)] shadow-[0_8px_25px_rgba(27,70,96,.035)]"
      id="doctores"
      aria-labelledby="directory-title"
    >
      <div className="flex min-h-[70px] flex-col items-start justify-between gap-[15px] border-b border-[#cfdae3] px-[15px] pt-[15px] pb-3 sm:flex-row sm:items-center">
        <div>
          <p className="mb-[7px] mt-0 text-[11px] font-bold tracking-[.12em] text-[#7e91a2] uppercase">Directorio</p>
          <h2 className="m-0 font-[Manrope,sans-serif] text-[17px] tracking-[-.025em] text-[#052f5d]" id="directory-title">Directorio de profesionales médicos</h2>
        </div>
        <label className="flex h-[39px] w-full items-center gap-2 rounded-[3px] border border-[#c7e4f2] bg-[#e5f5fd] px-[11px] text-[#52738a] sm:w-[220px]" htmlFor="doctor-search">
          <svg className="h-4 w-4 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse text-left text-[11px] text-[#536476]">
          <thead>
            <tr>
              <th className="h-[39px] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Nombre del doctor</th>
              <th className="h-[39px] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Especialidad</th>
              <th className="h-[39px] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Estado de disponibilidad</th>
              <th className="h-[39px] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibleDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="h-[68px] border-b border-[#d7e1e8] px-[15px]">
                  <div className="flex items-center gap-2.5 text-[#1d385a]">
                    <span className={`grid h-[26px] w-[26px] shrink-0 place-items-center overflow-hidden rounded-full border border-white/80 text-[8px] font-bold text-white shadow-[0_2px_5px_rgba(21,57,79,.16)] ${doctor.avatar}`}>
                      {doctor.initials}
                    </span>
                    <strong className="text-xs">{doctor.name}</strong>
                  </div>
                </td>
                <td className="h-[68px] border-b border-[#d7e1e8] px-[15px]">{doctor.specialty}</td>
                <td className="h-[68px] border-b border-[#d7e1e8] px-[15px]">
                  <span
                    className={`inline-flex items-center gap-[5px] rounded-[10px] px-2 py-[5px] text-[10px] font-bold ${doctor.status === 'Activo' ? 'bg-[#effbf8] text-[#0c9c8c]' : 'bg-[#fff9e9] text-[#cf8c00]'}`}
                  >
                    <i className="h-1 w-1 rounded-full bg-current" />
                    {doctor.status}
                  </span>
                </td>
                <td className="h-[68px] border-b border-[#d7e1e8] px-[15px]">
                  <button
                    className="inline-grid h-[30px] w-[30px] place-items-center rounded-[3px] border-0 bg-transparent p-0 font-bold text-[#5d7386] hover:bg-[#eef7fb] hover:text-[#052f5d]"
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
      <div className="flex min-h-[52px] items-center justify-between border-t border-[#d3e0e7] bg-[#e4f5fd] px-[15px] text-[10px] text-[#728394]">
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
