import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { APPOINTMENTS_API_ROUTES } from '../constants/apiRoutes';

async function searchAppointments(filters, signal) {
  try {
    const response = await instance.get(APPOINTMENTS_API_ROUTES.search, {
      params: filters,
      signal,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getPatientAppointments(signal) {
  try {
    const pageSize = 50;
    const appointments = [];
    const appointmentIds = new Set();
    let pageIndex = 1;
    let total = Infinity;

    while (appointments.length < total) {
      const response = await instance.get(
        APPOINTMENTS_API_ROUTES.listForPatient,
        { params: { pageSize, pageIndex }, signal }
      );
      const page = response.data;
      const newAppointments = page.data.filter((appointment) => {
        if (appointmentIds.has(appointment.appointmentsId)) return false;

        appointmentIds.add(appointment.appointmentsId);

        return true;
      });

      appointments.push(...newAppointments);
      total = page.total;
      pageIndex += 1;

      if (newAppointments.length === 0) break;
    }

    return { data: appointments, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function bookAppointment({ doctorId, availabilitySlotId, dni, reason }) {
  try {
    const response = await instance.post(APPOINTMENTS_API_ROUTES.create, {
      doctorId,
      availabilitySlotId,
      patient: { dni: Number(dni) },
      reason,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function cancelAppointment(appointmentId) {
  try {
    const response = await instance.delete(
      APPOINTMENTS_API_ROUTES.cancel(appointmentId)
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export {
  bookAppointment,
  cancelAppointment,
  getPatientAppointments,
  searchAppointments,
};
