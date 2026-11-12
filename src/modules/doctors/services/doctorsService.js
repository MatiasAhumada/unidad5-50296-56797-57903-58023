import { createApiResultService } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { DOCTORS_API_ROUTES } from '../constants/apiRoutes';

async function getDoctorsPage(
  { pageSize = 10, pageIndex = 1, name, specialtyId, includeInactive },
  signal
) {
  const response = await instance.get(DOCTORS_API_ROUTES.list, {
    params: { pageSize, pageIndex, name, specialtyId, includeInactive },
    signal,
  });

  return response.data;
}

async function getDoctors(signal, includeInactive = false) {
  const pageSize = 100;
  const doctors = [];
  let pageIndex = 1;
  let total = Infinity;

  while (doctors.length < total) {
    const page = await getDoctorsPage(
      { pageSize, pageIndex, includeInactive },
      signal
    );

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

async function createDoctor({ name, licenseNumber, specialtyId }) {
  const response = await instance.post(DOCTORS_API_ROUTES.create, {
    name,
    licenseNumber,
    specialtyId,
  });

  return response.data;
}

async function updateDoctor(id, { name, licenseNumber, specialtyId }) {
  const response = await instance.put(DOCTORS_API_ROUTES.update(id), {
    name,
    licenseNumber,
    specialtyId,
  });

  return response.data;
}

async function deleteDoctor(id) {
  const response = await instance.delete(DOCTORS_API_ROUTES.delete(id));

  return response.data;
}

async function toggleDoctorStatus(id, isActive) {
  const response = await instance.put(DOCTORS_API_ROUTES.status(id), {
    isActive,
  });

  return response.data;
}

async function getDoctorAvailabilities(doctorId, signal) {
  const response = await instance.get(
    DOCTORS_API_ROUTES.availabilities(doctorId),
    { signal }
  );

  return response.data;
}

async function saveDoctorAvailabilities({ doctorId, days }, isUpdate = false) {
  const method = isUpdate ? 'put' : 'post';
  const response = await instance[method](DOCTORS_API_ROUTES.saveAvailability, {
    doctorId,
    days,
  });

  return response.data;
}

const createDoctorWithResult = createApiResultService(createDoctor);
const deleteDoctorWithResult = createApiResultService(deleteDoctor);
const getDoctorAvailableSlotsWithResult = createApiResultService(
  getDoctorAvailableSlots
);
const getDoctorAvailabilitiesWithResult = createApiResultService(
  getDoctorAvailabilities
);
const getDoctorOptionsWithResult = createApiResultService(getDoctorOptions);
const getDoctorsWithResult = createApiResultService(getDoctors);
const getDoctorsPageWithResult = createApiResultService(getDoctorsPage);
const saveDoctorAvailabilitiesWithResult = createApiResultService(
  saveDoctorAvailabilities
);
const toggleDoctorStatusWithResult = createApiResultService(toggleDoctorStatus);
const updateDoctorWithResult = createApiResultService(updateDoctor);

export {
  createDoctorWithResult as createDoctor,
  deleteDoctorWithResult as deleteDoctor,
  getDoctorAvailableSlotsWithResult as getDoctorAvailableSlots,
  getDoctorAvailabilitiesWithResult as getDoctorAvailabilities,
  getDoctorOptionsWithResult as getDoctorOptions,
  getDoctorsWithResult as getDoctors,
  getDoctorsPageWithResult as getDoctorsPage,
  saveDoctorAvailabilitiesWithResult as saveDoctorAvailabilities,
  toggleDoctorStatusWithResult as toggleDoctorStatus,
  updateDoctorWithResult as updateDoctor,
};
