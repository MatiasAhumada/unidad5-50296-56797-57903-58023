import { instance } from '../../shared/api/axiosInstance';
import { AUTH_API_ROUTES } from '../constants/apiRoutes';

export const loginPatient = async (username, password) => {
  const response = await instance.post(
    AUTH_API_ROUTES.patientLogin,
    { username, password },
    { skipAuthRedirect: true }
  );

  return { data: response.data, error: null };
};
