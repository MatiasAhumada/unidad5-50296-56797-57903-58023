import { instance } from '../../shared/api/axiosInstance';
import { DOCTORS_API_ROUTES } from '../constants/apiRoutes';

async function getDoctorsPage(
  { pageSize = 10, pageIndex = 1, name, specialtyId },
  signal
) {
  const response = await instance.get(DOCTORS_API_ROUTES.list, {
    params: { pageSize, pageIndex, name, specialtyId },
    signal,
  });

  return response.data;
}

async function getDoctors(signal) {
  const pageSize = 100;
  const doctors = [];
  let pageIndex = 1;
  let total = Infinity;

  while (doctors.length < total) {
    const page = await getDoctorsPage({ pageSize, pageIndex }, signal);

    doctors.push(...page.data);
    total = page.total;

    if (page.data.length === 0) {
      break;
    }

    pageIndex += 1;
  }

  return doctors;
}

async function getDoctorOptions(specialtyId, signal) {
  const response = await instance.get(
    DOCTORS_API_ROUTES.optionsBySpecialty(specialtyId),
    { signal }
  );

  return response.data;
}

async function getDoctorAvailableSlots(doctorId, startDate, endDate, signal) {
  const response = await instance.get(
    DOCTORS_API_ROUTES.availableSlots(doctorId),
    { params: { startDate, endDate }, signal }
  );

  return response.data.map((slot) => ({
    id: slot.availabilitySlotId,
    date: slot.date.slice(0, 10),
    startTime: slot.startTime.slice(0, 5),
    endTime: slot.endTime.slice(0, 5),
  }));
}

export {
  getDoctorAvailableSlots,
  getDoctorOptions,
  getDoctors,
  getDoctorsPage,
};
