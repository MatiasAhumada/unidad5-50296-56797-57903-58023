import Swal from 'sweetalert2';
import './notifications.css';

const notification = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4500,
  timerProgressBar: true,
  customClass: {
    popup: 'med-notification',
    title: 'med-notification__title',
    timerProgressBar: 'med-notification__progress',
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
      popup: 'med-confirmation',
      title: 'med-confirmation__title',
      htmlContainer: 'med-confirmation__message',
      actions: 'med-confirmation__actions',
      confirmButton:
        'med-confirmation__button med-confirmation__button--confirm',
      cancelButton: 'med-confirmation__button med-confirmation__button--cancel',
    },
    ...options,
    text: message,
  });

  return result.isConfirmed;
}

export { confirmAction, showError, showInfo, showSuccess, showWarning };
