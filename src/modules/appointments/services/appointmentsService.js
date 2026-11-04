import { instance } from '../../shared/api/axiosInstance';
import { APPOINTMENTS_API_ROUTES } from '../constants/apiRoutes';

async function getPatientAppointments(dni, signal) {
  const response = await instance.get(APPOINTMENTS_API_ROUTES.listForPatient, {
    params: { dni },
    signal,
  });

  return response.data;
}

async function bookAppointment({ doctorId, availabilitySlotId, dni, reason }) {
  const response = await instance.post(APPOINTMENTS_API_ROUTES.create, {
    doctorId,
    availabilitySlotId,
    patient: { dni: Number(dni) },
    reason,
  });

  return response.data;
}

async function cancelAppointment(appointmentId) {
  const response = await instance.delete(
    APPOINTMENTS_API_ROUTES.cancel(appointmentId)
  );

  return response.data;
}

export { bookAppointment, cancelAppointment, getPatientAppointments };
