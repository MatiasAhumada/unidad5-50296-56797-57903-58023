function SpecialtyTable({ specialties, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] table-fixed border-collapse text-left text-[11px] text-[#536476]">
        <thead>
          <tr>
            <th className="h-[39px] w-[34%] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Nombre de la especialidad</th>
            <th className="h-[39px] w-[18%] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Descripción</th>
            <th className="h-[39px] w-[30%] bg-[#e4f5fd] px-[15px] text-left text-[10px] font-bold tracking-[.04em] text-[#506174]">Estado</th>
            <th className="h-[39px] w-[18%] bg-[#e4f5fd] px-[15px] text-center text-[10px] font-bold tracking-[.04em] text-[#506174]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((specialty) => (
            <tr className="border-b border-[#d7e1e8] hover:bg-[#f7fbfd] last:border-0" key={specialty.id}>
              <td className="h-[68px] px-[15px]">
                <div className="flex items-center gap-2.5 text-[#1d385a]">
                  <span className="grid h-[26px] w-[26px] shrink-0 place-items-center overflow-hidden rounded-full border border-white/80 bg-[linear-gradient(145deg,#5cb6d2,#254d72)] text-[8px] font-bold text-white shadow-[0_2px_5px_rgba(21,57,79,.16)]">
                    {specialty.name.charAt(0).toUpperCase()}
                  </span>
                  <strong className="text-xs">{specialty.name}</strong>
                </div>
              </td>
              <td className="h-[68px] px-[15px]">{specialty.description}</td>
              <td className="h-[68px] px-[15px]">
                <span className={`inline-flex items-center gap-[5px] rounded-[10px] px-2 py-[5px] text-[10px] font-bold ${specialty.status === 'active' ? 'bg-[#effbf8] text-[#0c9c8c]' : 'bg-[#fff9e9] text-[#cf8c00]'}`}>
                  <i className="h-1 w-1 rounded-full bg-current" />
                  {specialty.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="h-[68px] px-[15px] text-center">
                <button className="inline-grid h-[30px] w-[30px] place-items-center rounded-[3px] border-0 bg-transparent p-0 font-bold text-[#5d7386] hover:bg-[#eef7fb] hover:text-[#052f5d]" type="button" aria-label={`Editar ${specialty.name}`} onClick={() => onEdit(specialty)}>
                  ✎
                </button>
                <button className="inline-grid h-[30px] w-[30px] place-items-center rounded-[3px] border-0 bg-transparent p-0 font-bold text-[#5d7386] hover:bg-[#fff0f0] hover:text-[#b74343]" type="button" aria-label={`Eliminar ${specialty.name}`} onClick={() => onDelete(specialty)}>
                  <svg className="h-[15px] w-[15px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.55]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {specialties.length === 0 && (
            <tr>
              <td colSpan="4" className="h-[68px] px-[15px] text-center">
                No se encontraron especialidades.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SpecialtyTable;
