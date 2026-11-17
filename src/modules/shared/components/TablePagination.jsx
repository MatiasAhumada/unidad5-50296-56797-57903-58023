import IconButton from './IconButton';
import { ICONS } from '../constants/icons';

function TablePagination({
  currentPage = 1,
  totalPages,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const safeTotalPages = Math.max(
    1,
    totalPages || Math.ceil(totalItems / pageSize)
  );
  const safePage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
      <span>
        Mostrando {from} a {to} de {totalItems} registros
      </span>
      <div className="flex items-center gap-1">
        <IconButton
          type="button"
          icon={ICONS.previous}
          label="Página anterior"
          variant="outline"
          onClick={() => onPageChange && onPageChange(safePage - 1)}
          disabled={safePage <= 1}
        />
        <IconButton
          type="button"
          icon={ICONS.next}
          label="Página siguiente"
          variant="outline"
          onClick={() => onPageChange && onPageChange(safePage + 1)}
          disabled={safePage >= safeTotalPages}
        />
      </div>
    </div>
  );
}

export default TablePagination;
