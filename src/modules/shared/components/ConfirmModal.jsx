import Button from './Button';
import StatusMessage from './StatusMessage';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  error = '',
  confirmText = 'Sí, dar de baja',
  loadingText = 'Dando de baja…',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-med-border">
        <h3 className="text-base font-bold text-med-primary-900">{title}</h3>
        <div className="mt-2 text-xs text-med-text-sub">{message}</div>

        {error && (
          <div className="mt-3">
            <StatusMessage variant="error">{error}</StatusMessage>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
