import { instance } from '../../shared/api/axiosInstance';
import { DOCTORS_API_ROUTES } from '../constants/apiRoutes';

async function getDoctorOptions(specialtyId, signal) {
  const response = await instance.get(
    DOCTORS_API_ROUTES.optionsBySpecialty(specialtyId),
    { signal }
  );

  return response.data;
}

async function getDoctorAvailabilities(doctorId, signal) {
  const response = await instance.get(
    DOCTORS_API_ROUTES.availabilities(doctorId),
    { signal }
  );

  return response.data;
}

export { getDoctorAvailabilities, getDoctorOptions };
