import { getApiErrorMessage } from '../../shared/api/apiError';
import { APPOINTMENT_ERROR_MESSAGES } from '../constants/appointmentErrors';

function getAppointmentErrorMessage(error) {
  return (
    APPOINTMENT_ERROR_MESSAGES[error?.errorCode] ??
    (error?.status === 404 ? APPOINTMENT_ERROR_MESSAGES.NOT_FOUND : null) ??
    getApiErrorMessage(error)
  );
}

export { getAppointmentErrorMessage };
