import StatusMessage from './StatusMessage';

export default function FeedbackAlerts({
  actionSuccess,
  actionError,
  queryError,
  onRetry,
  retryLabel = 'Reintentar',
}) {
  return (
    <>
      {actionSuccess && (
        <StatusMessage variant="success">{actionSuccess}</StatusMessage>
      )}

      {actionError && (
        <StatusMessage variant="error">{actionError}</StatusMessage>
      )}

      {queryError && (
        <div className="flex flex-col items-start gap-3">
          <StatusMessage variant="error">{queryError}</StatusMessage>
          {onRetry && (
            <button
              type="button"
              className="text-sm font-semibold text-med-primary-700 underline cursor-pointer"
              onClick={onRetry}
            >
              {retryLabel}
            </button>
          )}
        </div>
      )}
    </>
  );
}
