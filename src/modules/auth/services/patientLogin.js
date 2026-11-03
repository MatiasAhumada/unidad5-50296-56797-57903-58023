import { instance } from '../../shared/api/axiosInstance';
import { AUTH_API_ROUTES } from '../constants/apiRoutes';

export const loginPatient = async (email, dni) => {
  const response = await instance.post(
    AUTH_API_ROUTES.patientLogin,
    { email, dni: Number(dni) },
    { skipAuthRedirect: true }
  );

  return { data: response.data, error: null };
};
