import { normalizeApiError } from '../../shared/api/apiError';
import { instance } from '../../shared/api/axiosInstance';
import { AUTH_API_ROUTES } from '../constants/apiRoutes';

async function loginPatient(email, dni) {
  try {
    const response = await instance.post(
      AUTH_API_ROUTES.patientLogin,
      { email, dni: Number(dni) },
      { skipAuthRedirect: true }
    );

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: normalizeApiError(error) };
  }
}

export { loginPatient };
