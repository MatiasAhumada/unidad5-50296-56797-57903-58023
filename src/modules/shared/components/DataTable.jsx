import { useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import IconButton from './IconButton';
import TablePagination from './TablePagination';

function getCellValue(row, accessor) {
  if (typeof accessor === 'function') {
    return accessor(row);
  }

  return accessor ? row?.[accessor] : undefined;
}

function DataTable({
  title,
  headerContent,
  columns = [],
  rows = [],
  rowKey = 'id',
  rowActions = [],
  isLoading = false,
  loadingMessage = 'Cargando registros…',
  emptyMessage = 'No se encontraron registros.',
  error = '',
  onRetry,
  retryLabel = 'Reintentar',
  pagination = null,
  footer = null,
}) {
  const pageSize = pagination?.pageSize || 10;
  const total = pagination?.total ?? rows.length;
  const pageIndex = pagination?.pageIndex || 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const onPageChange = pagination?.onPageChange;
  const visibleRows = pagination ? rows.slice(0, pageSize) : rows;
  const hasActions = rowActions.length > 0;

  useEffect(() => {
    if (!isLoading && !error && onPageChange && pageIndex > totalPages) {
      onPageChange(totalPages);
    }
  }, [error, isLoading, onPageChange, pageIndex, totalPages]);

  return (
    <Card className="overflow-hidden p-0">
      {(title || headerContent) && (
        <div
          className={
            headerContent
              ? 'flex flex-col gap-4 border-b border-med-border p-5 sm:flex-row sm:items-center sm:justify-between'
              : 'border-b border-med-border p-5'
          }
        >
          {title && (
            <h2 className="text-base font-bold text-med-primary-900">
              {title}
            </h2>
          )}
          {headerContent}
        </div>
      )}

      {isLoading && rows.length === 0 ? (
        <p className="p-5 text-sm text-med-text-sub" role="status">
          {loadingMessage}
        </p>
      ) : error ? (
        <div className="flex flex-col items-start gap-3 p-5" role="alert">
          <p className="text-sm text-med-text-sub">{error}</p>
          {onRetry && (
            <button
              type="button"
              className="text-sm font-semibold text-med-primary-700 underline"
              onClick={onRetry}
            >
              {retryLabel}
            </button>
          )}
        </div>
      ) : visibleRows.length === 0 ? (
        <p className="p-5 text-sm text-med-text-sub">{emptyMessage}</p>
      ) : (
        <>
          {isLoading && (
            <p className="sr-only" role="status">
              Actualizando registros…
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      scope="col"
                      className={`px-6 py-3.5 ${col.headerClassName ?? ''}`.trim()}
                    >
                      {col.header}
                    </th>
                  ))}
                  {hasActions && (
                    <th scope="col" className="px-6 py-3.5 text-right">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-med-border-subtle">
                {visibleRows.map((row) => {
                  const key =
                    typeof rowKey === 'function' ? rowKey(row) : row[rowKey];
                  const actions = rowActions.filter((action) =>
                    action.isVisible ? action.isVisible(row) : true
                  );

                  return (
                    <tr key={key} className="hover:bg-gray-50/70">
                      {columns.map((col) => {
                        const value = getCellValue(row, col.accessor);

                        return (
                          <td
                            key={col.id}
                            className={`px-6 py-4 ${col.cellClassName ?? ''}`.trim()}
                          >
                            {col.render ? col.render(row, value) : value}
                          </td>
                        );
                      })}
                      {hasActions && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {actions.map((action) => {
                              const disabled =
                                isLoading || Boolean(action.isDisabled?.(row));
                              const label =
                                typeof action.label === 'function'
                                  ? action.label(row)
                                  : action.label;

                              if (action.render) {
                                return (
                                  <div
                                    key={action.id}
                                    className="inline-flex items-center"
                                  >
                                    {action.render(row, { disabled, label })}
                                  </div>
                                );
                              }

                              const actionIcon =
                                typeof action.icon === 'function'
                                  ? action.icon(row)
                                  : action.icon;
                              const actionVariant =
                                typeof action.variant === 'function'
                                  ? action.variant(row)
                                  : action.variant;
                              const actionClassName =
                                typeof action.className === 'function'
                                  ? action.className(row)
                                  : (action.className ?? '');

                              return actionIcon ? (
                                <IconButton
                                  key={action.id}
                                  type="button"
                                  icon={actionIcon}
                                  label={label}
                                  variant={actionVariant ?? 'ghost'}
                                  className={actionClassName}
                                  disabled={disabled}
                                  onClick={() => action.onClick(row)}
                                />
                              ) : (
                                <Button
                                  key={action.id}
                                  type="button"
                                  variant={actionVariant ?? 'outline'}
                                  className={actionClassName}
                                  disabled={disabled}
                                  aria-label={label}
                                  onClick={() => action.onClick(row)}
                                >
                                  {label}
                                </Button>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {footer ??
            (pagination && (
              <TablePagination
                currentPage={pageIndex}
                pageSize={pageSize}
                totalItems={total}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            ))}
        </>
      )}
    </Card>
  );
}

export default DataTable;
