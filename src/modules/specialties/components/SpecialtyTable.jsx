function SpecialtyTable({ specialties, onEdit, onDelete }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Nombre de la especialidad</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((specialty) => (
            <tr key={specialty.id}>
              <td>
                <div className="doctor-name">
                  <span className="avatar avatar--james">
                    {specialty.name.charAt(0).toUpperCase()}
                  </span>
                  <strong>{specialty.name}</strong>
                </div>
              </td>
              <td>{specialty.description}</td>
              <td>
                <span
                  className={`availability ${specialty.status === 'active' ? 'availability--active' : 'availability--leave'}`}
                >
                  <i />
                  {specialty.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="specialty-actions">
                <button
                  className="row-action"
                  type="button"
                  aria-label={`Editar ${specialty.name}`}
                  onClick={() => onEdit(specialty)}
                >
                  ✎
                </button>
                <button
                  className="row-action"
                  type="button"
                  aria-label={`Eliminar ${specialty.name}`}
                  onClick={() => onDelete(specialty)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {specialties.length === 0 && (
            <tr>
              <td colSpan="4" className="empty-state">
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
