import IconButton from './IconButton';
import { ICONS } from '../constants/icons';

function TablePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const validPage = Math.max(1, Number(currentPage) || 1);
  const from = totalItems === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const to = Math.min(validPage * pageSize, totalItems);

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
          onClick={() => onPageChange && onPageChange(validPage - 1)}
          disabled={validPage <= 1}
        />
        <IconButton
          type="button"
          icon={ICONS.next}
          label="Página siguiente"
          variant="outline"
          onClick={() => onPageChange && onPageChange(validPage + 1)}
          disabled={validPage >= totalPages}
        />
      </div>
    </div>
  );
}

export default TablePagination;
