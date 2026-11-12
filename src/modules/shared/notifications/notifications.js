import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

const notification = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4500,
  timerProgressBar: true,
  customClass: {
    popup: 'rounded-2xl shadow-xl',
    title: 'text-base font-bold text-med-primary-900',
    htmlContainer: 'text-sm text-med-text-sub',
    timerProgressBar: 'bg-med-primary-600',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

function showSuccess(message, options = {}) {
  return notification.fire({
    icon: 'success',
    title: 'Operación completada',
    ...options,
    text: message,
  });
}

function showError(message, options = {}) {
  return notification.fire({
    icon: 'error',
    title: 'No se pudo completar la operación',
    ...options,
    text: message,
  });
}

function showWarning(message, options = {}) {
  return notification.fire({
    icon: 'warning',
    title: 'Atención',
    ...options,
    text: message,
  });
}

function showInfo(message, options = {}) {
  return notification.fire({
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
