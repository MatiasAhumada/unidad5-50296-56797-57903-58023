import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { AVAILABILITIES_API_ROUTES } from '../constants/apiRoutes';

async function createDoctorAvailability(payload) {
  try {
    const response = await instance.post(
      AVAILABILITIES_API_ROUTES.base,
      payload
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

async function updateDoctorAvailability(payload) {
  try {
    const response = await instance.put(
      AVAILABILITIES_API_ROUTES.base,
      payload
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export { createDoctorAvailability, updateDoctorAvailability };
