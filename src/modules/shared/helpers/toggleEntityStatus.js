import {
  confirmAction,
  showError,
  showSuccess,
} from '../notifications/notifications';

async function toggleEntityStatus({
  currentlyActive,
  confirmMessage,
  activatedMessage,
  deactivatedMessage,
  onToggle,
  onSuccess,
}) {
  const confirmed = await confirmAction(confirmMessage);

  if (!confirmed) return false;

  const { error } = await onToggle(!currentlyActive);

  if (error) {
    showError(error.message);

    return false;
  }

  showSuccess(currentlyActive ? deactivatedMessage : activatedMessage);
  onSuccess?.();

  return true;
}

export { toggleEntityStatus };
