function TablePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
      <span>
        Mostrando {from} a {to} de {totalItems} registros
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default TablePagination;
