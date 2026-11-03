import { ChevronLeft, ChevronRight } from 'lucide-react';
import IconButton from './IconButton';

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
        <IconButton
          type="button"
          icon={ChevronLeft}
          label="Página anterior"
          variant="outline"
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        />
        <IconButton
          type="button"
          icon={ChevronRight}
          label="Página siguiente"
          variant="outline"
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        />
      </div>
    </div>
  );
}

export default TablePagination;
