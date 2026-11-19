import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 639px)';

const baseNotificationConfig = {
  showConfirmButton: false,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-2xl shadow-xl',
    title: 'text-base font-bold text-med-primary-900',
    htmlContainer: 'text-sm text-med-text-sub',
    timerProgressBar: 'bg-med-primary-600',
  },
};

const toastNotification = Swal.mixin({
  ...baseNotificationConfig,
  toast: true,
  position: 'top-end',
  timer: 4500,
  didOpen: (popup) => {
    popup.addEventListener('mouseenter', Swal.stopTimer);
    popup.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const mobileNotification = Swal.mixin({
  ...baseNotificationConfig,
  toast: false,
  position: 'center',
  timer: 5000,
});

function isMobileViewport() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
  );
}

function fireNotification(config) {
  return isMobileViewport()
    ? mobileNotification.fire(config)
    : toastNotification.fire(config);
}

function showSuccess(message, options = {}) {
  return fireNotification({
    icon: 'success',
    title: 'Operación completada',
    ...options,
    text: message,
  });
}

function showError(message, options = {}) {
  return fireNotification({
    icon: 'error',
    title: 'No se pudo completar la operación',
    ...options,
    text: message,
  });
}

function showWarning(message, options = {}) {
  return fireNotification({
    icon: 'warning',
    title: 'Atención',
    ...options,
    text: message,
  });
}

function showInfo(message, options = {}) {
  return fireNotification({
    icon: 'info',
    title: 'Información',
    ...options,
    text: message,
  });
}

async function confirmAction(message, options = {}) {
  const result = await Swal.fire({
    icon: 'warning',
    title: '¿Estás seguro?',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-med-primary-900',
      htmlContainer: 'text-med-text-sub',
      actions:
        'flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center',
      confirmButton:
        'min-h-11 rounded-lg bg-med-primary-900 px-4 py-2 font-semibold text-white hover:bg-med-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700',
      cancelButton:
        'min-h-11 rounded-lg border border-med-border bg-white px-4 py-2 font-semibold text-med-text-main hover:bg-med-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700',
    },
    ...options,
    text: message,
  });

  return result.isConfirmed;
}

export { confirmAction, showError, showInfo, showSuccess, showWarning };
