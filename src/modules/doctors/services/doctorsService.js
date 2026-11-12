import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { DOCTORS_API_ROUTES } from '../constants/apiRoutes';

async function getDoctorsPage(
  { pageSize = 10, pageIndex = 1, name, specialtyId },
  signal
) {
  try {
    const response = await instance.get(DOCTORS_API_ROUTES.list, {
      params: { pageSize, pageIndex, name, specialtyId },
      signal,
    });

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getDoctors(signal) {
  try {
    const pageSize = 100;
    const doctors = [];
    let pageIndex = 1;
    let total = Infinity;

    while (doctors.length < total) {
      const response = await instance.get(DOCTORS_API_ROUTES.list, {
        params: { pageSize, pageIndex },
        signal,
      });
      const page = response.data;

      doctors.push(...page.data);
      total = page.total;

      if (page.data.length === 0) break;

      pageIndex += 1;
    }

    return { data: doctors, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getDoctorOptions(specialtyId, signal) {
  try {
    const response = await instance.get(
      DOCTORS_API_ROUTES.optionsBySpecialty(specialtyId),
      { signal }
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function getDoctorAvailableSlots(doctorId, startDate, endDate, signal) {
  try {
    const response = await instance.get(
      DOCTORS_API_ROUTES.availableSlots(doctorId),
      { params: { startDate, endDate }, signal }
    );
    const slots = response.data.map((slot) => ({
      id: slot.availabilitySlotId,
      date: slot.date.slice(0, 10),
      startTime: slot.startTime.slice(0, 5),
      endTime: slot.endTime.slice(0, 5),
    }));

    return { data: slots, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export {
  getDoctorAvailableSlots,
  getDoctorOptions,
  getDoctors,
  getDoctorsPage,
};
