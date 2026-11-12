import { createApiResultService } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { APPOINTMENTS_API_ROUTES } from '../constants/apiRoutes';

async function searchAppointments(filters, signal) {
  const response = await instance.get(APPOINTMENTS_API_ROUTES.search, {
    params: filters,
    signal,
  });

  return response.data;
}

async function getPatientAppointments(signal) {
  const pageSize = 50;
  const appointments = [];
  const appointmentIds = new Set();
  let pageIndex = 1;
  let total = Infinity;

  while (appointments.length < total) {
    const response = await instance.get(
      APPOINTMENTS_API_ROUTES.listForPatient,
      {
        params: { pageSize, pageIndex },
        signal,
      }
    );
    const page = response.data;

    const newAppointments = page.data.filter((appointment) => {
      if (appointmentIds.has(appointment.appointmentsId)) {
        return false;
      }

      appointmentIds.add(appointment.appointmentsId);

      return true;
    });

    appointments.push(...newAppointments);
    total = page.total;
    pageIndex += 1;

    if (newAppointments.length === 0) {
      break;
    }
  }

  return appointments;
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

async function markAppointmentAttendance(appointmentId, attended) {
  const response = await instance.put(
    APPOINTMENTS_API_ROUTES.attendance(appointmentId),
    { attended }
  );

  return response.data;
}

const bookAppointmentWithResult = createApiResultService(bookAppointment);
const cancelAppointmentWithResult = createApiResultService(cancelAppointment);
const getPatientAppointmentsWithResult = createApiResultService(
  getPatientAppointments
);
const markAppointmentAttendanceWithResult = createApiResultService(
  markAppointmentAttendance
);
const searchAppointmentsWithResult = createApiResultService(searchAppointments);

export {
  bookAppointmentWithResult as bookAppointment,
  cancelAppointmentWithResult as cancelAppointment,
  getPatientAppointmentsWithResult as getPatientAppointments,
  markAppointmentAttendanceWithResult as markAppointmentAttendance,
  searchAppointmentsWithResult as searchAppointments,
};
